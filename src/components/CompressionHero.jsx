import { motion } from 'framer-motion';
import { Layers, Lock } from 'lucide-react';
import CompressView from './CompressView';
import ScenarioSelector from './ScenarioSelector';
import { canAccess } from '../utils/access';

export default function CompressionHero({
  activeScenario,
  onSelectScenario,
  appliedUserFactors,
  userTier,
  onEnterExpert,
}) {
  const isAlpha = !canAccess(userTier, 'pro');

  return (
    <motion.div
      className="compression-hero-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero header */}
      <div className="hero-header-band">
        <div className="hero-header-left">
          <h2 className="hero-headline">
            MIT <span className="hero-headline-accent">DeCoded</span>
          </h2>
          <p className="hero-tagline">
            From Julien's MIT Macro Scenario Tool to decision intelligence.
          </p>
        </div>
        <div className="hero-header-right">
          <button className="expert-mode-btn electric-btn" onClick={onEnterExpert}>
            <Layers size={14} />
            <span>Enter Expert Mode</span>
          </button>
        </div>
      </div>

      {/* Compact scenario selector */}
      <ScenarioSelector
        activeScenario={activeScenario}
        onSelect={onSelectScenario}
      />

      {/* Main compression experience */}
      {isAlpha ? (
        <div className="hero-alpha-gate">
          <CompressView
            activeScenario={activeScenario}
            appliedUserFactors={appliedUserFactors}
            userTier={userTier}
          />
          {/* Alpha overlay — subtle lock message */}
          <motion.div
            className="hero-alpha-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="hero-alpha-lock-card electric-card electric-card-amber">
              <Lock size={18} className="hero-alpha-lock-icon" />
              <div className="hero-alpha-lock-text">
                <span className="hero-alpha-lock-title">Pro Intelligence</span>
                <span className="hero-alpha-lock-desc">
                  Upgrade to Pro to unlock full compression, My View, and Compare modes.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <CompressView
          activeScenario={activeScenario}
          appliedUserFactors={appliedUserFactors}
          userTier={userTier}
        />
      )}
    </motion.div>
  );
}
