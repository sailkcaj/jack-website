import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const DOC_PATH = ['timeData', 'log'];
const LEGACY_STORAGE_KEY = 'sailkcaj-time-log-v1';
const EMPTY_DAY = () => Array(48).fill(null);

// Older entries were logged as 24 one-hour slots. Expand each into its two
// half-hour children (same category for both) so nothing already logged is
// lost when read back under the current 48-slot shape.
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

function migrateDays(rawDays) {
  if (!rawDays || typeof rawDays !== 'object') return {};
  const migrated = {};
  for (const key of Object.keys(rawDays)) {
    // Migrate each day on its own — one malformed/unexpected entry
    // shouldn't blank out every other day that parsed fine.
    try {
      migrated[key] = expandDayTo48(rawDays[key]);
    } catch {
      migrated[key] = EMPTY_DAY();
    }
  }
  return migrated;
}

// Reads whatever this specific browser saved back when the Time tab was
// localStorage-only (pre-2026-09-05). Only ever consulted by an explicit
// "import" action — never automatically.
function readLegacyLocalDays() {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) return null;
    return migrateDays(parsed);
  } catch {
    return null;
  }
}

// Half-hour time log, shared across every browser/device via Firestore —
// anyone visiting sailkcaj.com sees the same data live; only a signed-in
// editor (see useEditAuth) can change it.
//
// Every write below is triggered directly by an explicit user action (paint
// an hour, clear a day, import legacy data) using a ref as the source of
// truth for "the log as of right now" — never by a generic "state changed,
// so save" effect keyed off the `log` state itself. That effect-based shape
// is what caused a real data-loss incident on 2026-09-04 (a load/migrate
// step that produced an empty result got auto-persisted over real data a
// moment later). Tying persistence to actions instead of state changes,
// plus refusing to persist anything before the first real snapshot has
// loaded (see `hasLoadedOnce` below), closes that whole class of bug.
export default function useTimeLog() {
  const [log, setLog] = useState(null); // null = not loaded from Firestore yet
  const [syncError, setSyncError] = useState(null);
  const logRef = useRef({});
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    const ref = doc(db, ...DOC_PATH);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const migrated = migrateDays(snap.exists() ? snap.data().days : {});
        logRef.current = migrated;
        hasLoadedOnce.current = true;
        setLog(migrated);
        setSyncError(null);
      },
      (err) => {
        console.error('Time log sync error:', err);
        setSyncError(err);
      }
    );
    return unsubscribe;
  }, []);

  const persist = useCallback((next) => {
    if (!auth.currentUser) return; // UI shouldn't allow this anyway, but never write unauthenticated
    if (!hasLoadedOnce.current) {
      console.warn('Refusing to save time log before the initial load completed.');
      return;
    }
    setDoc(doc(db, ...DOC_PATH), { days: next }).catch((err) => {
      console.error('Failed to save time log:', err);
    });
  }, []);

  const getDay = useCallback((key) => (log && log[key]) || EMPTY_DAY(), [log]);

  const setHour = useCallback((key, hour, catId) => {
    const base = logRef.current;
    const day = base[key] ? [...base[key]] : EMPTY_DAY();
    day[hour] = catId;
    const next = { ...base, [key]: day };
    logRef.current = next;
    setLog(next);
    persist(next);
  }, [persist]);

  const clearDay = useCallback((key) => {
    const base = logRef.current;
    const next = { ...base };
    delete next[key];
    logRef.current = next;
    setLog(next);
    persist(next);
  }, [persist]);

  // One-time recovery path for data logged back when the Time tab was
  // localStorage-only. Local days only fill in dates the shared log doesn't
  // already have — they can never overwrite something already logged
  // centrally. Only ever called from an explicit button click while signed
  // in (see TimeTracker.jsx).
  const importLegacyLocalData = useCallback(() => {
    const legacy = readLegacyLocalDays();
    if (!legacy) return false;
    const next = { ...legacy, ...logRef.current };
    logRef.current = next;
    setLog(next);
    persist(next);
    return true;
  }, [persist]);

  const hasLegacyLocalData = useCallback(() => readLegacyLocalDays() !== null, []);

  // Total hours per category across a set of date keys (each slot is 30
  // minutes, so every logged slot contributes half an hour).
  const totalsForDays = useCallback((keys) => {
    const totals = {};
    for (const key of keys) {
      const day = log && log[key];
      if (!day) continue;
      for (const catId of day) {
        if (!catId) continue;
        totals[catId] = (totals[catId] || 0) + 0.5;
      }
    }
    return totals;
  }, [log]);

  return {
    loaded: log !== null,
    syncError,
    getDay,
    setHour,
    clearDay,
    totalsForDays,
    importLegacyLocalData,
    hasLegacyLocalData,
  };
}
