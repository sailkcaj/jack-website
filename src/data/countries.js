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
  // China
  { country: 'China', city: 'Xiamen', lat: 24.4798, lng: 118.0819 },
  { country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { country: 'China', city: 'Chongqing', lat: 29.7192, lng: 106.6417 },

  // Mongolia
  { country: 'Mongolia', city: 'Ulaanbaatar', lat: 47.6469, lng: 106.8168 },

  // Turkey
  { country: 'Turkey', city: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { country: 'Turkey', city: 'Kusadasi', lat: 37.8579, lng: 27.2610 },

  // United Kingdom
  { country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278, note: 'Home base' },
  { country: 'United Kingdom', city: 'Manchester', lat: 53.4808, lng: -2.2426 },
  { country: 'United Kingdom', city: 'Glasgow', lat: 55.8642, lng: -4.2518 },
  { country: 'United Kingdom', city: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
  { country: 'United Kingdom', city: 'Cardiff', lat: 51.4816, lng: -3.1791 },
  { country: 'United Kingdom', city: 'Birmingham', lat: 52.4862, lng: -1.8904 },
  { country: 'United Kingdom', city: 'Bristol', lat: 51.4545, lng: -2.5879 },
  { country: 'United Kingdom', city: 'Plymouth', lat: 50.3755, lng: -4.1427 },
  { country: 'United Kingdom', city: 'Cambridge', lat: 52.2053, lng: 0.1218 },
  { country: 'United Kingdom', city: 'Oxford', lat: 51.7520, lng: -1.2577 },

  // France
  { country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
  { country: 'France', city: 'Val Thorens', lat: 45.2977, lng: 6.5798 },
  { country: 'France', city: 'Valmeinier', lat: 45.1667, lng: 6.5000 },

  // Luxembourg
  { country: 'Luxembourg', city: 'Luxembourg City', lat: 49.6116, lng: 6.1319 },

  // Italy
  { country: 'Italy', city: 'Rome', lat: 41.9028, lng: 12.4964 },
  { country: 'Italy', city: 'Bari', lat: 41.1171, lng: 16.8719 },
  { country: 'Italy', city: 'Orvieto', lat: 42.7186, lng: 12.1113 },
  { country: 'Italy', city: 'Fiumicino', lat: 41.7707, lng: 12.2494 },

  // Croatia
  { country: 'Croatia', city: 'Zadar', lat: 44.1194, lng: 15.2314 },

  // Albania
  { country: 'Albania', city: 'Durres', lat: 41.3231, lng: 19.4414 },
  { country: 'Albania', city: 'Tirana', lat: 41.3275, lng: 19.8187 },

  // Bulgaria
  { country: 'Bulgaria', city: 'Bansko', lat: 41.8383, lng: 23.4881 },

  // Romania
  { country: 'Romania', city: 'Bucharest', lat: 44.4268, lng: 26.1025 },

  // Serbia
  { country: 'Serbia', city: 'Belgrade', lat: 44.7866, lng: 20.4489 },
  { country: 'Serbia', city: 'Uzice', lat: 43.8556, lng: 19.8422 },

  // Hungary
  { country: 'Hungary', city: 'Budapest', lat: 47.4979, lng: 19.0402 },

  // Czechia
  { country: 'Czechia', city: 'Prague', lat: 50.0755, lng: 14.4378 },

  // Denmark
  { country: 'Denmark', city: 'Billund', lat: 55.7308, lng: 9.1012 },

  // Poland
  { country: 'Poland', city: 'Gdansk', lat: 54.3520, lng: 18.6466 },

  // Spain
  { country: 'Spain', city: 'Malaga', lat: 36.7213, lng: -4.4214 },
  { country: 'Spain', city: 'Tenerife', lat: 28.4636, lng: -16.2518 },

  // Portugal
  { country: 'Portugal', city: 'Portimao', lat: 37.1364, lng: -8.5385 },

  // Morocco
  { country: 'Morocco', city: 'Marrakesh', lat: 31.6295, lng: -7.9811 },
  { country: 'Morocco', city: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { country: 'Morocco', city: 'Ouarzazate', lat: 30.9189, lng: -6.8934 },

  // UAE
  { country: 'UAE', city: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { country: 'UAE', city: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },

  // Oman
  { country: 'Oman', city: 'Muscat', lat: 23.5880, lng: 58.3829 },

  // India
  { country: 'India', city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },

  // Thailand
  { country: 'Thailand', city: 'Bangkok', lat: 13.7563, lng: 100.5018 },

  // Vatican City
  { country: 'Vatican City', city: 'Vatican City', lat: 41.9029, lng: 12.4534 },

  // Bahrain
  { country: 'Bahrain', city: 'Manama', lat: 26.2708, lng: 50.6336 },

  // Malaysia
  { country: 'Malaysia', city: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },

  // Singapore
  { country: 'Singapore', city: 'Singapore', lat: 1.3644, lng: 103.9915 },

  // United States
  { country: 'United States', city: 'San Francisco', lat: 37.7749, lng: -122.4194, note: 'Moving here' },
  { country: 'United States', city: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
  { country: 'United States', city: 'Miami', lat: 25.7617, lng: -80.1918 },
  { country: 'United States', city: 'Orlando', lat: 28.5383, lng: -81.3792 },

  // Jamaica
  { country: 'Jamaica', city: 'Port Antonio', lat: 18.1785, lng: -76.4501 },
  { country: 'Jamaica', city: 'Ocho Rios', lat: 18.4074, lng: -77.1032 },
  { country: 'Jamaica', city: 'Negril', lat: 18.2685, lng: -78.3488 },
  { country: 'Jamaica', city: 'Kingston', lat: 17.9712, lng: -76.7929 },

  // Panama
  { country: 'Panama', city: 'Panama City', lat: 9.0714, lng: -79.3834 },

  // Bolivia
  { country: 'Bolivia', city: 'Santa Cruz de la Sierra', lat: -17.7833, lng: -63.1667 },

  // Paraguay
  { country: 'Paraguay', city: 'Asuncion', lat: -25.2637, lng: -57.5759 },

  // Brazil
  { country: 'Brazil', city: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { country: 'Brazil', city: 'Sao Paulo', lat: -23.5505, lng: -46.6333 },
  { country: 'Brazil', city: 'Curitiba', lat: -25.4284, lng: -49.2733 },
  { country: 'Brazil', city: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },

  // Uruguay
  { country: 'Uruguay', city: 'Maldonado', lat: -34.9088, lng: -54.9578 },
  { country: 'Uruguay', city: 'Montevideo', lat: -34.9011, lng: -56.1645 },

  // Argentina
  { country: 'Argentina', city: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },

  // Mexico
  { country: 'Mexico', city: 'Cancun', lat: 21.1619, lng: -86.8515 },

  // Greece
  { country: 'Greece', city: 'Corfu', lat: 39.6243, lng: 19.9217 },

  // Belgium
  { country: 'Belgium', city: 'Arlon', lat: 49.6833, lng: 5.8167 },

  // Germany
  { country: 'Germany', city: 'Trier', lat: 49.7596, lng: 6.6441 },

  // Vietnam
  { country: 'Vietnam', city: 'Da Nang', lat: 16.0544, lng: 108.2022 },
];
