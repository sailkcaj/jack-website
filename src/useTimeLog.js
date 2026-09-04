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
    if (!parsed || typeof parsed !== 'object') return {};
    const migrated = {};
    for (const key of Object.keys(parsed)) {
      // Migrate each day on its own — one malformed/unexpected entry
      // shouldn't blank out every other day that parsed fine.
      try {
        migrated[key] = expandDayTo48(parsed[key]);
      } catch {
        migrated[key] = EMPTY_DAY();
      }
    }
    return migrated;
  } catch {
    // Private browsing / storage disabled / corrupt JSON — start fresh in
    // memory rather than crash the tab. Nothing on disk is touched here —
    // see the isFirstLoad guard below — so a bad parse can never overwrite
    // whatever's actually still sitting in localStorage.
    return {};
  }
}

// Half-hour time log, persisted to this browser's localStorage. There's
// no backend behind sailkcaj.com, so entries live only on whichever
// device/browser they were logged in — see the note in the Time tab itself.
export default function useTimeLog() {
  const [log, setLog] = useState(loadLog);
  const saveTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip the save that would otherwise fire immediately after this hook
    // loads (and migrates) whatever was already in localStorage. Persisting
    // only starts once something actually changes in this mount — a paint,
    // an erase, a clear — so a bug in loading/migrating can never silently
    // overwrite real stored data with an empty or partial result again.
    // Worst case if loading ever goes wrong: storage just doesn't get
    // upgraded until the next real edit, instead of being wiped.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return undefined;
    }
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
