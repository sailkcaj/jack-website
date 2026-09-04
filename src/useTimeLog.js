import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'sailkcaj-time-log-v1';
const EMPTY_DAY = () => Array(48).fill(null);

// Older entries were logged as 24 one-hour slots. Expand each into its two
// half-hour children (same category for both) so nothing already logged is
// lost when the day array grows from 24 to 48 slots.
function expandDayTo48(day) {
  if (!Array.isArray(day)) return EMPTY_DAY();
  if (day.length === 48) return day;
  if (day.length === 24) {
    const expanded = EMPTY_DAY();
    for (let h = 0; h < 24; h++) {
      expanded[h * 2] = day[h];
      expanded[h * 2 + 1] = day[h];
    }
    return expanded;
  }
  return EMPTY_DAY();
}

function loadLog() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const migrated = {};
    for (const key of Object.keys(parsed)) {
      migrated[key] = expandDayTo48(parsed[key]);
    }
    return migrated;
  } catch {
    // Private browsing / storage disabled / corrupt JSON — start fresh
    // rather than crash the tab.
    return {};
  }
}

// Half-hour time log, persisted to this browser's localStorage. There's
// no backend behind sailkcaj.com, so entries live only on whichever
// device/browser they were logged in — see the note in the Time tab itself.
export default function useTimeLog() {
  const [log, setLog] = useState(loadLog);
  const saveTimer = useRef(null);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
      } catch {
        // Storage full or unavailable — nothing useful to do here; the in-memory
        // state still reflects the user's edits for the rest of this session.
      }
    }, 150);
    return () => clearTimeout(saveTimer.current);
  }, [log]);

  const getDay = useCallback((key) => log[key] || EMPTY_DAY(), [log]);

  const setHour = useCallback((key, hour, catId) => {
    setLog((prev) => {
      const day = prev[key] ? [...prev[key]] : EMPTY_DAY();
      day[hour] = catId;
      return { ...prev, [key]: day };
    });
  }, []);

  const clearDay = useCallback((key) => {
    setLog((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Total hours per category across a set of date keys (each slot is 30
  // minutes, so every logged slot contributes half an hour).
  const totalsForDays = useCallback((keys) => {
    const totals = {};
    for (const key of keys) {
      const day = log[key];
      if (!day) continue;
      for (const catId of day) {
        if (!catId) continue;
        totals[catId] = (totals[catId] || 0) + 0.5;
      }
    }
    return totals;
  }, [log]);

  return { log, getDay, setHour, clearDay, totalsForDays };
}
