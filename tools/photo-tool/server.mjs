// Local-only photo tool for sailkcaj.com. Run with `npm run photos`.
// Never touches the live/deployed site — it only reads slot names from the
// site's own source files and writes JPEGs into public/images/... on disk.
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

import { slugify } from '../../src/slugify.js';
import { roles, projects, mediaCredits } from '../../src/siteData.js';
import { countriesVisited } from '../../src/data/countries.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const IMAGES_ROOT = path.join(REPO_ROOT, 'public', 'images');
const PORT = 5050;
const MAX_DIMENSION = 2000; // longest side, px — anything bigger gets downscaled
const JPEG_QUALITY = 85;

fs.mkdirSync(IMAGES_ROOT, { recursive: true });

// ---- Build the list of photo slots straight from the site's own content ----
// Add a role/project/media credit/country in src/siteData.js or
// src/data/countries.js and it shows up here automatically — this file
// never needs to change.
function buildSlots() {
  const slots = [];

  slots.push({ id: 'hero', category: 'Profile', label: 'Hero photo', relPath: 'hero.jpg' });

  for (const r of roles) {
    slots.push({
      id: `company-${slugify(r.company)}`,
      category: 'Company logos',
      label: r.company,
      relPath: `companies/${slugify(r.company)}.jpg`,
    });
  }

  for (const p of projects) {
    slots.push({
      id: `project-${slugify(p.name)}`,
      category: 'Project screenshots',
      label: p.name,
      relPath: `projects/${slugify(p.name)}.jpg`,
    });
  }

  for (const m of mediaCredits) {
    slots.push({
      id: `media-${slugify(m.title)}`,
      category: 'Acting & modeling',
      label: `${m.title} — ${m.role}`,
      relPath: `media/${slugify(m.title)}.jpg`,
    });
  }

  const seenCountries = new Set();
  for (const c of countriesVisited) {
    if (seenCountries.has(c.country)) continue;
    seenCountries.add(c.country);
    slots.push({
      id: `country-${slugify(c.country)}`,
      category: 'Travel — countries',
      label: c.country,
      relPath: `countries/${slugify(c.country)}.jpg`,
    });
  }

  return slots;
}

const SLOTS = buildSlots();
const slotsById = new Map(SLOTS.map((s) => [s.id, s]));

function slotStatus(slot) {
  const abs = path.join(IMAGES_ROOT, slot.relPath);
  try {
    const st = fs.statSync(abs);
    return { ...slot, exists: true, url: `/images/${slot.relPath}?t=${Math.round(st.mtimeMs)}` };
  } catch {
    return { ...slot, exists: false, url: null };
  }
}

// ---- Format conversion ----
function isHeic(buffer, filename) {
  const ext = path.extname(filename || '').toLowerCase();
  if (ext === '.heic' || ext === '.heif') return true;
  // Magic-byte sniff (ISO-BMFF 'ftyp' box + a HEIC/HEIF brand) in case a
  // phone hands us a HEIC file under a misleading name/extension.
  if (buffer.length > 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12);
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) return true;
  }
  return false;
}

async function toWebJpeg(buffer, filename) {
  let working = buffer;
  if (isHeic(buffer, filename)) {
    // heic-convert is pure JS (WASM libheif under the hood) so this works
    // the same on every machine, regardless of how sharp's libvips was built.
    working = Buffer.from(await heicConvert({ buffer, format: 'JPEG', quality: 0.92 }));
  }
  return sharp(working)
    .rotate() // auto-orient from EXIF (iPhone photos are often stored sideways), then strips it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

// ---- Server ----
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const app = express();
app.use(express.json());
app.use('/images', express.static(IMAGES_ROOT));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/slots', (req, res) => {
  res.json(SLOTS.map(slotStatus));
});

app.post('/api/upload', upload.single('photo'), async (req, res) => {
  try {
    const slot = slotsById.get(req.body.slotId);
    if (!slot) return res.status(400).json({ error: 'Unknown slot' });
    if (!req.file) return res.status(400).json({ error: 'No file received' });

    const jpeg = await toWebJpeg(req.file.buffer, req.file.originalname);
    const abs = path.join(IMAGES_ROOT, slot.relPath);
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.writeFile(abs, jpeg);

    res.json({ ok: true, slot: slotStatus(slot) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Could not convert that file' });
  }
});

app.post('/api/move', async (req, res) => {
  try {
    const from = slotsById.get(req.body.fromSlotId);
    const to = slotsById.get(req.body.toSlotId);
    if (!from || !to) return res.status(400).json({ error: 'Unknown slot' });
    const fromAbs = path.join(IMAGES_ROOT, from.relPath);
    const toAbs = path.join(IMAGES_ROOT, to.relPath);
    if (!fs.existsSync(fromAbs)) return res.status(400).json({ error: 'That slot is empty' });

    await fsp.mkdir(path.dirname(toAbs), { recursive: true });
    if (fs.existsSync(toAbs)) {
      // Destination occupied: swap rather than silently destroy a photo.
      const tmp = `${toAbs}.swap-${Date.now()}`;
      await fsp.rename(toAbs, tmp);
      await fsp.rename(fromAbs, toAbs);
      await fsp.rename(tmp, fromAbs);
    } else {
      await fsp.rename(fromAbs, toAbs);
    }

    res.json({ ok: true, from: slotStatus(from), to: slotStatus(to) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Move failed' });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const slot = slotsById.get(req.body.slotId);
    if (!slot) return res.status(400).json({ error: 'Unknown slot' });
    await fsp.rm(path.join(IMAGES_ROOT, slot.relPath), { force: true });
    res.json({ ok: true, slot: slotStatus(slot) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\nPhoto tool running at ${url} — drag photos onto any box.\n`);
  const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${openCmd} ${url}`, () => {});
});
