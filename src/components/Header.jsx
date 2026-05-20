import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import TierBadge from './TierBadge';
import { TIER_LIST } from '../utils/access';

export default function Header({ userTier, onTierChange, viewMode, onExitExpert }) {
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
          <span className="header-version-badge">V2</span>
        </h1>
        {viewMode === 'expert' ? (
          <p className="header-subtitle">Expert Mode — Full Scenario Dashboard</p>
        ) : (
          <p className="header-subtitle">
            MIT Macro Scenario Tool | Scenario Analysis Dashboard
          </p>
        )}
        <span className="header-badge">Brought to you by GMI</span>
      </div>
      <div className="header-right">
        {viewMode === 'expert' && (
          <button className="exit-expert-btn electric-btn" onClick={onExitExpert}>
            <ArrowLeft size={13} />
            <span>Back to Compression</span>
          </button>
        )}
        <select
          className="tier-switcher"
          value={userTier}
          onChange={(e) => onTierChange(e.target.value)}
        >
          {TIER_LIST.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <TierBadge tier={userTier} />
        <div className="rv-badge">RV</div>
      </div>
    </motion.header>
  );
}
