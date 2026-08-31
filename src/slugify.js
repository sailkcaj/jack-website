// Shared by App.jsx, TravelGlobe.jsx and tools/photo-tool/server.mjs so every
// part of the site agrees on how a name turns into a filename.
// 'Morgan Stanley' -> 'morgan-stanley', 'BoohooMAN' -> 'boohooman'.
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
