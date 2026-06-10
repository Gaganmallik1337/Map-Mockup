import { useCallback, useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getCountryData } from '../data/countryData';
import type { CountryData, Region } from '../data/countryData';

interface MapViewProps {
  onSelectCountry: (c: CountryData) => void;
  onSelectRegion: (r: Region, c: CountryData) => void;
  onHoverCountry: (h: { name: string; iso: string } | null) => void;
  hoveredCountry: { name: string; iso: string } | null;
  selectedCountry: CountryData | null;
  selectedRegion: Region | null;
}

const COUNTRY_COLORS: Record<string, string> = {
  IND:'#c2410c', USA:'#1d4ed8', CHN:'#b91c1c', RUS:'#7c3aed',
  GBR:'#0369a1', FRA:'#4338ca', DEU:'#4d7c0f', BRA:'#15803d',
  SAU:'#b45309', JPN:'#be185d', PAK:'#0f766e', AUS:'#be123c',
  CAN:'#e11d48', IRN:'#9a3412', TUR:'#6d28d9', EGY:'#a16207',
  MEX:'#047857', ARG:'#0e7490', ZAF:'#991b1b', NGA:'#065f46',
  KOR:'#0c4a6e', VNM:'#7f1d1d', IDN:'#7c2d12', UKR:'#1e40af',
  POL:'#9f1239', ESP:'#9a3412', ITA:'#166534',
};

function getColor(iso: string): string {
  if (COUNTRY_COLORS[iso]) return COUNTRY_COLORS[iso];
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = Math.imul(31, h) + iso.charCodeAt(i) | 0;
  const r = () => { h = Math.imul(h^h>>>16, 2246822507); h = Math.imul(h^h>>>13, 3266489909); return ((h^=h>>>16)>>>0)/4294967296; };
  const p = ['#1d4ed8','#b91c1c','#15803d','#7c3aed','#b45309','#0f766e','#be185d','#0369a1','#065f46','#9f1239','#166534','#6d28d9'];
  return p[Math.floor(r() * p.length)];
}

function colorMatchExpr(prop: string): any {
  const pairs: any[] = [];
  for (const [iso, col] of Object.entries(COUNTRY_COLORS)) pairs.push(iso, col);
  return ['match', ['get', prop], ...pairs, '#334155'];
}

