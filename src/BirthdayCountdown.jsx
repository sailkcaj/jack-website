import React, { useEffect, useState } from 'react';
import { formatLongDate } from './dateUtils';

// Live countdown to Jack's 30th birthday. Born 6 December 2004, so 30 hits
// at midnight (visitor's local time — the same no-timezone-conversion
// convention every other date on this site already uses) on 6 December 2034.
const THIRTIETH_BIRTHDAY = new Date(2034, 11, 6); // month is 0-indexed: 11 = December

// Full calendar months still to go, counted the way an age calculator would:
// step year/month, then back off one if the birthday's day-of-month (and
// time of day) hasn't been reached yet within the current partial month.
function monthsUntil(now, target) {
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  const targetPos = target.getDate() * 86400 + target.getHours() * 3600 + target.getMinutes() * 60 + target.getSeconds();
  const nowPos = now.getDate() * 86400 + now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (targetPos < nowPos) months -= 1;
  return Math.max(0, months);
}

function getCountdown() {
  const now = new Date();
  const diffMs = THIRTIETH_BIRTHDAY.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { reached: true, months: 0, weeks: 0, days: 0, hours: 0 };
  }
  return {
    reached: false,
    months: monthsUntil(now, THIRTIETH_BIRTHDAY),
    weeks: Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)),
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
  };
}

const TILE_STYLE = {
  background: 'var(--surface-2)',
  border: '0.5px solid var(--border)',
  borderRadius: '12px',
  padding: '1.25rem',
  textAlign: 'center',
};

// ---------------------------------------------------------------------------
// Sits at the very top of the Time tab, above everything else. Ticks every
// second off the visitor's own clock — no server round trip involved, so
// it's correct the instant the page loads and stays live for as long as
// it's open, with no refresh needed.
// ---------------------------------------------------------------------------
export default function BirthdayCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const tiles = [
    { label: 'Months left', value: countdown.months, icon: '📆' },
    { label: 'Weeks left', value: countdown.weeks, icon: '🗓️' },
    { label: 'Days left', value: countdown.days, icon: '📅' },
    { label: 'Hours left', value: countdown.hours, icon: '⏳' },
  ];

  return (
    <section style={{
      background: 'var(--bg-accent)',
      border: '0.5px solid var(--border-accent)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
        Countdown to 30
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
        {countdown.reached ? '🎉 Happy 30th!' : `Until ${formatLongDate(THIRTIETH_BIRTHDAY)}`}
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
    </section>
  );
}
