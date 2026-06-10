import React from 'react';
import type { LayerType } from '../App';
import { Globe, Shield, DollarSign, Users, Hexagon, Maximize } from 'lucide-react';

interface TopBarProps {
  activeLayer: LayerType;
  setActiveLayer: (l: LayerType) => void;
  isSituationRoom: boolean;
  setIsSituationRoom: (b: boolean) => void;
}

export default function TopBar({ activeLayer, setActiveLayer, isSituationRoom, setIsSituationRoom }: TopBarProps) {
  const layers: { id: LayerType; icon: React.ReactNode }[] = [
    { id: 'Political', icon: <Globe size={18} /> },
    { id: 'Military', icon: <Shield size={18} /> },
    { id: 'Economic', icon: <DollarSign size={18} /> },
    { id: 'Diplomatic', icon: <Users size={18} /> },
    { id: 'Resources', icon: <Hexagon size={18} /> },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }}>
      <div className="glass-panel" style={{ display: 'flex', padding: 6, gap: 4 }}>
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              border: 'none',
              borderRadius: 8,
              background: activeLayer === layer.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: activeLayer === layer.id ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: activeLayer === layer.id ? 600 : 400,
            }}
          >
            {layer.icon}
            {layer.id}
          </button>
        ))}
      </div>

      <button
        className="glass-panel"
        onClick={() => setIsSituationRoom(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          border: '1px solid var(--accent-orange)',
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#fff',
          cursor: 'pointer',
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}
      >
        <Maximize size={18} />
        Situation Room
      </button>
    </div>
  );
}
