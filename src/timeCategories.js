// Categories for the Time tab's hour-by-hour tracker. Colors are drawn from
// a validated categorical palette (fixed hue order, checked for colorblind
// separation) — each category keeps its slot everywhere it appears (day
// strip, week rows, month grid, legend, line chart), never reassigned.
// Icons are a second identity channel alongside color, since any two
// categories can end up sitting right next to each other in someone's real
// schedule (unlike a chart with a fixed series order).
export const TIME_CATEGORIES = [
  { id: 'work', label: 'Work', color: '#2a78d6', icon: '💼' },
  { id: 'sleep', label: 'Sleep', color: '#4a3aa7', icon: '😴' },
  { id: 'gym', label: 'Gym', color: '#1baf7a', icon: '🏋️' },
  { id: 'friends', label: 'Friends', color: '#e87ba4', icon: '👥' },
  { id: 'goingout', label: 'Going Out', color: '#eb6834', icon: '🎉' },
  { id: 'study', label: 'Study', color: '#eda100', icon: '📚' },
  { id: 'food', label: 'Food', color: '#008300', icon: '🍽️' },
  { id: 'travel', label: 'Travel', color: '#e34948', icon: '✈️' },
];

// Catch-all — deliberately outside the validated categorical set (a 9th
// slot can't be generated safely) and kept visually neutral/desaturated so
// it never competes with a "real" category.
export const OTHER_CATEGORY = { id: 'other', label: 'Other', color: '#8A8F99', icon: '•' };

export const ALL_CATEGORIES = [...TIME_CATEGORIES, OTHER_CATEGORY];

const BY_ID = new Map(ALL_CATEGORIES.map((c) => [c.id, c]));

export function categoryById(id) {
  return (id && BY_ID.get(id)) || null;
}
