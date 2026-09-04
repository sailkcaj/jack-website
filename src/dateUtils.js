// Small dependency-free date helpers shared by the Time tab. Weeks are
// Monday-start throughout.

const pad2 = (n) => String(n).padStart(2, '0');

export function dateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function isSameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

// Monday of the week containing `date`.
export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function weekDays(date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

// Full Monday-start calendar grid for the month containing `date`,
// including the leading/trailing days from neighboring months needed to
// fill complete weeks. Each entry: { date, inMonth }.
export function monthGridDays(date) {
  const first = startOfMonth(date);
  const gridStart = startOfWeek(first);
  const totalDays = daysInMonth(date);
  const last = new Date(date.getFullYear(), date.getMonth(), totalDays);
  const gridEnd = (() => {
    const w = startOfWeek(last);
    return addDays(w, 6);
  })();
  const days = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push({ date: cursor, inMonth: cursor.getMonth() === date.getMonth() });
    cursor = addDays(cursor, 1);
  }
  return days;
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatLongDate(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatShortDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function hourLabel(hour) {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}
