/**
 * Blueprint-compliant mock data for all major countries.
 * Each country has exactly 7 named regions with resource assignments.
 * Resources: 'Iron' | 'Grain' | 'Oil' | 'None'
 */

import dynamicRegionNames from './dynamic_region_names.json';

export type Resource = 'Iron' | 'Grain' | 'Oil' | 'None';

export interface Region {
  id: string;           // e.g. "IND-1"
  name: string;
  resource: Resource;
  isCapital: boolean;
  countryIso: string;
}

export interface CountryData {
  name: string;
  iso_a3: string;
  color: string;       // Fixed distinct color for the country
  president: string;
  population: number;
  treasury: number;
  gdp: number;
  militaryStrength: number;
  stability: number;
  currency: string;
  regions: Region[];
  alliance: 'NATO' | 'BRICS' | 'Non-Aligned' | 'SCO' | 'None';
  congress: { party: string; seats: number }[];
  activeWars: string[];
}

const COUNTRIES: Omit<CountryData, 'president' | 'congress' | 'activeWars'>[] = [
  {
    name: 'India', iso_a3: 'IND', color: '#f97316', currency: 'INR',
    population: 1380000000, gdp: 3000000, treasury: 420000, militaryStrength: 85, stability: 72,
    alliance: 'BRICS',
    regions: [
      { id: 'IND-1', name: 'Punjab', resource: 'Grain', isCapital: false, countryIso: 'IND' },
      { id: 'IND-2', name: 'Rajasthan', resource: 'None', isCapital: false, countryIso: 'IND' },
      { id: 'IND-3', name: 'Gujarat', resource: 'Oil', isCapital: false, countryIso: 'IND' },
      { id: 'IND-4', name: 'Maharashtra', resource: 'Iron', isCapital: false, countryIso: 'IND' },
      { id: 'IND-5', name: 'Tamil Nadu', resource: 'None', isCapital: false, countryIso: 'IND' },
      { id: 'IND-6', name: 'Uttar Pradesh', resource: 'Grain', isCapital: true, countryIso: 'IND' },
      { id: 'IND-7', name: 'Assam', resource: 'Oil', isCapital: false, countryIso: 'IND' },
    ]
  },
  {
    name: 'United States of America', iso_a3: 'USA', color: '#3b82f6', currency: 'USD',
    population: 331000000, gdp: 23000000, treasury: 3200000, militaryStrength: 100, stability: 80,
    alliance: 'NATO',
    regions: [
      { id: 'USA-1', name: 'Northeast', resource: 'Iron', isCapital: true, countryIso: 'USA' },
      { id: 'USA-2', name: 'Southeast', resource: 'Grain', isCapital: false, countryIso: 'USA' },
      { id: 'USA-3', name: 'Midwest', resource: 'Grain', isCapital: false, countryIso: 'USA' },
      { id: 'USA-4', name: 'Texas', resource: 'Oil', isCapital: false, countryIso: 'USA' },
      { id: 'USA-5', name: 'California', resource: 'None', isCapital: false, countryIso: 'USA' },
      { id: 'USA-6', name: 'Rockies', resource: 'Iron', isCapital: false, countryIso: 'USA' },
      { id: 'USA-7', name: 'Pacific Northwest', resource: 'None', isCapital: false, countryIso: 'USA' },
    ]
  },
  {
    name: 'China', iso_a3: 'CHN', color: '#ef4444', currency: 'CNY',
    population: 1400000000, gdp: 18000000, treasury: 2100000, militaryStrength: 95, stability: 78,
    alliance: 'BRICS',
    regions: [
      { id: 'CHN-1', name: 'Beijing Region', resource: 'Iron', isCapital: true, countryIso: 'CHN' },
      { id: 'CHN-2', name: 'Shanghai Region', resource: 'None', isCapital: false, countryIso: 'CHN' },
      { id: 'CHN-3', name: 'Guangdong', resource: 'None', isCapital: false, countryIso: 'CHN' },
      { id: 'CHN-4', name: 'Sichuan', resource: 'Grain', isCapital: false, countryIso: 'CHN' },
      { id: 'CHN-5', name: 'Xinjiang', resource: 'Oil', isCapital: false, countryIso: 'CHN' },
      { id: 'CHN-6', name: 'Tibet', resource: 'Iron', isCapital: false, countryIso: 'CHN' },
      { id: 'CHN-7', name: 'Inner Mongolia', resource: 'Grain', isCapital: false, countryIso: 'CHN' },
    ]
  },
  {
    name: 'Russia', iso_a3: 'RUS', color: '#a855f7', currency: 'RUB',
    population: 144000000, gdp: 1700000, treasury: 250000, militaryStrength: 90, stability: 65,
    alliance: 'BRICS',
    regions: [
      { id: 'RUS-1', name: 'Moscow Oblast', resource: 'Iron', isCapital: true, countryIso: 'RUS' },
      { id: 'RUS-2', name: 'St. Petersburg', resource: 'None', isCapital: false, countryIso: 'RUS' },
      { id: 'RUS-3', name: 'Siberia', resource: 'Oil', isCapital: false, countryIso: 'RUS' },
      { id: 'RUS-4', name: 'Volga Region', resource: 'Grain', isCapital: false, countryIso: 'RUS' },
      { id: 'RUS-5', name: 'Urals', resource: 'Iron', isCapital: false, countryIso: 'RUS' },
      { id: 'RUS-6', name: 'Far East', resource: 'Oil', isCapital: false, countryIso: 'RUS' },
      { id: 'RUS-7', name: 'Caucasus', resource: 'Grain', isCapital: false, countryIso: 'RUS' },
    ]
  },
  {
    name: 'United Kingdom', iso_a3: 'GBR', color: '#0ea5e9', currency: 'GBP',
    population: 67000000, gdp: 2800000, treasury: 380000, militaryStrength: 78, stability: 82,
    alliance: 'NATO',
    regions: [
      { id: 'GBR-1', name: 'London', resource: 'None', isCapital: true, countryIso: 'GBR' },
      { id: 'GBR-2', name: 'South England', resource: 'Grain', isCapital: false, countryIso: 'GBR' },
      { id: 'GBR-3', name: 'Midlands', resource: 'Iron', isCapital: false, countryIso: 'GBR' },
      { id: 'GBR-4', name: 'North England', resource: 'Iron', isCapital: false, countryIso: 'GBR' },
      { id: 'GBR-5', name: 'Scotland', resource: 'Oil', isCapital: false, countryIso: 'GBR' },
      { id: 'GBR-6', name: 'Wales', resource: 'None', isCapital: false, countryIso: 'GBR' },
      { id: 'GBR-7', name: 'Northern Ireland', resource: 'Grain', isCapital: false, countryIso: 'GBR' },
    ]
  },
  {
    name: 'France', iso_a3: 'FRA', color: '#6366f1', currency: 'EUR',
    population: 67000000, gdp: 2700000, treasury: 320000, militaryStrength: 76, stability: 79,
    alliance: 'NATO',
    regions: [
      { id: 'FRA-1', name: 'Île-de-France', resource: 'None', isCapital: true, countryIso: 'FRA' },
      { id: 'FRA-2', name: 'Normandy', resource: 'Grain', isCapital: false, countryIso: 'FRA' },
      { id: 'FRA-3', name: 'Bretagne', resource: 'None', isCapital: false, countryIso: 'FRA' },
      { id: 'FRA-4', name: 'Alsace', resource: 'Iron', isCapital: false, countryIso: 'FRA' },
      { id: 'FRA-5', name: 'Provence', resource: 'None', isCapital: false, countryIso: 'FRA' },
      { id: 'FRA-6', name: 'Aquitaine', resource: 'Grain', isCapital: false, countryIso: 'FRA' },
      { id: 'FRA-7', name: 'Rhône-Alpes', resource: 'Iron', isCapital: false, countryIso: 'FRA' },
    ]
  },
  {
    name: 'Germany', iso_a3: 'DEU', color: '#84cc16', currency: 'EUR',
    population: 83000000, gdp: 4000000, treasury: 600000, militaryStrength: 74, stability: 85,
    alliance: 'NATO',
    regions: [
      { id: 'DEU-1', name: 'Berlin', resource: 'None', isCapital: true, countryIso: 'DEU' },
      { id: 'DEU-2', name: 'Bavaria', resource: 'Iron', isCapital: false, countryIso: 'DEU' },
      { id: 'DEU-3', name: 'North Rhine', resource: 'Iron', isCapital: false, countryIso: 'DEU' },
      { id: 'DEU-4', name: 'Brandenburg', resource: 'Grain', isCapital: false, countryIso: 'DEU' },
      { id: 'DEU-5', name: 'Saxony', resource: 'None', isCapital: false, countryIso: 'DEU' },
      { id: 'DEU-6', name: 'Hamburg', resource: 'None', isCapital: false, countryIso: 'DEU' },
      { id: 'DEU-7', name: 'Baden-Württemberg', resource: 'None', isCapital: false, countryIso: 'DEU' },
    ]
  },
  {
    name: 'Brazil', iso_a3: 'BRA', color: '#22c55e', currency: 'BRL',
    population: 213000000, gdp: 1600000, treasury: 180000, militaryStrength: 62, stability: 68,
    alliance: 'BRICS',
    regions: [
      { id: 'BRA-1', name: 'Brasília Region', resource: 'None', isCapital: true, countryIso: 'BRA' },
      { id: 'BRA-2', name: 'São Paulo', resource: 'None', isCapital: false, countryIso: 'BRA' },
      { id: 'BRA-3', name: 'Amazonas', resource: 'None', isCapital: false, countryIso: 'BRA' },
      { id: 'BRA-4', name: 'Rio de Janeiro', resource: 'Oil', isCapital: false, countryIso: 'BRA' },
      { id: 'BRA-5', name: 'Minas Gerais', resource: 'Iron', isCapital: false, countryIso: 'BRA' },
      { id: 'BRA-6', name: 'Mato Grosso', resource: 'Grain', isCapital: false, countryIso: 'BRA' },
      { id: 'BRA-7', name: 'Bahia', resource: 'Grain', isCapital: false, countryIso: 'BRA' },
    ]
  },
  {
    name: 'Saudi Arabia', iso_a3: 'SAU', color: '#f59e0b', currency: 'SAR',
    population: 35000000, gdp: 800000, treasury: 620000, militaryStrength: 58, stability: 71,
    alliance: 'None',
    regions: [
      { id: 'SAU-1', name: 'Riyadh Region', resource: 'Oil', isCapital: true, countryIso: 'SAU' },
      { id: 'SAU-2', name: 'Mecca Region', resource: 'Oil', isCapital: false, countryIso: 'SAU' },
      { id: 'SAU-3', name: 'Eastern Province', resource: 'Oil', isCapital: false, countryIso: 'SAU' },
      { id: 'SAU-4', name: 'Medina Region', resource: 'None', isCapital: false, countryIso: 'SAU' },
      { id: 'SAU-5', name: 'Asir Region', resource: 'Grain', isCapital: false, countryIso: 'SAU' },
      { id: 'SAU-6', name: 'Tabuk Region', resource: 'Iron', isCapital: false, countryIso: 'SAU' },
      { id: 'SAU-7', name: 'Ha\'il Region', resource: 'None', isCapital: false, countryIso: 'SAU' },
    ]
  },
  {
    name: 'Japan', iso_a3: 'JPN', color: '#ec4899', currency: 'JPY',
    population: 126000000, gdp: 5000000, treasury: 800000, militaryStrength: 72, stability: 88,
    alliance: 'None',
    regions: [
      { id: 'JPN-1', name: 'Kanto (Tokyo)', resource: 'None', isCapital: true, countryIso: 'JPN' },
      { id: 'JPN-2', name: 'Kansai (Osaka)', resource: 'None', isCapital: false, countryIso: 'JPN' },
      { id: 'JPN-3', name: 'Chubu', resource: 'Iron', isCapital: false, countryIso: 'JPN' },
      { id: 'JPN-4', name: 'Tohoku', resource: 'None', isCapital: false, countryIso: 'JPN' },
      { id: 'JPN-5', name: 'Kyushu', resource: 'Grain', isCapital: false, countryIso: 'JPN' },
      { id: 'JPN-6', name: 'Hokkaido', resource: 'Grain', isCapital: false, countryIso: 'JPN' },
      { id: 'JPN-7', name: 'Shikoku', resource: 'None', isCapital: false, countryIso: 'JPN' },
    ]
  },
  {
    name: 'Pakistan', iso_a3: 'PAK', color: '#14b8a6', currency: 'PKR',
    population: 220000000, gdp: 280000, treasury: 28000, militaryStrength: 68, stability: 52,
    alliance: 'SCO',
    regions: [
      { id: 'PAK-1', name: 'Punjab', resource: 'Grain', isCapital: true, countryIso: 'PAK' },
      { id: 'PAK-2', name: 'Sindh', resource: 'Oil', isCapital: false, countryIso: 'PAK' },
      { id: 'PAK-3', name: 'KPK', resource: 'None', isCapital: false, countryIso: 'PAK' },
      { id: 'PAK-4', name: 'Balochistan', resource: 'Iron', isCapital: false, countryIso: 'PAK' },
      { id: 'PAK-5', name: 'Islamabad', resource: 'None', isCapital: false, countryIso: 'PAK' },
      { id: 'PAK-6', name: 'AJK', resource: 'None', isCapital: false, countryIso: 'PAK' },
      { id: 'PAK-7', name: 'FATA', resource: 'Grain', isCapital: false, countryIso: 'PAK' },
    ]
  },
  {
    name: 'Australia', iso_a3: 'AUS', color: '#f43f5e', currency: 'AUD',
    population: 25000000, gdp: 1400000, treasury: 200000, militaryStrength: 60, stability: 87,
    alliance: 'None',
    regions: [
      { id: 'AUS-1', name: 'New South Wales', resource: 'Iron', isCapital: true, countryIso: 'AUS' },
      { id: 'AUS-2', name: 'Victoria', resource: 'None', isCapital: false, countryIso: 'AUS' },
      { id: 'AUS-3', name: 'Queensland', resource: 'Grain', isCapital: false, countryIso: 'AUS' },
      { id: 'AUS-4', name: 'Western Australia', resource: 'Iron', isCapital: false, countryIso: 'AUS' },
      { id: 'AUS-5', name: 'South Australia', resource: 'Grain', isCapital: false, countryIso: 'AUS' },
      { id: 'AUS-6', name: 'Northern Territory', resource: 'Oil', isCapital: false, countryIso: 'AUS' },
      { id: 'AUS-7', name: 'Tasmania', resource: 'None', isCapital: false, countryIso: 'AUS' },
    ]
  },
  {
    name: 'Canada', iso_a3: 'CAN', color: '#fb7185', currency: 'CAD',
    population: 38000000, gdp: 1900000, treasury: 260000, militaryStrength: 65, stability: 86,
    alliance: 'NATO',
    regions: [
      { id: 'CAN-1', name: 'Ontario', resource: 'Iron', isCapital: true, countryIso: 'CAN' },
      { id: 'CAN-2', name: 'Quebec', resource: 'None', isCapital: false, countryIso: 'CAN' },
      { id: 'CAN-3', name: 'Alberta', resource: 'Oil', isCapital: false, countryIso: 'CAN' },
      { id: 'CAN-4', name: 'British Columbia', resource: 'None', isCapital: false, countryIso: 'CAN' },
      { id: 'CAN-5', name: 'Saskatchewan', resource: 'Grain', isCapital: false, countryIso: 'CAN' },
      { id: 'CAN-6', name: 'Manitoba', resource: 'Grain', isCapital: false, countryIso: 'CAN' },
      { id: 'CAN-7', name: 'Yukon & NWT', resource: 'Iron', isCapital: false, countryIso: 'CAN' },
    ]
  },
];

