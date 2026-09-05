import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const DOC_PATH = ['timeData', 'notes'];
const LEGACY_STORAGE_KEY = 'sailkcaj-time-notes-v1';

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeDays(rawDays) {
  if (!rawDays || typeof rawDays !== 'object') return {};
  const clean = {};
  for (const key of Object.keys(rawDays)) {
    const day = rawDays[key];
    clean[key] = Array.isArray(day)
      ? day.filter((n) => n && typeof n.start === 'number' && typeof n.end === 'number' && typeof n.text === 'string')
      : [];
  }
  return clean;
}

// Reads whatever this specific browser saved back when the Time tab was
// localStorage-only (pre-2026-09-05). Only ever consulted by an explicit
// "import" action — never automatically.
function readLegacyLocalNotes() {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) return null;
    return sanitizeDays(parsed);
  } catch {
    return null;
  }
}

// Free-text notes tied to a time range within a day, shared across every
// browser/device via Firestore — same model and same safety pattern as
// useTimeLog (a ref as the source of truth for "as of right now", writes
// tied to explicit actions, nothing persisted before the first load
// completes), kept in its own document so this feature can never touch or
// migrate the hour-log data.
export default function useTimeNotes() {
  const [notes, setNotes] = useState(null); // null = not loaded from Firestore yet
  const notesRef = useRef({});
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    const ref = doc(db, ...DOC_PATH);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const clean = sanitizeDays(snap.exists() ? snap.data().days : {});
        notesRef.current = clean;
        hasLoadedOnce.current = true;
        setNotes(clean);
      },
      (err) => {
        console.error('Time notes sync error:', err);
      }
    );
    return unsubscribe;
  }, []);

  const persist = useCallback((next) => {
    if (!auth.currentUser) return;
    if (!hasLoadedOnce.current) {
      console.warn('Refusing to save time notes before the initial load completed.');
      return;
    }
    setDoc(doc(db, ...DOC_PATH), { days: next }).catch((err) => {
      console.error('Failed to save time notes:', err);
    });
  }, []);

  const notesForDay = useCallback((key) => (notes && notes[key]) || [], [notes]);

  // start/end are half-hour slot indices (0-47 / 1-48), covering [start, end).
  const addNote = useCallback((key, { start, end, text }) => {
    const base = notesRef.current;
    const day = base[key] ? [...base[key]] : [];
    day.push({ id: makeId(), start, end, text });
    day.sort((a, b) => a.start - b.start);
    const next = { ...base, [key]: day };
    notesRef.current = next;
    setNotes(next);
    persist(next);
  }, [persist]);

  const deleteNote = useCallback((key, id) => {
    const base = notesRef.current;
    const day = base[key];
    if (!day) return;
    const filtered = day.filter((n) => n.id !== id);
    const next = { ...base };
    if (filtered.length) next[key] = filtered; else delete next[key];
    notesRef.current = next;
    setNotes(next);
    persist(next);
  }, [persist]);

  // One-time recovery path, mirroring useTimeLog's importLegacyLocalData —
  // local days only fill in dates the shared notes doc doesn't already have.
  const importLegacyLocalData = useCallback(() => {
    const legacy = readLegacyLocalNotes();
    if (!legacy) return false;
    const next = { ...legacy, ...notesRef.current };
    notesRef.current = next;
    setNotes(next);
    persist(next);
    return true;
  }, [persist]);

  const hasLegacyLocalData = useCallback(() => readLegacyLocalNotes() !== null, []);

  return {
    loaded: notes !== null,
    notesForDay,
    addNote,
    deleteNote,
    importLegacyLocalData,
    hasLegacyLocalData,
  };
}
