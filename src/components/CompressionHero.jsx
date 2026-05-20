import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Lock, Shield, Zap, TrendingUp, TrendingDown, Eye, AlertTriangle, ChevronRight } from 'lucide-react';
import CompressView from './CompressView';
import CompressionRitual from './CompressionRitual';
import ScenarioSelector from './ScenarioSelector';
import { canAccess } from '../utils/access';
import { SCENARIOS, FACTORS, COMPRESSION_DATA, DEFAULT_COMPRESSION } from '../data/scenarios';

/* ── Skeleton bars for redacted content ── */
function SkeletonLine({ width = '100%', delay = 0 }) {
  return (
    <motion.div
      className="skeleton-line"
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    />
  );
}

function SkeletonCard({ title, icon, delay = 0 }) {
  return (
    <motion.div
      className="compress-card skeleton-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="compress-card-header">
        {icon}
        <span>{title}</span>
      </div>
      <div className="compress-card-body">
        <SkeletonLine width="90%" delay={delay + 0.05} />
        <SkeletonLine width="75%" delay={delay + 0.1} />
        <SkeletonLine width="60%" delay={delay + 0.15} />
      </div>
    </motion.div>
  );
}

/* ── Alpha preview: shows engine + frosted verdict skeletons ── */
function AlphaPreview({ activeScenario, appliedUserFactors }) {
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const gmiCompression = COMPRESSION_DATA[activeScenario] || DEFAULT_COMPRESSION;
  const [ritualPhase, setRitualPhase] = useState('intake');
  const resolved = ritualPhase === 'resolved';

  return (
    <div className="compress-view alpha-preview-view">
      {/* Hero band — simplified for Alpha */}
      <div className="compress-hero">
        <div className="compress-hero-left">
          <div className="compress-hero-title">COMPRESS</div>
          <p className="compress-hero-sub">Compressing GMI Scenario</p>
        </div>
        <div className="compress-hero-right">
          <div className="compress-mode-toggle">
            <button className="mode-btn active">GMI View</button>
            <button className="mode-btn locked" disabled>
              My View <Lock size={10} className="mode-lock-icon" />
            </button>
            <button className="mode-btn locked" disabled>
              Compare <Lock size={10} className="mode-lock-icon" />
            </button>
          </div>
          <div className="compress-hero-stats">
            <div className="compress-hero-stat">
              <span className="compress-hero-stat-label">CONVICTION</span>
              <span className="compress-hero-stat-value">{gmiCompression.convictionScore}</span>
            </div>
            <div className={`compress-hero-status ${resolved ? 'resolved' : ''}`}>
              {resolved ? 'Resolved' : 'Processing...'}
            </div>
          </div>
        </div>
      </div>

      <div className="compress-grid">
        {/* Left Column — visible context */}
        <div className="compress-left">
          <div className="compress-card compress-card-supporting">
            <div className="compress-card-header">
              <Zap size={12} />
              <span>MACRO SEASON</span>
            </div>
            <div className="compress-card-body">
              <div className="season-display-compact">
                <span className="season-icon-sm">{scenario.icon}</span>
                <span className="season-name-sm">{scenario.label}</span>
              </div>
              <p className="scenario-desc">{scenario.description}</p>
            </div>
          </div>

          <div className="compress-card compress-card-supporting">
            <div className="compress-card-header">
              <ChevronRight size={12} />
              <span>SCENARIO READ</span>
            </div>
            <div className="compress-card-body">
              <SkeletonLine width="95%" />
              <SkeletonLine width="80%" delay={0.05} />
            </div>
          </div>

          <div className="compress-card compress-card-supporting">
            <div className="compress-card-header">
              <TrendingUp size={12} />
              <span>FACTORS</span>
            </div>
            <div className="compress-card-body">
              <div className="factor-summary-list">
                {FACTORS.map((f) => {
                  const val = scenario.factors[f.id] || 0;
                  const cls = val > 0 ? 'positive' : val < 0 ? 'negative' : 'neutral';
                  return (
                    <div key={f.id} className="factor-summary-row">
                      <span className="factor-summary-label">{f.label}</span>
                      <span className={`factor-summary-val ${cls}`}>
                        {val > 0 ? '+' : ''}{val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Centre Column — full visible orb */}
        <div className="compress-center">
          <CompressionRitual
            scenarioFactors={scenario.factors}
            convictionScore={gmiCompression.convictionScore}
            onPhaseChange={setRitualPhase}
          />
          <div className={`core-connector ${resolved ? 'active' : ''}`} />
        </div>

        {/* Right Column — frosted verdict skeletons */}
        <div className="compress-right alpha-frosted-column">
          <div className="pro-frost-lock-wrapper">
            {/* Skeleton verdict cards behind frost */}
            <div className="frosted-content">
              <div className="verdict-hero-card skeleton-verdict">
                <div className="verdict-hero-header">
                  <Shield size={14} />
                  <span>COMPRESSION VERDICT</span>
                </div>
                <div className="verdict-hero-body">
                  <SkeletonLine width="100%" />
                  <SkeletonLine width="85%" delay={0.05} />
                  <SkeletonLine width="70%" delay={0.1} />
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <div style={{ flex: 1 }}>
                      <SkeletonLine width="60%" delay={0.15} />
                      <SkeletonLine width="80%" delay={0.2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <SkeletonLine width="50%" delay={0.15} />
                      <SkeletonLine width="40%" delay={0.2} />
                    </div>
                  </div>
                </div>
              </div>

              <SkeletonCard title="WHAT CHANGED" icon={<TrendingUp size={12} />} delay={0.1} />
              <SkeletonCard title="WHAT CONFIRMS" icon={<TrendingUp size={12} />} delay={0.15} />
              <SkeletonCard title="BEST EXPRESSIONS" icon={<Zap size={12} />} delay={0.2} />
            </div>

            {/* Frosted glass overlay */}
            <div className="pro-frost-lock">
              <div className="pro-frost-lock-content electric-card electric-card-amber">
                <Lock size={20} className="pro-frost-lock-icon" />
                <div className="pro-frost-lock-title">Pro Intelligence Locked</div>
                <p className="pro-frost-lock-desc">
                  Upgrade to Pro to unlock the full compression engine.
                </p>
                <ul className="pro-frost-lock-features">
                  <li>Full Compression Verdict</li>
                  <li>What Confirms / Invalidates</li>
                  <li>My View vs GMI comparison</li>
                  <li>Decision surface and action bias</li>
                </ul>
                <div className="pro-frost-lock-cta">
                  Switch to Pro in the header tier selector
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom cards — skeleton */}
      <div className="compress-bottom alpha-bottom-frost">
        {['TOP POSITIVE', 'TOP NEGATIVE', 'WATCHPOINTS', 'GMI DISAGREE'].map((title, i) => (
          <motion.div
            key={title}
            className="bottom-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <div className="bottom-card-title">
              {i === 0 && <TrendingUp size={12} />}
              {i === 1 && <TrendingDown size={12} />}
              {i === 2 && <Eye size={12} />}
              {i === 3 && <AlertTriangle size={12} />}
              {title}
            </div>
            <div className="expression-tags">
              <span className="tag tag-skeleton" />
              <span className="tag tag-skeleton tag-skeleton-sm" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
        <AlphaPreview
          activeScenario={activeScenario}
          appliedUserFactors={appliedUserFactors}
        />
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
