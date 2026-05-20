import { motion } from 'framer-motion';
import TierBadge from './TierBadge';

export default function Header({ userTier }) {
  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-left">
        <h1 className="header-title">
          MIT <span className="header-title-accent">DeCoded</span>
        </h1>
        <p className="header-subtitle">
          MIT Macro Scenario Tool | Scenario Analysis Dashboard
        </p>
        <span className="header-badge">Brought to you by GMI</span>
      </div>
      <div className="header-right">
        <TierBadge tier={userTier} />
        <div className="rv-badge">RV</div>
      </div>
    </motion.header>
  );
}
