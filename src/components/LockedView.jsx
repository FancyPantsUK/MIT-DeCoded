import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function LockedView({ tab }) {
  return (
    <motion.div
      className="locked-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Lock size={32} className="locked-icon" />
      <h3 className="locked-title">{tab.label}</h3>
      <p className="locked-desc">{tab.description}</p>
      <div className="locked-badge">PRO REQUIRED</div>
      <p className="locked-hint">Upgrade to Pro to unlock intelligence features</p>
    </motion.div>
  );
}
