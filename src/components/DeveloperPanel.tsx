import React, { useState } from 'react';
import type { ScenarioType, GlobalState } from '../App';
import { Settings, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeveloperPanelProps {
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export default function DeveloperPanel({ scenario, setScenario, globalState, setGlobalState }: DeveloperPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scenarios: ScenarioType[] = [
    'Normal',
    'Global Peace',
    'World War',
    'Economic Crisis',
    'Resource Boom',
    'Election Season',
    'India vs China Conflict',
    'Middle East Crisis'
  ];

  const handleTriggerWar = () => {
    setGlobalState(prev => ({
      ...prev,
      activeBattles: [...new Set([...prev.activeBattles, 'b1', 'b2', 'b3'])]
    }));
  };

  const handleEndWar = () => {
    setGlobalState(prev => ({
      ...prev,
      activeBattles: []
    }));
  };

  return (
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 40, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      
      {/* Toggle Button */}
      <button 
        className="glass-panel"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-panel)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '50%', cursor: 'pointer' }}
      >
        <Settings size={20} />
      </button>

      {/* Panel */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ padding: 20, width: 300, marginBottom: 4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Settings size={18} color="var(--accent-blue)" />
            <h3 className="title" style={{ margin: 0, fontSize: '1rem' }}>Developer Panel</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="subtitle" style={{ fontSize: '0.7rem' }}>SCENARIOS</p>
            {scenarios.map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: scenario === s ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${scenario === s ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)'}`,
                  color: scenario === s ? '#fff' : 'var(--text-secondary)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {s}
                {scenario === s && <ChevronRight size={16} color="var(--accent-blue)" />}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-glass)' }}>
            <p className="subtitle" style={{ fontSize: '0.7rem', marginBottom: 8 }}>QUICK ACTIONS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={handleTriggerWar} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>Trigger War</button>
              <button onClick={handleEndWar} style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>End War</button>
              <button style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-orange)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>Hold Election</button>
              <button style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}>Change GDP</button>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
