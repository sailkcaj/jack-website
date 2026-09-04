import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'sailkcaj-time-log-v1';
const EMPTY_DAY = () => Array(24).fill(null);

function loadLog() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // Private browsing / storage disabled / corrupt JSON — start fresh
    // rather than crash the tab.
    return {};
  }
}

// Hour-by-hour time log, persisted to this browser's localStorage. There's
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

  // Total hours per category across a set of date keys.
  const totalsForDays = useCallback((keys) => {
    const totals = {};
    for (const key of keys) {
      const day = log[key];
      if (!day) continue;
      for (const catId of day) {
        if (!catId) continue;
        totals[catId] = (totals[catId] || 0) + 1;
      }
    }
    return totals;
  }, [log]);

  return { log, getDay, setHour, clearDay, totalsForDays };
}