const presidents = ["Narendra Modi", "Joe Biden", "Xi Jinping", "Vladimir Putin", "Rishi Sunak", "Emmanuel Macron", "Olaf Scholz", "Luiz Lula", "Mohammed bin Salman", "Fumio Kishida", "Shehbaz Sharif", "Anthony Albanese", "Justin Trudeau"];
const partyNames = [["BJP", "INC"], ["Republican", "Democratic"], ["CPC", "CPPCC"], ["United Russia", "CPRF"], ["Conservative", "Labour"], ["LREM", "RN"], ["CDU", "SPD"], ["PT", "PL"], ["PIF", "MCC"], ["LDP", "CDP"], ["PTI", "PML-N"], ["Liberal", "Labor"], ["Liberal", "NDP"]];

const COUNTRY_MAP: Record<string, CountryData> = {};

COUNTRIES.forEach((c, i) => {
  COUNTRY_MAP[c.iso_a3] = {
    ...c,
    president: presidents[i] || 'Unknown',
    congress: [
      { party: partyNames[i]?.[0] || 'Party A', seats: 55 + (i % 20) },
      { party: partyNames[i]?.[1] || 'Party B', seats: 45 - (i % 20) }
    ],
    activeWars: []
  };
});

/**
 * Get full data for a country by ISO A3 code.
 * Falls back to generated mock data for countries not in the curated list.
 */