export default function MapView({ onSelectCountry, onSelectRegion, onHoverCountry, hoveredCountry, selectedCountry, selectedRegion }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(2);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Regions only shown when a country is selected (clicked)
  const showRegions = selectedCountry !== null;
  const selIso = selectedCountry?.iso_a3 || '__';
  const selRegId = selectedRegion?.id || '__';

  const handleClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (showRegions) {
      const rF = map.queryRenderedFeatures(e.point, { layers: ['regions-fill'] });
      if (rF.length > 0) {
        const p = rF[0].properties as any;
        const country = getCountryData(p.country_iso, p.country_iso);
        const region = country.regions.find(r => r.id === p.region_id);
        if (region) { onSelectRegion(region, country); return; }
      }
    }

    const cF = map.queryRenderedFeatures(e.point, { layers: ['countries-fill'] });
    if (cF.length > 0) {
      const p = cF[0].properties as any;
      const name = p.ADMIN || p.name || 'Unknown';
      const iso = p.ISO_A3 || p.iso_a3 || p['ISO3166-1-Alpha-3'] || '';
      const country = getCountryData(name, iso);
      onSelectCountry(country);
      map.flyTo({ center: e.lngLat, zoom: Math.max(zoom, 4.5), pitch: 10, duration: 1000 });
    }
  }, [onSelectCountry, onSelectRegion, showRegions, zoom]);

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const layers = showRegions ? ['regions-fill', 'countries-fill'] : ['countries-fill'];
    const feats = map.queryRenderedFeatures(e.point, { layers });
    if (feats.length > 0) {
      const p = feats[0].properties as any;
      const name = p.region_name || p.ADMIN || p.name || '';
      const iso = p.country_iso || p.ISO_A3 || p.iso_a3 || p['ISO3166-1-Alpha-3'] || '';
      onHoverCountry({ name, iso });
      setHoveredRegionId(p.region_id || null);
      map.getCanvas().style.cursor = 'pointer';
    } else {
      onHoverCountry(null);
      setHoveredRegionId(null);
      map.getCanvas().style.cursor = 'grab';
    }
  }, [onHoverCountry, showRegions]);

  const handleDblClick = useCallback((e: MapLayerMouseEvent) => {
    e.preventDefault();
    mapRef.current?.getMap()?.flyTo({ center: e.lngLat, zoom: zoom + 1.5, duration: 600 });
  }, [zoom]);

  // Enable smooth two-finger panning on trackpads
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const canvas = map.getCanvasContainer();
    const handleWheel = (e: WheelEvent) => {
      // If holding ctrl (which trackpads simulate during pinch-to-zoom), let MapLibre zoom.
      // Otherwise, intercept the wheel event and pan the map instead.
      if (!e.ctrlKey && !e.metaKey) {
        e.stopPropagation();
        e.preventDefault();
        // Adjust the multiplier for panning speed (1.0 is 1:1 with trackpad)
        map.panBy([e.deltaX, e.deltaY], { animate: false });
      }
    };

    // Use capture phase to intercept before MapLibre's own wheel handler
    canvas.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  const handleZoom = useCallback(() => {
    setZoom(mapRef.current?.getMap()?.getZoom() ?? 2);
  }, []);

  // ── COUNTRY LAYERS (always visible) ──────────────────────────────

  // Country fill: when regions are showing, only selected country shows; others fade
  const countriesFill: any = {
    id: 'countries-fill',
    type: 'fill',
    paint: {
      'fill-color': colorMatchExpr('ISO3166-1-Alpha-3'),
      'fill-opacity': showRegions
        ? ['case', ['==', ['get', 'ISO3166-1-Alpha-3'], selIso], 0, 0.15]  // non-selected countries dimmed
        : 0.32
    }
  };

  // Always-on country borders
  const countriesLine: any = {
    id: 'countries-line',
    type: 'line',
    paint: {
      'line-color': showRegions ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.22)',
      'line-width': 0.8
    }
  };

  // Bright outline on selected country (always shown while a country is selected)
  const countriesGlow: any = {
    id: 'countries-glow',
    type: 'line',
    filter: ['==', ['get', 'ISO3166-1-Alpha-3'], selIso],
    paint: {
      'line-color': '#ffffff',
      'line-width': 2.5,
      'line-opacity': 0.85
    }
  };

  // Country name label — always visible
  const countriesLabel: any = {
    id: 'countries-label',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'name'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 2, 9, 4, 12, 6, 14],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-anchor': 'center',
      'text-max-width': 8,
      'text-allow-overlap': false,
      'text-padding': 6,
      // Hide country label for the selected country once regions are shown
      'visibility': 'visible',
    },
    paint: {
      'text-color': showRegions
        ? ['case', ['==', ['get', 'iso'], selIso], 'rgba(255,255,255,0)', '#e2e8f0']
        : '#e2e8f0',
      'text-halo-color': 'rgba(0,0,0,0.7)',
      'text-halo-width': 1.5
    }
  };

  // ── REGION LAYERS (zoomed in) ─────────────────────────────────────

  // Main region fill — only for selected country
  const regionsFill: any = {
    id: 'regions-fill',
    type: 'fill',
    filter: ['==', ['get', 'country_iso'], selIso],
    layout: { visibility: showRegions ? 'visible' : 'none' },
    paint: {
      'fill-color': ['get', 'region_color'],
      'fill-opacity': ['case',
        ['==', ['get', 'region_id'], selRegId], 0.90,
        ['==', ['get', 'region_id'], hoveredRegionId ?? '__'], 0.80,
        0.68
      ]
    }
  };

  // Region border — dark base line, only selected country
  const regionsLine: any = {
    id: 'regions-line',
    type: 'line',
    filter: ['==', ['get', 'country_iso'], selIso],
    layout: { visibility: showRegions ? 'visible' : 'none' },
    paint: {
      'line-color': 'rgba(0,0,0,0.55)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1.5, 6, 2.5]
    }
  };

  // Inner bright edge — only selected country
  const regionsBorderInner: any = {
    id: 'regions-border-inner',
    type: 'line',
    filter: ['==', ['get', 'country_iso'], selIso],
    layout: { visibility: showRegions ? 'visible' : 'none' },
    paint: {
      'line-color': 'rgba(255,255,255,0.30)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 6, 1.5]
    }
  };

  // Selected region highlight ring — scoped to selected country + selected region
  const regionsSelected: any = {
    id: 'regions-selected',
    type: 'line',
    layout: { visibility: showRegions ? 'visible' : 'none' },
    filter: ['all',
      ['==', ['get', 'country_iso'], selIso],
      ['==', ['get', 'region_id'], selRegId]
    ],
    paint: {
      'line-color': '#ffffff',
      'line-width': 3,
      'line-opacity': 0.95
    }
  };

  // Hover highlight — scoped to selected country
  const regionsHover: any = {
    id: 'regions-hover',
    type: 'line',
    layout: { visibility: showRegions ? 'visible' : 'none' },
    filter: ['all',
      ['==', ['get', 'country_iso'], selIso],
      ['==', ['get', 'region_id'], hoveredRegionId ?? '__']
    ],
    paint: {
      'line-color': 'rgba(255,255,255,0.75)',
      'line-width': 2
    }
  };

  // Region name labels — only selected country
  const regionsLabel: any = {
    id: 'regions-label',
    type: 'symbol',
    filter: ['==', ['get', 'country_iso'], selIso],
    layout: {
      visibility: showRegions ? 'visible' : 'none',
      'text-field': ['get', 'region_name'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 2, 10, 5, 13, 7, 16],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-anchor': 'center',
      'text-max-width': 10,
      'text-allow-overlap': true,
      'text-offset': [0, 1.2],
      'text-padding': 4,
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': 'rgba(0,0,0,0.8)',
      'text-halo-width': 2
    }
  };

  // Capital star — only for selected country's capital region
  const capitalLabel: any = {
    id: 'capital-star',
    type: 'symbol',
    filter: ['all',
      ['==', ['get', 'country_iso'], selIso],
      ['==', ['get', 'is_capital'], true]
    ],
    layout: {
      visibility: showRegions ? 'visible' : 'none',
      'text-field': '★',
      'text-size': ['interpolate', ['linear'], ['zoom'], 2, 12, 6, 16],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-anchor': 'center',
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': '#fbbf24',
      'text-halo-color': 'rgba(0,0,0,0.8)',
      'text-halo-width': 1.5,
      'text-opacity': ['interpolate',['linear'],['zoom'], 2.8, 0, 3.5, 1]
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 15, latitude: 20, zoom: 2, pitch: 10 }}
        mapStyle="/blank-style.json"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onDblClick={handleDblClick}
        onZoom={handleZoom}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Country base fills + always-on borders */}
        <Source id="countries" type="geojson" data="/countries.geojson?v=5" generateId>
          <Layer {...countriesFill} />
          <Layer {...countriesLine} />
          <Layer {...countriesGlow} />
        </Source>

        {/* Single point labels for countries */}
        <Source id="country-labels" type="geojson" data="/country_labels.geojson?v=5">
          <Layer {...countriesLabel} />
        </Source>

        {/* 7 merged region polygons */}
        <Source id="regions" type="geojson" data="/regions.geojson?v=5" generateId>
          <Layer {...regionsFill} />
          <Layer {...regionsLine} />
          <Layer {...regionsBorderInner} />
          <Layer {...regionsHover} />
          <Layer {...regionsSelected} />
        </Source>

        {/* Single point labels for regions */}
        <Source id="region-labels" type="geojson" data="/region_labels.geojson?v=5">
          <Layer {...regionsLabel} />
          <Layer {...capitalLabel} />
        </Source>

        {/* Hover label */}
        {hoveredCountry && (
          <div style={{
            position: 'absolute', top: 14, left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none', zIndex: 20
          }}>
            <div className="glass-panel" style={{
              padding: '5px 14px', fontSize: '0.8rem',
              color: '#f1f5f9', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: getColor(hoveredCountry.iso),
                boxShadow: `0 0 6px ${getColor(hoveredCountry.iso)}`,
                display: 'inline-block', flexShrink: 0
              }} />
              {hoveredCountry.name}
            </div>
          </div>
        )}
      </Map>

      {/* Regions appear on country click — no zoom hint needed */}
    </div>
  );
}
