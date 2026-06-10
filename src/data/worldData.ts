export const capitals = [
  { id: 'USA', name: 'Washington D.C.', coordinates: [-77.0369, 38.9072] },
  { id: 'CHN', name: 'Beijing', coordinates: [116.4074, 39.9042] },
  { id: 'RUS', name: 'Moscow', coordinates: [37.6173, 55.7558] },
  { id: 'IND', name: 'New Delhi', coordinates: [77.2090, 28.6139] },
  { id: 'GBR', name: 'London', coordinates: [-0.1278, 51.5074] },
  { id: 'FRA', name: 'Paris', coordinates: [2.3522, 48.8566] },
  { id: 'DEU', name: 'Berlin', coordinates: [13.4050, 52.5200] },
  { id: 'JPN', name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { id: 'BRA', name: 'Brasilia', coordinates: [-47.9292, -15.7801] },
  { id: 'ZAF', name: 'Pretoria', coordinates: [28.1881, -25.7461] }
];

// Simple straight-line trade routes for mockup purposes
export const tradeRoutes = [
  { id: 'tr1', from: 'USA', to: 'GBR', coordinates: [[-77.0369, 38.9072], [-0.1278, 51.5074]] },
  { id: 'tr2', from: 'USA', to: 'JPN', coordinates: [[-77.0369, 38.9072], [-140.0, 38.0], [139.6917, 35.6895]] }, // cross pacific approx
  { id: 'tr3', from: 'CHN', to: 'DEU', coordinates: [[116.4074, 39.9042], [70.0, 45.0], [13.4050, 52.5200]] },
  { id: 'tr4', from: 'IND', to: 'ZAF', coordinates: [[77.2090, 28.6139], [50.0, 5.0], [28.1881, -25.7461]] },
  { id: 'tr5', from: 'CHN', to: 'BRA', coordinates: [[116.4074, 39.9042], [10.0, 0.0], [-47.9292, -15.7801]] }
];

export const mockBattles = [
  { id: 'b1', name: 'Eastern Front', coordinates: [30.0, 50.0] },
  { id: 'b2', name: 'Himalayan Border', coordinates: [80.0, 32.0] },
  { id: 'b3', name: 'Middle East Conflict', coordinates: [42.0, 33.0] }
];
