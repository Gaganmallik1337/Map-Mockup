import React, { useMemo, useCallback, useRef } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { generateMockData } from '../data/mockDataGenerator';
import type { CountryData } from '../data/mockDataGenerator';
import type { LayerType, ScenarioType, GlobalState } from '../App';
import { capitals, tradeRoutes, mockBattles } from '../data/worldData';
import { MapPin, Skull } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapContainerProps {
  activeLayer: LayerType;
  scenario: ScenarioType;
  globalState: GlobalState;
  onSelectCountry: (country: CountryData | null) => void;
  onHoverCountry: (country: CountryData | null) => void;
  selectedCountry: CountryData | null;
  hoveredCountry: CountryData | null;
  isSituationRoom: boolean;
}

export default function MapContainer({
  activeLayer,
  scenario,
  globalState,
  onSelectCountry,
  onHoverCountry,
  selectedCountry,
  hoveredCountry,
  isSituationRoom
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);

  const handleMouseMove = useCallback((e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const name = feature.properties.ADMIN || feature.properties.name || 'Unknown';
      const iso = feature.properties.ISO_A3 || feature.properties.iso_a3 || '';
      onHoverCountry(generateMockData(name, iso));
    } else {
      onHoverCountry(null);
    }
  }, [onHoverCountry]);

  const handleClick = useCallback((e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const name = feature.properties.ADMIN || feature.properties.name || 'Unknown';
      const iso = feature.properties.ISO_A3 || feature.properties.iso_a3 || '';
      onSelectCountry(generateMockData(name, iso));
    } else {
      onSelectCountry(null);
    }
  }, [onSelectCountry]);

  const handleDblClick = useCallback((e: any) => {
    if (e.features && e.features.length > 0) {
      const map = mapRef.current?.getMap();
      if (map) {
        map.flyTo({ center: e.lngLat, zoom: 4, pitch: 45, duration: 2000 });
      }
    }
  }, []);

  // Base styling for countries based on layers
  const fillLayerStyle: any = useMemo(() => ({
    id: 'countries-fill',
    type: 'fill',
    paint: {
      'fill-color': activeLayer === 'Political' ? 'rgba(59, 130, 246, 0.1)' :
                    activeLayer === 'Military' ? 'rgba(239, 68, 68, 0.15)' :
                    activeLayer === 'Economic' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0.1
      ]
    }
  }), [activeLayer]);

  const lineLayerStyle: any = useMemo(() => ({
    id: 'countries-line',
    type: 'line',
    paint: {
      'line-color': activeLayer === 'Political' ? '#3b82f6' :
                    activeLayer === 'Military' ? '#ef4444' :
                    activeLayer === 'Economic' ? '#10b981' : '#475569',
      'line-width': 1,
      'line-opacity': 0.8
    }
  }), [activeLayer]);

  const selectedLineStyle: any = useMemo(() => ({
    id: 'countries-selected-line',
    type: 'line',
    paint: {
      'line-color': '#ffffff',
      'line-width': 3,
      'line-opacity': [
        'case',
        ['==', ['get', 'ISO_A3'], selectedCountry?.iso_a3 || ''],
        1,
        0
      ]
    }
  }), [selectedCountry]);

  // Trade Routes Line Source
  const tradeRoutesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: tradeRoutes.map(tr => ({
        type: 'Feature',
        properties: { id: tr.id },
        geometry: {
          type: 'LineString',
          coordinates: tr.coordinates
        }
      }))
    };
  }, []);

  const tradeRouteLineStyle: any = {
    id: 'trade-routes',
    type: 'line',
    paint: {
      'line-color': '#f59e0b',
      'line-width': 2,
      'line-opacity': 0.6,
      'line-dasharray': [2, 2] // Simple dash for animated feel
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: isSituationRoom ? 1.5 : 2,
          pitch: isSituationRoom ? 0 : 30, // Flat in situation room, tilted otherwise
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactiveLayerIds={['countries-fill']}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onDblClick={handleDblClick}
        onMouseLeave={() => onHoverCountry(null)}
        cursor={hoveredCountry ? 'pointer' : 'grab'}
        doubleClickZoom={false} // Disable default double click zoom to use our custom flyTo
      >
        <Source type="geojson" data="/countries.geojson" generateId={true}>
          <Layer {...fillLayerStyle} />
          <Layer {...lineLayerStyle} />
          <Layer {...selectedLineStyle} />
        </Source>

        {/* Trade Routes - visible only in Economic or Diplomatic layers */}
        {(activeLayer === 'Economic' || activeLayer === 'Diplomatic') && (
          <Source type="geojson" data={tradeRoutesGeoJSON as any}>
            <Layer {...tradeRouteLineStyle} />
          </Source>
        )}

        {/* Capital Markers */}
        {capitals.map(cap => (
          <Marker key={cap.id} longitude={cap.coordinates[0]} latitude={cap.coordinates[1]} anchor="center">
            <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--accent-blue)', borderRadius: '50%' }}
              />
              <MapPin size={12} color="#fff" style={{ position: 'relative', zIndex: 2 }} />
            </div>
          </Marker>
        ))}

        {/* Active Battles Markers */}
        {mockBattles.filter(b => globalState.activeBattles.includes(b.id)).map(battle => (
          <Marker key={battle.id} longitude={battle.coordinates[0]} latitude={battle.coordinates[1]} anchor="center">
            <div style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--accent-red)', borderRadius: '50%' }}
              />
              <Skull size={18} color="#fff" style={{ position: 'relative', zIndex: 2 }} />
            </div>
          </Marker>
        ))}

        {/* Hover Tooltip */}
        {hoveredCountry && !isSituationRoom && (
          <div 
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              left: 20,
              bottom: 20,
              zIndex: 10,
              minWidth: 200,
            }}
            className="glass-panel"
          >
            <div style={{ padding: 16 }}>
              <h3 className="title" style={{ margin: 0 }}>{hoveredCountry.name}</h3>
              <div style={{ marginTop: 8 }}>
                <p className="subtitle">President</p>
                <p className="value">{hoveredCountry.president}</p>
              </div>
              <div style={{ marginTop: 8 }}>
                <p className="subtitle">Military</p>
                <div style={{ width: '100%', height: 4, background: '#333', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${hoveredCountry.militaryStrength}%`, height: '100%', background: 'var(--accent-red)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
