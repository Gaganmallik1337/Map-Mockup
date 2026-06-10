export interface CountryData {
  name: string;
  iso_a3: string;
  president: string;
  population: number;
  treasury: number;
  gdp: number;
  militaryStrength: number;
  stability: number;
  currency: string;
  activeWars: string[];
  politicalParties: string[];
  congress: { party: string; seats: number }[];
  alliance: 'NATO' | 'BRICS' | 'Non-Aligned' | 'EU' | 'None';
  regions: string[];
}

const presidents = ["John Doe", "Jane Smith", "Alan Turing", "Grace Hopper", "Ada Lovelace", "Nikola Tesla", "Marie Curie"];
const currencies = ["USD", "EUR", "CNY", "INR", "JPY", "GBP", "RUB", "BRL"];
const partyNames = ["Progressive Party", "Conservative Union", "Green Alliance", "Workers Front", "Liberty Coalition", "National Party"];

// Deterministic random based on string seed
function seedRandom(seed: string) {
  let h = 0;
  for(let i = 0; i < seed.length; i++)
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

export function generateMockData(countryName: string, iso_a3: string): CountryData {
  const rand = seedRandom(iso_a3 || countryName);
  const getRand = () => rand() / 4294967296;

  // Specific overrides for major powers
  let population = Math.floor(getRand() * 100000000) + 5000000;
  let gdp = Math.floor(getRand() * 2000000) + 100000; // in millions
  let militaryStrength = Math.floor(getRand() * 80) + 10;
  let alliance: CountryData['alliance'] = 'Non-Aligned';
  
  if (iso_a3 === 'USA') {
    population = 331000000; gdp = 23000000; militaryStrength = 100; alliance = 'NATO';
  } else if (iso_a3 === 'CHN') {
    population = 1400000000; gdp = 18000000; militaryStrength = 95; alliance = 'BRICS';
  } else if (iso_a3 === 'IND') {
    population = 1380000000; gdp = 3000000; militaryStrength = 85; alliance = 'BRICS';
  } else if (iso_a3 === 'RUS') {
    population = 144000000; gdp = 1700000; militaryStrength = 90; alliance = 'BRICS';
  } else if (['GBR', 'FRA', 'DEU', 'ITA'].includes(iso_a3)) {
    militaryStrength = 75 + Math.floor(getRand() * 10);
    alliance = 'NATO';
  }

  const p1 = partyNames[Math.floor(getRand() * partyNames.length)];
  let p2 = partyNames[Math.floor(getRand() * partyNames.length)];
  while(p2 === p1) p2 = partyNames[Math.floor(getRand() * partyNames.length)];

  const p1Seats = Math.floor(getRand() * 60) + 20;

  return {
    name: countryName,
    iso_a3,
    president: presidents[Math.floor(getRand() * presidents.length)],
    population,
    treasury: Math.floor(gdp * (getRand() * 0.2 + 0.05)), // 5-25% of GDP
    gdp,
    militaryStrength,
    stability: Math.floor(getRand() * 50) + 50,
    currency: currencies[Math.floor(getRand() * currencies.length)],
    activeWars: getRand() > 0.9 ? ["Border Skirmish"] : [],
    politicalParties: [p1, p2],
    congress: [
      { party: p1, seats: p1Seats },
      { party: p2, seats: 100 - p1Seats }
    ],
    alliance,
    regions: Array.from({length: 7}, (_, i) => `Region ${i+1}`)
  };
}
