import { motion } from 'framer-motion';
import { Settings, Upload, Edit3, GitBranch, FileText, RotateCcw } from 'lucide-react';

const ADMIN_FEATURES = [
  { icon: Edit3, label: 'Edit Sensitivity Matrix', status: 'Coming Soon' },
  { icon: Upload, label: 'Publish Official Model', status: 'Coming Soon' },
  { icon: Settings, label: 'Edit Scenario Presets', status: 'Coming Soon' },
  { icon: FileText, label: 'Model Version Notes', status: 'Coming Soon' },
  { icon: RotateCcw, label: 'Rollback Model Version', status: 'Coming Soon' },
];

export default function AdminControlPanel() {
  return (
    <motion.div
      className="admin-panel electric-card electric-card-red"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="admin-header">
        <div className="admin-header-left">
          <GitBranch size={14} className="admin-icon" />
          <span className="admin-title">Admin Control Panel</span>
        </div>
        <div className="admin-version-badge">v0.1-alpha</div>
      </div>

      <p className="admin-desc">
        Model governance controls for the official GMI scenario engine.
      </p>

      <div className="admin-features">
        {ADMIN_FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            className="admin-feature-row"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
          >
            <div className="admin-feature-left">
              <f.icon size={13} className="admin-feature-icon" />
              <span className="admin-feature-label">{f.label}</span>
            </div>
            <span className="admin-feature-status">{f.status}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
