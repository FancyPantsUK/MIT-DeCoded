import { motion } from 'framer-motion';
import { Database, FileText, BarChart2, Grid, GitBranch } from 'lucide-react';

const ADAPTER_SLOTS = [
  { icon: FileText, label: 'MIT Research Notes', status: 'Planned' },
  { icon: BarChart2, label: 'Julien Scenario Dashboard', status: 'Planned' },
  { icon: Grid, label: 'GMI Scenario Presets', status: 'Planned' },
  { icon: Database, label: 'Factor Sensitivity Matrix', status: 'Mock Active' },
  { icon: GitBranch, label: 'Admin Model Versions', status: 'Planned' },
];

export default function DataSourceLayer() {
  return (
    <motion.div
      className="datasource-panel electric-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="datasource-header">
        <Database size={14} className="datasource-icon" />
        <span className="datasource-title">Data Source Layer</span>
      </div>

      <p className="datasource-desc">
        Current build uses mock sensitivity data. Next phase: connect MIT research, Julien dashboard exports, and official GMI scenario presets through a data adapter.
      </p>

      <div className="datasource-slots">
        {ADAPTER_SLOTS.map((slot, i) => (
          <motion.div
            key={slot.label}
            className="datasource-slot"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
          >
            <div className="datasource-slot-left">
              <slot.icon size={12} className="datasource-slot-icon" />
              <span className="datasource-slot-label">{slot.label}</span>
            </div>
            <span className={`datasource-slot-status ${slot.status === 'Mock Active' ? 'active' : ''}`}>
              {slot.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