export function getCountryData(name: string, iso_a3: string): CountryData {
  if (COUNTRY_MAP[iso_a3]) return COUNTRY_MAP[iso_a3];
  
  // Generic fallback for all other countries
  const seed = iso_a3 || name;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  const r = () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };

  const colors = ['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#95a5a6'];
  const resources: Resource[] = ['Iron','Grain','Oil','None'];
  
  // Try to use dynamically generated real names, otherwise generic
  const realNames = (dynamicRegionNames as Record<string, string[]>)[iso_a3];
  const regionNames = realNames || ['Northern Province','Southern Province','Eastern Province','Western Province','Central Province','Highland Region','Coastal Region'];

  return {
    name, iso_a3,
    color: colors[Math.floor(r() * colors.length)],
    president: ['A. Johnson','B. Williams','C. Davis','D. Martinez','E. Garcia'][Math.floor(r() * 5)],
    population: Math.floor(r() * 50000000) + 2000000,
    gdp: Math.floor(r() * 500000) + 50000,
    treasury: Math.floor(r() * 80000) + 10000,
    militaryStrength: Math.floor(r() * 60) + 20,
    stability: Math.floor(r() * 40) + 50,
    currency: ['USD','EUR','GBP','CHF','JPY','CNY'][Math.floor(r() * 6)],
    alliance: ['NATO','BRICS','Non-Aligned','None'][Math.floor(r() * 4)] as any,
    congress: [
      { party: 'National Party', seats: Math.floor(r() * 40) + 30 },
      { party: 'Opposition', seats: Math.floor(r() * 40) + 30 }
    ],
    activeWars: [],
    regions: regionNames.map((rn, i) => ({
      id: `${iso_a3}-${i+1}`,
      name: rn,
      resource: resources[Math.floor(r() * resources.length)],
      isCapital: i === 0,
      countryIso: iso_a3
    }))
  };
}

export function getCountryColor(iso_a3: string): string {
  if (COUNTRY_MAP[iso_a3]) return COUNTRY_MAP[iso_a3].color;
  const seed = iso_a3;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  const r = () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  const colors = ['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#d35400','#c0392b','#2980b9'];
  return colors[Math.floor(r() * colors.length)];
}
