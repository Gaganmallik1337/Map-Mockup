import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ScenarioType } from '../App';
import { AlertTriangle, TrendingUp, DollarSign, Vote, Activity } from 'lucide-react';

interface Notification {
  id: number;
  text: string;
  type: 'war' | 'economy' | 'election' | 'social';
}

export default function LiveNotifications({ scenario }: { scenario: ScenarioType }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Generate random mock events
    const generateEvent = () => {
      const types: Notification['type'][] = ['war', 'economy', 'election', 'social'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let text = '';
      if (scenario === 'World War') {
        text = "⚔ Major offensive launched in Eastern Europe";
      } else if (scenario === 'India vs China Conflict') {
        text = "🔥 Border skirmish reported in Himalayas";
      } else if (type === 'war') {
        text = "⚔ Military mobilization detected in Sector 4";
      } else if (type === 'economy') {
        text = "📈 Tech stocks surge in Asian markets";
      } else if (type === 'election') {
        text = "🗳 Emergency session called in European Parliament";
      } else {
        text = "📰 Global protests escalate over climate policy";
      }

      const newEvent: Notification = {
        id: Date.now(),
        text,
        type: scenario === 'World War' ? 'war' : type
      };

      setNotifications(prev => [...prev.slice(-4), newEvent]);
    };

    const interval = setInterval(generateEvent, 3500);
    return () => clearInterval(interval);
  }, [scenario]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'war': return <AlertTriangle size={16} color="var(--accent-red)" />;
      case 'economy': return <TrendingUp size={16} color="var(--accent-green)" />;
      case 'election': return <Vote size={16} color="var(--accent-blue)" />;
      default: return <Activity size={16} color="var(--accent-orange)" />;
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 40, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="glass-panel"
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}
          >
            {getIcon(n.type)}
            <span style={{ fontSize: '0.875rem' }}>{n.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
