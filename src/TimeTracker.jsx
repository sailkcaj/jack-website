import React, { useEffect, useMemo, useRef, useState } from 'react';
import useTimeLog from './useTimeLog';
import { TIME_CATEGORIES, OTHER_CATEGORY, ALL_CATEGORIES, categoryById } from './timeCategories';
import {
  dateKey, addDays, startOfWeek, weekDays, startOfMonth, daysInMonth,
  monthGridDays, WEEKDAY_LABELS, MONTH_LABELS, formatLongDate, formatShortDate,
  slotLabel,
} from './dateUtils';

// Hairline ring around color fills — several of the categorical colors
// (aqua/yellow/magenta) sit close in luminance to a white card, so a 1px
// dark-at-10%-opacity ring keeps every segment readable as its own shape
// rather than blurring into the surface or its neighbor.
const RING = '1px solid rgba(11,11,11,0.10)';
const GAP = 2; // px — surface gap between touching half-hour segments

function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtHours(h) {
  return `${Math.round(h * 10) / 10}h`;
}

// ---------------------------------------------------------------------------
// Legend / brush palette — doubles as the picker: click a category to make
// it the active "brush", then click or drag across the day strip to paint.
// ---------------------------------------------------------------------------
function BrushPalette({ activeBrush, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {ALL_CATEGORIES.map((cat) => {
        const active = activeBrush === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onPick(cat.id)}
            title={cat.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.7rem',
              borderRadius: 'var(--radius)',
              border: active ? `1.5px solid ${cat.color}` : '0.5px solid var(--border)',
              background: active ? `${cat.color}1A` : 'var(--surface-2)',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{
              width: '16px',
              height: '16px',
              borderRadius: '5px',
              background: cat.color,
              border: RING,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              flexShrink: 0,
            }}>
              {cat.icon}
            </span>
            {cat.label}
          </button>
        );
      })}
      <button
        onClick={() => onPick(null)}
        title="Eraser — clear hours"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.7rem',
          borderRadius: 'var(--radius)',
          border: activeBrush === null ? '1.5px solid var(--text-secondary)' : '0.5px solid var(--border)',
          background: activeBrush === null ? 'var(--surface-1)' : 'var(--surface-2)',
          cursor: 'pointer',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{
          width: '16px', height: '16px', borderRadius: '5px',
          border: '1px dashed var(--border-strong)', flexShrink: 0,
        }} />
        Eraser
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// One day as 48 equal half-hour segments. Interactive strips accept
// click/drag painting with the active brush; read-only strips (week/month)
// are just hover-labeled.
// ---------------------------------------------------------------------------
function HourStrip({ hours, height, interactive, onPaint, showLabels, brush }) {
  const paintingRef = useRef(false);
  const paintValueRef = useRef(null);

  useEffect(() => {
    if (!interactive) return undefined;
    const stop = () => { paintingRef.current = false; };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, [interactive]);

  const beginPaint = (slot, currentValue) => {
    const value = currentValue === brush ? null : brush;
    paintValueRef.current = value;
    paintingRef.current = true;
    onPaint(slot, value);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: `${GAP}px`, height: `${height}px`, borderRadius: '8px', overflow: 'hidden' }}>
        {hours.map((catId, slot) => {
          const cat = categoryById(catId);
          return (
            <div
              key={slot}
              title={`${slotLabel(slot)}–${slotLabel((slot + 1) % 48)}: ${cat ? cat.label : 'Not logged'}`}
              onPointerDown={interactive ? (e) => { e.preventDefault(); beginPaint(slot, catId); } : undefined}
              onPointerEnter={interactive ? () => { if (paintingRef.current) onPaint(slot, paintValueRef.current); } : undefined}
              style={{
                flex: 1,
                minWidth: 0,
                background: cat ? cat.color : 'var(--surface-1)',
                border: cat ? RING : '1px dashed var(--border)',
                boxSizing: 'border-box',
                cursor: interactive ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: height > 40 ? '13px' : '9px',
                userSelect: 'none',
                touchAction: 'none',
              }}
            >
              {cat && height > 30 ? cat.icon : ''}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div style={{ display: 'flex', marginTop: '0.35rem' }}>
          {hours.map((_, slot) => (
            <div key={slot} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
              {slot % 6 === 0 ? slotLabel(slot) : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Horizontal bars comparing category totals — used for both the weekly and
// monthly breakdowns. Each bar keeps that category's fixed color.
// ---------------------------------------------------------------------------
function SummaryBars({ totals, emptyText }) {
  const rows = ALL_CATEGORIES
    .map((cat) => ({ cat, hours: totals[cat.id] || 0 }))
    .filter((r) => r.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  if (rows.length === 0) {
    return <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{emptyText}</p>;
  }

  const max = rows[0].hours;

  return (
    <div style={{ display: 'grid', gap: '0.6rem' }}>
      {rows.map(({ cat, hours }) => (
        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '110px', flexShrink: 0, fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span aria-hidden="true">{cat.icon}</span>
            {cat.label}
          </div>
          <div style={{ flex: 1, background: 'var(--surface-1)', borderRadius: '4px', height: '14px', position: 'relative' }}>
            <div style={{
              width: `${Math.max(4, (hours / max) * 100)}%`,
              height: '100%',
              background: cat.color,
              borderRadius: '4px',
              border: RING,
              boxSizing: 'border-box',
            }} />
          </div>
          <div style={{ width: '40px', flexShrink: 0, textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {fmtHours(hours)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Multi-line trend chart — hours per category, per day, across the month
// currently in view. Legend doubles as a show/hide toggle; hover shows a
// crosshair + tooltip for the nearest day.
// ---------------------------------------------------------------------------
function TrendLineChart({ monthDate, getDay }) {
  const svgRef = useRef(null);
  const [hidden, setHidden] = useState(() => new Set());
  const [hoverIdx, setHoverIdx] = useState(null);

  const numDays = daysInMonth(monthDate);
  const W = 900, H = 300;
  const padL = 34, padR = 16, padT = 16, padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const series = useMemo(() => {
    const byCat = {};
    for (const cat of ALL_CATEGORIES) byCat[cat.id] = [];
    for (let d = 1; d <= numDays; d++) {
      const day = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      const hours = getDay(dateKey(day));
      const counts = {};
      for (const catId of hours) {
        if (!catId) continue;
        counts[catId] = (counts[catId] || 0) + 0.5;
      }
      for (const cat of ALL_CATEGORIES) byCat[cat.id].push(counts[cat.id] || 0);
    }
    return byCat;
  }, [monthDate, getDay, numDays]);

  const activeCats = ALL_CATEGORIES.filter((c) => series[c.id].some((v) => v > 0));
  const maxVal = Math.max(4, ...activeCats.map((c) => Math.max(...series[c.id])));
  const niceMax = Math.ceil(maxVal / 4) * 4;

  const xFor = (dayIdx) => padL + (numDays === 1 ? 0 : (dayIdx / (numDays - 1)) * plotW);
  const yFor = (hours) => padT + plotH - (hours / niceMax) * plotH;

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(numDays - 1, Math.max(0, Math.round(frac * (numDays - 1))));
    setHoverIdx(idx);
  };

  const yTicks = [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax];
  const xTickDays = [1, ...[5, 10, 15, 20, 25].filter((d) => d < numDays), numDays];

  if (activeCats.length === 0) {
    return <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No hours logged yet this month — log a few days above and a trend line will show up here.</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {activeCats.map((cat) => {
          const isHidden = hidden.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => setHidden((prev) => {
                const next = new Set(prev);
                if (next.has(cat.id)) next.delete(cat.id); else next.add(cat.id);
                return next;
              })}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.3rem 0.6rem', borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)',
                background: isHidden ? 'var(--surface-1)' : 'var(--surface-2)',
                opacity: isHidden ? 0.45 : 1,
                cursor: 'pointer', fontSize: '12px', color: 'var(--text-primary)',
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={yFor(t)} y2={yFor(t)} stroke="var(--border)" strokeWidth="1" />
              <text x={padL - 8} y={yFor(t) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">{t}</text>
            </g>
          ))}

          {xTickDays.map((d) => (
            <text key={d} x={xFor(d - 1)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-muted)">{d}</text>
          ))}

          {activeCats.map((cat) => {
            if (hidden.has(cat.id)) return null;
            const points = series[cat.id].map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');
            const lastIdx = series[cat.id].length - 1;
            return (
              <g key={cat.id}>
                <polyline points={points} fill="none" stroke={cat.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={xFor(lastIdx)} cy={yFor(series[cat.id][lastIdx])} r="4" fill={cat.color} stroke="var(--surface-2)" strokeWidth="2" />
              </g>
            );
          })}

          {hoverIdx !== null && (
            <line x1={xFor(hoverIdx)} x2={xFor(hoverIdx)} y1={padT} y2={H - padB} stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3,3" />
          )}
          {hoverIdx !== null && activeCats.filter((c) => !hidden.has(c.id)).map((cat) => (
            <circle key={cat.id} cx={xFor(hoverIdx)} cy={yFor(series[cat.id][hoverIdx])} r="4.5" fill={cat.color} stroke="var(--surface-2)" strokeWidth="2" />
          ))}
        </svg>

        {hoverIdx !== null && (
          <div style={{
            position: 'absolute',
            left: `${(xFor(hoverIdx) / W) * 100}%`,
            top: 0,
            transform: hoverIdx > numDays / 2 ? 'translateX(-105%)' : 'translateX(10px)',
            background: 'var(--surface-2)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 0.75rem',
            fontSize: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            pointerEvents: 'none',
            minWidth: '120px',
          }}>
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
              {MONTH_LABELS[monthDate.getMonth()]} {hoverIdx + 1}
            </div>
            {activeCats.filter((c) => !hidden.has(c.id) && series[c.id][hoverIdx] > 0).map((cat) => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>{cat.icon} {cat.label}</span>
                <span>{fmtHours(series[cat.id][hoverIdx])}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small card wrapper reused across the tab.
// ---------------------------------------------------------------------------
function Card({ title, subtitle, children, right }) {
  return (
    <section style={{
      background: 'var(--surface-2)',
      border: '0.5px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function NavButton({ onClick, children, label }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: '28px', height: '28px', borderRadius: '50%',
      border: '0.5px solid var(--border)', background: 'var(--surface-2)',
      cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
export default function TimeTracker() {
  const { getDay, setHour, totalsForDays } = useTimeLog();
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [activeBrush, setActiveBrush] = useState('work');

  const today = todayDate();
  const dayKey = dateKey(selectedDate);
  const dayHours = getDay(dayKey);
  const todayHours = getDay(dateKey(today));
  const loggedToday = todayHours.filter(Boolean).length * 0.5;

  const week = weekDays(selectedDate);
  const weekKeys = week.map(dateKey);
  const weekTotals = totalsForDays(weekKeys);
  const loggedWeek = Object.values(weekTotals).reduce((a, b) => a + b, 0);

  const monthDays = Array.from({ length: daysInMonth(selectedDate) }, (_, i) => dateKey(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1)));
  const monthTotals = totalsForDays(monthDays);
  const loggedMonth = Object.values(monthTotals).reduce((a, b) => a + b, 0);
  const topMonthCat = ALL_CATEGORIES
    .map((c) => ({ c, h: monthTotals[c.id] || 0 }))
    .sort((a, b) => b.h - a.h)[0];

  const grid = monthGridDays(selectedDate);

  const statTiles = [
    { label: 'Logged today', value: fmtHours(loggedToday), subtitle: `of 24h`, icon: '⏱️' },
    { label: 'This week', value: fmtHours(loggedWeek), subtitle: `of 168h`, icon: '📅' },
    { label: 'This month', value: fmtHours(loggedMonth), subtitle: MONTH_LABELS[selectedDate.getMonth()], icon: '🗓️' },
    { label: 'Top this month', value: topMonthCat && topMonthCat.h > 0 ? topMonthCat.c.label : '—', subtitle: topMonthCat && topMonthCat.h > 0 ? fmtHours(topMonthCat.h) : 'No data yet', icon: topMonthCat && topMonthCat.h > 0 ? topMonthCat.c.icon : '✨' },
  ];

  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '0.5rem' }}>Time</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>
        Pick a category below, then click or drag across the hours to log your day.
      </p>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statTiles.map((s, i) => (
          <div key={i} style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '0.35rem' }} aria-hidden="true">{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 500 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Day view */}
      <Card
        title={formatLongDate(selectedDate)}
        subtitle={`${fmtHours(dayHours.filter(Boolean).length * 0.5)} logged`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <NavButton label="Previous day" onClick={() => setSelectedDate((d) => addDays(d, -1))}>‹</NavButton>
            <button
              onClick={() => setSelectedDate(todayDate())}
              style={{
                fontSize: '12px', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', color: 'var(--text-primary)',
              }}
            >
              Today
            </button>
            <NavButton label="Next day" onClick={() => setSelectedDate((d) => addDays(d, 1))}>›</NavButton>
          </div>
        }
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <BrushPalette activeBrush={activeBrush} onPick={setActiveBrush} />
        </div>
        <HourStrip
          hours={dayHours}
          height={56}
          interactive
          showLabels
          brush={activeBrush}
          onPaint={(hour, value) => setHour(dayKey, hour, value)}
        />
      </Card>

      {/* Weekly breakdown */}
      <Card
        title="This week"
        subtitle={`${formatShortDate(week[0])} – ${formatShortDate(week[6])} · ${fmtHours(loggedWeek)} logged`}
        right={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NavButton label="Previous week" onClick={() => setSelectedDate((d) => addDays(d, -7))}>‹</NavButton>
            <NavButton label="Next week" onClick={() => setSelectedDate((d) => addDays(d, 7))}>›</NavButton>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {week.map((d, i) => {
            const key = dateKey(d);
            const isSelected = key === dayKey;
            const hours = getDay(key);
            return (
              <div
                key={key}
                onClick={() => setSelectedDate(d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                  padding: '0.35rem', borderRadius: '8px',
                  background: isSelected ? 'var(--bg-accent)' : 'transparent',
                }}
              >
                <div style={{ width: '64px', flexShrink: 0, fontSize: '12px', color: isSelected ? 'var(--text-accent)' : 'var(--text-secondary)', fontWeight: isSelected ? 500 : 400 }}>
                  {WEEKDAY_LABELS[i]}<br />
                  <span style={{ color: 'var(--text-muted)' }}>{formatShortDate(d)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <HourStrip hours={hours} height={22} interactive={false} showLabels={false} onPaint={() => {}} />
                </div>
                <div style={{ width: '36px', flexShrink: 0, textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {fmtHours(hours.filter(Boolean).length * 0.5)}
                </div>
              </div>
            );
          })}
        </div>
        <SummaryBars totals={weekTotals} emptyText="No time logged yet this week." />
      </Card>

      {/* Monthly breakdown */}
      <Card
        title={`${MONTH_LABELS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
        subtitle={`${fmtHours(loggedMonth)} logged`}
        right={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NavButton label="Previous month" onClick={() => setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, Math.min(d.getDate(), 28)))}>‹</NavButton>
            <NavButton label="Next month" onClick={() => setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, Math.min(d.getDate(), 28)))}>›</NavButton>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: '0.25rem' }}>{w}</div>
          ))}
          {grid.map(({ date: d, inMonth }) => {
            const key = dateKey(d);
            const hours = getDay(key);
            const logged = hours.filter(Boolean).length;
            const isToday = key === dateKey(today);
            const isSelected = key === dayKey;
            return (
              <div
                key={key}
                onClick={() => setSelectedDate(d)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  minHeight: '56px',
                  background: isSelected ? 'var(--bg-accent)' : 'var(--surface-1)',
                  border: isToday ? '1.5px solid var(--border-accent)' : '0.5px solid transparent',
                  opacity: inMonth ? 1 : 0.4,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ fontSize: '12px', color: isSelected ? 'var(--text-accent)' : 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  {d.getDate()}
                </div>
                {logged > 0 && (
                  <div style={{ display: 'flex', gap: '1px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    {hours.map((catId, h) => catId && (
                      <div key={h} style={{ flex: 1, background: categoryById(catId).color }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <SummaryBars totals={monthTotals} emptyText="No time logged yet this month." />
      </Card>

      {/* Trend line chart */}
      <Card
        title="Trend"
        subtitle={`Hours per category, per day — ${MONTH_LABELS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
      >
        <TrendLineChart monthDate={selectedDate} getDay={getDay} />
      </Card>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
        Saved in this browser only — there's no backend behind sailkcaj.com yet, so entries don't sync across devices and clearing browser data will clear them too.
      </p>
    </section>
  );
}
