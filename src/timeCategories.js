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
  // Added 2026-09-06. The first 8 above are a validated categorical set (see
  // the dataviz skill) — every pairwise combination checked for colorblind
  // separation, since any two of these can end up sitting right next to
  // each other in someone's real schedule. Adding a 9th/10th hue to an
  // already-full categorical wheel is the hard case the skill warns about
  // (no ordering of 8 fully-saturated hues clears every check pairwise, let
  // alone 10) — these two were placed by grid-searching the widest open
  // gaps in hue space against all 8 existing colors (never touched) rather
  // than picked by eye, and both clear every hard gate: normal-vision
  // ΔE >= 15 and CVD ΔE >= 8 against each of the 8 above and each other.
  // `family`'s contrast vs the card surface is fine (5.16:1); `tvwork`
  // (a light sky blue) sits at 2.09:1, same low-contrast bucket as the
  // existing gym/friends/study colors — already mitigated everywhere by
  // the hairline RING plus the icon/label shown alongside it.
  { id: 'family', label: 'Family', color: '#a8478f', icon: '👪' },
  { id: 'tvwork', label: 'TV Work', color: '#38bdf8', icon: '🎬' },
  // Added 2026-09-09, going from 10 hues to 12 — well past the "close to
  // the practical ceiling" point the dataviz skill flags at 8. A full OKLCH
  // grid search (script-driven, not eyeballed) found only a handful of
  // in-gamut spots left anywhere on the wheel that clear the hard
  // normal-vision floor (ΔE >= 15) against all 10 existing colors — the
  // wheel is genuinely that packed at 12 slots. `investment` (a saturated
  // pure blue) clears every gate comfortably: worst normal ΔE 16.7 (vs
  // sleep), worst CVD ΔE 12.6 (vs work) — both above the 8 target, not just
  // the floor. `internship` (a vivid magenta) also clears the normal-vision
  // floor comfortably (worst ΔE 21.4, vs friends — the nearest pink-family
  // hue), but its CVD separation from `work` lands at 6.6, inside the
  // skill's documented 6–8 "floor" band (WARN, not FAIL — legal only with
  // mandatory secondary encoding). That's a deliberate, accepted trade-off,
  // not an oversight: it leans on the same mitigation (icon + label shown
  // alongside every swatch) already relied on for the pre-existing
  // `goingout`/`food` pair below, which sits far worse (CVD ΔE 3.2) and has
  // shipped since 2026-09-03 without being a problem in practice. Neither
  // new color makes any existing pairwise failure worse — the worst-case
  // pairs in the full 12-color report are still the same two pre-existing
  // ones noted above (`goingout`↔`travel` normal ΔE 7.1, `goingout`↔`food`
  // CVD ΔE 3.2), unchanged.
  { id: 'investment', label: 'Investment Work', color: '#0000ff', icon: '📈' },
  { id: 'internship', label: 'Internship Work', color: '#f400ff', icon: '🎓' },
  // Added 2026-09-09 (same day, second request) — 13 hues now. At this
  // density the OKLCH grid search found ZERO spots left that clear the full
  // CVD target (8) against all 12 existing colors; every option requires
  // dropping into the documented 6–8 floor band somewhere (WARN, not FAIL —
  // legal with the icon+label mitigation this app already applies
  // everywhere). `business` (a warm brown/umber, a hue family nothing else
  // here uses) was the best available: worst normal ΔE 20.2 (vs family —
  // very comfortable, well clear of the hard 15 floor), worst CVD ΔE 7.4
  // (vs food — inside the floor band, similar to `internship`'s situation
  // above). Contrast vs the card surface is 7.68 — no relief needed.
  // Confirmed the full 13-color report's worst-case pairs are still
  // unchanged from the 12-color one (still the same pre-existing
  // `goingout`↔`travel`/`goingout`↔`food` pair) — this addition doesn't
  // worsen anything already there.
  { id: 'business', label: 'Business Work', color: '#7c4600', icon: '🏢' },
  // Added 2026-10-05 — 14 hues now. Hue space is full: `internship` and
  // `business` each had to settle for a CVD ΔE in the 6–8 floor band. A scan
  // of the whole 8-bit sRGB cube shows the open space is on the lightness
  // axis instead — nothing in the palette is darker than OKLab L ≈ 0.43
  // (`sleep`), so a near-black is far from everything. `music` (#18181b, a
  // cool near-black, L ≈ 0.21): worst normal ΔE 26.2 and worst protan/deutan
  // CVD ΔE 22.3 (both vs `business`, its nearest neighbour) — clears the
  // 15 / 8 gates by a wider margin than any earlier addition. Lightness
  // differences survive colour-vision simulation, so there's no hue collision
  // to lean on the icon for. Also 43.9 from `other` (so it can't pass for the
  // neutral catch-all), 73.8 from an empty slot, and 17.7:1 against the card
  // surface. Same maths as the entries above (OKLab ΔE ×100, Machado
  // protan+deutan), re-derived and checked against their documented figures.
  // The two pre-existing worst pairs (`goingout`↔`travel`, `goingout`↔`food`)
  // are unchanged. A future dark colour would now need to clear `music` too.
  { id: 'music', label: 'Music', color: '#18181b', icon: '🎹' },
  // Added 2026-10-08 — 15 hues. A full sRGB-cube scan against the 14 shipped
  // colours (incl. `music`) leaves nothing light or mid-tone that clears the
  // 15 / 8 gates while still reading against the card (>= 3:1) and staying
  // clear of `other` and the empty-slot grey — every survivor is dark (OKLab
  // L < 0.45). `bizevents` takes a dark hue gap nothing else uses: a deep teal
  // (#014a51, L ≈ 0.37, hue ≈ 206°) between the greens (`gym`, `food`) and
  // `tvwork`'s sky blue. Worst normal ΔE 17.5 (vs `music`; `business` and
  // `sleep` are 17.5 / 17.6), worst protan/deutan CVD ΔE 10.6 (vs `business`)
  // — both clear the gates with room to spare. 28.1 from `other`, 57.8 from an
  // empty slot, 10.0:1 against the card surface. Same maths as the entries
  // above (OKLab ΔE ×100, Machado protan+deutan). The two pre-existing worst
  // pairs (`goingout`↔`travel`, `goingout`↔`food`) are unchanged.
  { id: 'bizevents', label: 'Business Events', color: '#014a51', icon: '🤝' },
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
