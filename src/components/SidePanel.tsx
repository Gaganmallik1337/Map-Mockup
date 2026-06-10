import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountryData } from '../data/mockDataGenerator';
import { X, Users, DollarSign, Shield, Activity, Map as MapIcon, Landmark } from 'lucide-react';

interface SidePanelProps {
  selectedCountry: CountryData | null;
  onClose: () => void;
}

export default function SidePanel({ selectedCountry, onClose }: SidePanelProps) {
  return (
    <AnimatePresence>
      {selectedCountry && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            bottom: 20,
            width: 380,
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
          className="glass-panel"
        >
          {/* Header */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 className="title" style={{ fontSize: '1.75rem', marginBottom: 4 }}>{selectedCountry.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '2px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>{selectedCountry.iso_a3}</span>
                <span style={{ color: 'var(--accent-blue)', fontSize: '0.875rem' }}>{selectedCountry.alliance}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Content Scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <StatCard icon={<Users size={16} />} label="Population" value={formatNumber(selectedCountry.population)} />
              <StatCard icon={<DollarSign size={16} />} label="GDP" value={`$${formatNumber(selectedCountry.gdp)}M`} />
              <StatCard icon={<Shield size={16} />} label="Military" value={`${selectedCountry.militaryStrength} / 100`} color="var(--accent-red)" />
              <StatCard icon={<Activity size={16} />} label="Stability" value={`${selectedCountry.stability}%`} color="var(--accent-green)" />
            </div>

            {/* Government */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Landmark size={18} color="var(--accent-blue)" />
                <h3 className="title" style={{ margin: 0, fontSize: '1.125rem' }}>Government</h3>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8 }}>
                <p className="subtitle">President</p>
                <p className="value" style={{ marginBottom: 12 }}>{selectedCountry.president}</p>
                <p className="subtitle">Congress</p>
                <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ width: `${selectedCountry.congress[0].seats}%`, background: 'var(--accent-blue)' }} />
                  <div style={{ width: `${selectedCountry.congress[1].seats}%`, background: 'var(--accent-red)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>{selectedCountry.congress[0].party} ({selectedCountry.congress[0].seats}%)</span>
                  <span>{selectedCountry.congress[1].party} ({selectedCountry.congress[1].seats}%)</span>
                </div>
              </div>
            </div>

            {/* Regions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <MapIcon size={18} color="var(--accent-orange)" />
                <h3 className="title" style={{ margin: 0, fontSize: '1.125rem' }}>Regions</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedCountry.regions.map(r => (
                  <span key={r} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 16, fontSize: '0.875rem' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Wars */}
            {selectedCountry.activeWars.length > 0 && (
              <div>
                <h3 className="title" style={{ color: 'var(--accent-red)' }}>Active Conflicts</h3>
                {selectedCountry.activeWars.map(w => (
                  <div key={w} style={{ borderLeft: '2px solid var(--accent-red)', paddingLeft: 12, marginTop: 8 }}>
                    <p className="value">{w}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ icon, label, value, color = 'var(--accent-blue)' }: { icon: React.ReactNode, label: string, value: string | number, color?: string }) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: color, marginBottom: 4 }}>
        {icon}
        <span className="subtitle" style={{ fontSize: '0.7rem' }}>{label}</span>
      </div>
      <div className="value" style={{ fontSize: '1rem' }}>{value}</div>
    </div>
  );
}

function formatNumber(num: number) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
