import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'sailkcaj-time-notes-v1';

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadNotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const clean = {};
    for (const key of Object.keys(parsed)) {
      const day = parsed[key];
      clean[key] = Array.isArray(day)
        ? day.filter((n) => n && typeof n.start === 'number' && typeof n.end === 'number' && typeof n.text === 'string')
        : [];
    }
    return clean;
  } catch {
    // Private browsing / storage disabled / corrupt JSON — start fresh in
    // memory rather than crash the tab. Nothing on disk is touched here —
    // see the isFirstLoad guard below — so a bad parse can never overwrite
    // whatever's actually still sitting in localStorage.
    return {};
  }
}

// Free-text notes tied to a time range within a day (e.g. "3:30p-5:30p:
// fixed the login bug"), keyed by date. Persisted to this browser's
// localStorage under its own key, entirely separate from the hour-log data
// in useTimeLog — this feature can't touch or migrate that data at all.
// Same no-backend caveat as the rest of the Time tab: notes live only on
// whichever device/browser they were added in.
export default function useTimeNotes() {
  const [notes, setNotes] = useState(loadNotes);
  const saveTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Same safeguard as useTimeLog: never resave the just-loaded state on
    // mount, only once something actually changes in this mount (an add or
    // a delete) — so a loading problem here can never auto-overwrite real
    // stored notes with an empty result.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return undefined;
    }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch {
        // Storage full or unavailable — the in-memory state still reflects
        // the user's edits for the rest of this session.
      }
    }, 150);
    return () => clearTimeout(saveTimer.current);
  }, [notes]);

  const notesForDay = useCallback((key) => notes[key] || [], [notes]);

  // start/end are half-hour slot indices (0-47 / 1-48), covering [start, end).
  const addNote = useCallback((key, { start, end, text }) => {
    setNotes((prev) => {
      const day = prev[key] ? [...prev[key]] : [];
      day.push({ id: makeId(), start, end, text });
      day.sort((a, b) => a.start - b.start);
      return { ...prev, [key]: day };
    });
  }, []);

  const deleteNote = useCallback((key, id) => {
    setNotes((prev) => {
      const day = prev[key];
      if (!day) return prev;
      const next = day.filter((n) => n.id !== id);
      const updated = { ...prev };
      if (next.length) updated[key] = next;
      else delete updated[key];
      return updated;
    });
  }, []);

  return { notesForDay, addNote, deleteNote };
}
