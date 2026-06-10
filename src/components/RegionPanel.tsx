// Removed unused React import
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import type { CountryData, Region } from '../data/countryData';

interface RegionPanelProps {
  region: Region | null;
  country: CountryData | null;
  onClose: () => void;
}

const RESOURCE_DETAILS: Record<string, { icon: string; desc: string; color: string }> = {
  'Iron': {
    icon: '⛏',
    desc: 'Iron ore is mined here. Raw Material Companies operating in this region gain +50% production.',
    color: '#94a3b8'
  },
  'Grain': {
    icon: '🌾',
    desc: 'Agricultural land. Grain Farms operating in this region gain +50% production output.',
    color: '#eab308'
  },
  'Oil': {
    icon: '🛢',
    desc: 'Oil fields active. Oil Wells operating in this region gain +50% production output.',
    color: '#60a5fa'
  },
  'None': {
    icon: '—',
    desc: 'No resource bonus. All companies produce at the standard 1× rate.',
    color: '#64748b'
  }
};

export default function RegionPanel({ region, country, onClose }: RegionPanelProps) {
  const res = region ? RESOURCE_DETAILS[region.resource] : null;

  return (
    <AnimatePresence>
      {region && country && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          style={{
            position: 'absolute', top: 0, right: 360, bottom: 0,
            width: 300, zIndex: 35,
            display: 'flex', flexDirection: 'column',
            background: 'rgba(6,10,18,0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: country.color, boxShadow: `0 0 6px ${country.color}`
                  }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {country.name}
                  </span>
                  {region.isCapital && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '1px 6px', borderRadius: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', fontSize: '0.6rem', color: '#f59e0b' }}>
                      <Star size={9} fill="#f59e0b" /> Capital
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{region.name}</h2>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>Region {region.id.split('-')[1]} of 7</p>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.06)', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer',
                width: 30, height: 30, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Resource Card */}
            <div style={{
              padding: 16, borderRadius: 10,
              background: region.resource !== 'None' ? `${res!.color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${region.resource !== 'None' ? res!.color + '40' : 'rgba(255,255,255,0.06)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '1.5rem' }}>{res?.icon}</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resource</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: res?.color }}>{region.resource}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {res?.desc}
              </p>
              {region.resource !== 'None' && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: '0.75rem', color: '#10b981' }}>
                  ✓ Raw Material Company bonus: <strong>+50% production</strong>
                </div>
              )}
            </div>

            {/* Capital info */}
            {region.isCapital && (
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>Capital Region</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This is {country.name}'s capital region. The government is based here. Foreign travelers arriving in {country.name} land in this region.
                </p>
              </div>
            )}

            {/* Placeholder data */}
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 10 }}>Region Activity</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Companies', value: Math.floor(Math.random() * 20) + 3 },
                  { label: 'Citizens Present', value: Math.floor(Math.random() * 500) + 50 },
                  { label: 'Active Battles', value: 0 },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
