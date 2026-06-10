import { useState } from 'react';
import MapView from './components/MapView';
import CountryPanel from './components/CountryPanel';
import RegionPanel from './components/RegionPanel';
import type { CountryData, Region } from './data/countryData';

export type AppView = 'world' | 'country' | 'region';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; iso: string } | null>(null);

  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
  };

  const handleSelectRegion = (region: Region, country: CountryData) => {
    setSelectedRegion(region);
    setSelectedCountry(country);
  };

  const handleCloseCountry = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
  };

  const handleCloseRegion = () => {
    setSelectedRegion(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#080c14' }}>
      <MapView
        onSelectCountry={handleSelectCountry}
        onSelectRegion={handleSelectRegion}
        onHoverCountry={setHoveredCountry}
        hoveredCountry={hoveredCountry}
        selectedCountry={selectedCountry}
        selectedRegion={selectedRegion}
      />

      {/* Country Panel */}
      <CountryPanel
        country={selectedCountry}
        onClose={handleCloseCountry}
        onSelectRegion={(r) => selectedCountry && handleSelectRegion(r, selectedCountry)}
      />

      {/* Region Panel (appears over country panel) */}
      <RegionPanel
        region={selectedRegion}
        country={selectedCountry}
        onClose={handleCloseRegion}
      />

      {/* Watermark / Disclaimer */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.65rem',
        color: 'rgba(148,163,184,0.5)',
        letterSpacing: '0.05em',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        Map based on public geographic data · Game world is fictional · All borders for gameplay purposes only
      </div>
    </div>
  );
}

export default App;
