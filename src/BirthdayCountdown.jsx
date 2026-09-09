import React, { useEffect, useState } from 'react';
import { formatLongDate } from './dateUtils';

// Jack's birthday: 6 December (born 2004). Used two ways below — as a fixed
// one-time target (30th birthday) and as a recurring annual target (next
// birthday, whichever year that falls in).
const BIRTHDAY_MONTH = 11; // 0-indexed: 11 = December
const BIRTHDAY_DAY = 6;
const THIRTIETH_BIRTHDAY = new Date(2034, BIRTHDAY_MONTH, BIRTHDAY_DAY);

// Full calendar months still to go, counted the way an age calculator would:
// step year/month, then back off one if the target's day-of-month (and time
// of day) hasn't been reached yet within the current partial month.
function monthsUntil(now, target) {
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  const targetPos = target.getDate() * 86400 + target.getHours() * 3600 + target.getMinutes() * 60 + target.getSeconds();
  const nowPos = now.getDate() * 86400 + now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (targetPos < nowPos) months -= 1;
  return Math.max(0, months);
}

// Fixed target — always the 30th birthday itself, whenever "now" is.
function thirtiethBirthdayTarget() {
  return THIRTIETH_BIRTHDAY;
}

// Recurring target — this year's birthday, unless it has already fully
// passed, in which case next year's. The rollover happens the day AFTER the
// birthday (comparing midnight-to-midnight), so the birthday's own 24 hours
// still read as "today" (the celebration state below) rather than jumping
// straight to "365 days away" at the first second past midnight.
function nextBirthdayTarget(now) {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let candidate = new Date(now.getFullYear(), BIRTHDAY_MONTH, BIRTHDAY_DAY);
  if (candidate.getTime() < todayStart) {
    candidate = new Date(now.getFullYear() + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
  }
  return candidate;
}

function getCountdown(computeTarget) {
  const now = new Date();
  const target = computeTarget(now);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { reached: true, months: 0, weeks: 0, days: 0, hours: 0, target };
  }
  return {
    reached: false,
    months: monthsUntil(now, target),
    weeks: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)),
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    target,
  };
}

const TILE_STYLE = {
  background: 'var(--surface-2)',
  border: '0.5px solid var(--border)',
  borderRadius: '12px',
  padding: '1.25rem',
  textAlign: 'center',
};

// One live countdown card: a title, four unit tiles (each the floor of the
// *whole* remaining duration in that unit — independent conversions of the
// same remaining time, not a nested breakdown that sums to it), and a
// celebratory message once the target is reached. Ticks every second off
// the visitor's own local clock — no server round trip involved, so it's
// correct the instant the page loads and stays live for as long as it's
// open, with no refresh needed.
function CountdownCard({ title, computeTarget, reachedMessage }) {
  const [countdown, setCountdown] = useState(() => getCountdown(computeTarget));

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown(computeTarget)), 1000);
    return () => clearInterval(id);
  }, [computeTarget]);

  const tiles = [
    { label: 'Months left', value: countdown.months, icon: '📆' },
    { label: 'Weeks left', value: countdown.weeks, icon: '🗓️' },
    { label: 'Days left', value: countdown.days, icon: '📅' },
    { label: 'Hours left', value: countdown.hours, icon: '⏳' },
  ];

  return (
    <div style={{
      background: 'var(--bg-accent)',
      border: '0.5px solid var(--border-accent)',
      borderRadius: '12px',
      padding: '1.5rem',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
        {countdown.reached ? reachedMessage : `Until ${formatLongDate(countdown.target)}`}
      </p>
      {!countdown.reached && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {tiles.map((t) => (
            <div key={t.label} style={TILE_STYLE}>
              <div style={{ fontSize: '20px', marginBottom: '0.35rem' }} aria-hidden="true">{t.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {t.value.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sits at the very top of the Time tab, above everything else: two live
// countdowns side by side (stacking on narrow screens) — next birthday
// (resets every year automatically) and 30th birthday (fixed, one-time).
// ---------------------------------------------------------------------------
export default function BirthdayCountdown() {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem',
    }}>
      <CountdownCard
        title="Countdown to next birthday"
        computeTarget={nextBirthdayTarget}
        reachedMessage="🎉 Happy Birthday!"
      />
      <CountdownCard
        title="Countdown to 30"
        computeTarget={thirtiethBirthdayTarget}
        reachedMessage="🎉 Happy 30th!"
      />
    </section>
  );
}
