// Add a country by adding a line here: { country, city, lat, lng, note }
// - country / city: names, shown in the UI
// - lat / lng: decimal coordinates for the marker
// - note: optional, shown under the name when selected

// Photos: name a file after the country, all lowercase, spaces as
// hyphens, and drop it in public/images/countries/ — no code change
// needed. 'United Kingdom' -> public/images/countries/united-kingdom.jpg
// .jpg or .png both work. No photo yet? Leave it out, it'll show a
// placeholder until you add one.

export const countriesVisited = [
  { country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278, note: 'Home base' },
  { country: 'United States', city: 'San Francisco', lat: 37.7749, lng: -122.4194, note: 'Moving here' },
  { country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
  { country: 'Germany', city: 'Munich', lat: 48.1351, lng: 11.5820 },
  { country: 'Poland', city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { country: 'Sweden', city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { country: 'Switzerland', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
  { country: 'Hong Kong', city: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  // 39 more to go — send me the list (country + city) and I'll fill in
  // the lat/lng for all of them and add the lines here.
];
