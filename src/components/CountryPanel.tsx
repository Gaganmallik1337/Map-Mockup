// Removed unused React import
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, DollarSign, Shield, Activity, Landmark, Star } from 'lucide-react';
import type { CountryData, Region } from '../data/countryData';
import isoMap from '../data/iso3_to_iso2.json';

interface CountryPanelProps {
  country: CountryData | null;
  onClose: () => void;
  onSelectRegion: (r: Region) => void;
}

const RESOURCE_BADGE: Record<string, { color: string; icon: string }> = {
  'Iron': { color: 'rgba(148,163,184,0.2)', icon: '⛏' },
  'Grain': { color: 'rgba(234,179,8,0.2)', icon: '🌾' },
  'Oil': { color: 'rgba(30,64,175,0.3)', icon: '🛢' },
  'None': { color: 'rgba(255,255,255,0.04)', icon: '—' },
};

const ALLIANCE_COLORS: Record<string, string> = {
  'NATO': '#3b82f6',
  'BRICS': '#ef4444',
  'SCO': '#a855f7',
  'Non-Aligned': '#94a3b8',
  'None': '#64748b',
};

function formatNum(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toString();
}

export default function CountryPanel({ country, onClose, onSelectRegion }: CountryPanelProps) {
  const iso2 = country ? (isoMap as Record<string, string>)[country.iso_a3] : null;
  const flagUrl = iso2 && iso2 !== '-99' ? `https://flagcdn.com/w320/${iso2}.png` : null;

  return (
    <AnimatePresence>
      {country && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 360, zIndex: 30,
            display: 'flex', flexDirection: 'column',
            background: 'rgba(8,12,20,0.92)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: country.color, flexShrink: 0,
                    boxShadow: `0 0 8px ${country.color}`
                  }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {country.iso_a3}
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 10,
                    background: `${ALLIANCE_COLORS[country.alliance]}22`,
                    border: `1px solid ${ALLIANCE_COLORS[country.alliance]}55`,
                    color: ALLIANCE_COLORS[country.alliance],
                    fontSize: '0.65rem', fontWeight: 600
                  }}>
                    {country.alliance}
                  </span>
                </div>
                {flagUrl && (
                  <img 
                    src={flagUrl} 
                    alt={`${country.name} Flag`} 
                    style={{ width: '100%', height: 'auto', maxHeight: 80, objectFit: 'contain', objectPosition: 'left', borderRadius: 2, marginBottom: 10, marginTop: 4 }} 
                  />
                )}
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{country.name}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  President: <span style={{ color: 'var(--text-primary)' }}>{country.president}</span>
                </p>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.06)', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer',
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <StatCard icon={<Users size={14} />} label="Population" value={formatNum(country.population)} />
              <StatCard icon={<DollarSign size={14} />} label="GDP" value={`$${formatNum(country.gdp)}M`} />
              <StatCard icon={<DollarSign size={14} />} label="Treasury" value={`$${formatNum(country.treasury)}M`} color="#10b981" />
              <StatCard icon={<Activity size={14} />} label="Stability" value={`${country.stability}%`} color="#f59e0b" />
            </div>

            {/* Military bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Shield size={14} color="var(--accent-red)" />
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Military Strength</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600 }}>{country.militaryStrength}/100</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${country.militaryStrength}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, #ef4444, #f97316)`, borderRadius: 3 }}
                />
              </div>
            </div>

            {/* Congress */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Landmark size={14} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Congress</span>
              </div>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
                {country.congress.map((c, i) => (
                  <div key={i} style={{
                    width: `${c.seats}%`,
                    background: i === 0 ? '#3b82f6' : '#ef4444',
                    transition: 'width 0.5s'
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {country.congress.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: i === 0 ? '#3b82f6' : '#ef4444' }}>■</span> {c.party} ({c.seats}%)
                  </span>
                ))}
              </div>
            </div>

            {/* 7 Regions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>7 Regions</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>click to view</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {country.regions.map(region => {
                  const res = RESOURCE_BADGE[region.resource];
                  return (
                    <button
                      key={region.id}
                      onClick={() => onSelectRegion(region)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    >
                      {/* Capital star */}
                      {region.isCapital && <Star size={11} color="#f59e0b" fill="#f59e0b" style={{ flexShrink: 0 }} />}
                      {!region.isCapital && <div style={{ width: 11, flexShrink: 0 }} />}

                      <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: region.isCapital ? 600 : 400 }}>
                        {region.name}
                      </span>

                      {/* Resource badge */}
                      {region.resource !== 'None' && (
                        <span style={{
                          padding: '2px 7px', borderRadius: 10,
                          background: res.color,
                          fontSize: '0.65rem', whiteSpace: 'nowrap'
                        }}>
                          {res.icon} {region.resource}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ icon, label, value, color = 'var(--accent-blue)' }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8, padding: '10px 12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color, marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
