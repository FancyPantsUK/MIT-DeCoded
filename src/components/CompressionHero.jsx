import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Lock, Shield, Zap, TrendingUp, TrendingDown, Eye, AlertTriangle, ChevronRight, Radio, Orbit } from 'lucide-react';
import CompressView from './CompressView';
import CompressionRitual from './CompressionRitual';
import ScenarioSelector from './ScenarioSelector';
import StreamingCompressionRead, { compressionToSections } from './StreamingCompressionRead';
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

/* ── Alpha Orb preview: full viewport frost over skeleton engine ── */
function AlphaOrbPreview({ activeScenario }) {
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const gmiCompression = COMPRESSION_DATA[activeScenario] || DEFAULT_COMPRESSION;
  const [ritualPhase, setRitualPhase] = useState('intake');
  const resolved = ritualPhase === 'resolved';

  return (
    <div className="alpha-compression-lock-shell">
      <div className="alpha-compression-blur">
        <div className="compress-view">
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
            <div className="compress-left">
              <div className="compress-card compress-card-supporting">
                <div className="compress-card-header"><Zap size={12} /><span>MACRO SEASON</span></div>
                <div className="compress-card-body">
                  <div className="season-display-compact">
                    <span className="season-icon-sm">{scenario.icon}</span>
                    <span className="season-name-sm">{scenario.label}</span>
                  </div>
                  <SkeletonLine width="90%" delay={0.05} />
                  <SkeletonLine width="70%" delay={0.1} />
                </div>
              </div>
              <div className="compress-card compress-card-supporting">
                <div className="compress-card-header"><ChevronRight size={12} /><span>SCENARIO READ</span></div>
                <div className="compress-card-body">
                  <SkeletonLine width="95%" />
                  <SkeletonLine width="80%" delay={0.05} />
                </div>
              </div>
              <div className="compress-card compress-card-supporting">
                <div className="compress-card-header"><TrendingUp size={12} /><span>FACTORS</span></div>
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

            <div className="compress-center">
              <CompressionRitual
                scenarioFactors={scenario.factors}
                convictionScore={gmiCompression.convictionScore}
                onPhaseChange={setRitualPhase}
              />
              <div className={`core-connector ${resolved ? 'active' : ''}`} />
            </div>

            <div className="compress-right">
              <div className="verdict-hero-card skeleton-verdict">
                <div className="verdict-hero-header"><Shield size={14} /><span>COMPRESSION VERDICT</span></div>
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
          </div>

          <div className="compress-bottom">
            {['TOP POSITIVE', 'TOP NEGATIVE', 'WATCHPOINTS', 'GMI DISAGREE'].map((title, i) => (
              <div key={title} className="bottom-card">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="alpha-compression-overlay">
        <motion.div
          className="alpha-lock-card electric-card electric-card-amber"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Lock size={22} className="alpha-lock-icon" />
          <div className="alpha-lock-title">PRO INTELLIGENCE LOCKED</div>
          <p className="alpha-lock-desc">
            Alpha gives you the dashboard data layer. Pro unlocks the compressed decision surface.
          </p>
          <div className="alpha-lock-features">
            <div className="alpha-lock-feature"><Shield size={10} /><span>Full Compression Verdict</span></div>
            <div className="alpha-lock-feature"><Eye size={10} /><span>My View vs GMI comparison</span></div>
            <div className="alpha-lock-feature"><TrendingUp size={10} /><span>Confirms / Invalidates</span></div>
            <div className="alpha-lock-feature"><Zap size={10} /><span>Action Bias + Best Expressions</span></div>
          </div>
          <div className="alpha-lock-cta">Use the tier switcher to preview Pro</div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Alpha Stream preview: frosted streaming skeleton ── */
function AlphaStreamPreview() {
  return (
    <div className="alpha-compression-lock-shell">
      <div className="alpha-compression-blur">
        <div className="stream-read-container">
          <div className="stream-read-header">
            <div className="stream-read-header-left">
              <Shield size={14} className="stream-read-header-icon" />
              <span className="stream-read-title">COMPRESSION READ</span>
            </div>
          </div>
          <div className="stream-read-body">
            <div className="stream-section">
              <div className="stream-section-label"><Shield size={12} /><span>BOTTOM LINE</span></div>
              <SkeletonLine width="100%" />
              <SkeletonLine width="85%" delay={0.05} />
              <SkeletonLine width="70%" delay={0.1} />
            </div>
            <div className="stream-section">
              <div className="stream-section-label"><TrendingUp size={12} /><span>WHAT CONFIRMS</span></div>
              <SkeletonLine width="90%" delay={0.15} />
              <SkeletonLine width="75%" delay={0.2} />
              <SkeletonLine width="60%" delay={0.25} />
            </div>
            <div className="stream-section">
              <div className="stream-section-label"><TrendingDown size={12} /><span>WHAT INVALIDATES</span></div>
              <SkeletonLine width="80%" delay={0.3} />
              <SkeletonLine width="65%" delay={0.35} />
            </div>
            <div className="stream-section">
              <div className="stream-section-label"><Zap size={12} /><span>BEST EXPRESSIONS</span></div>
              <SkeletonLine width="70%" delay={0.4} />
              <SkeletonLine width="55%" delay={0.45} />
            </div>
          </div>
          <div className="stream-read-status">
            <div className="stream-status-dot" />
            <span className="stream-status-text">Ready</span>
          </div>
        </div>
      </div>

      <div className="alpha-compression-overlay">
        <motion.div
          className="alpha-lock-card electric-card electric-card-amber"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Lock size={22} className="alpha-lock-icon" />
          <div className="alpha-lock-title">PRO STREAMING READ LOCKED</div>
          <p className="alpha-lock-desc">
            Alpha shows the data layer. Pro unlocks the streamed decision briefing.
          </p>
          <div className="alpha-lock-features">
            <div className="alpha-lock-feature"><Shield size={10} /><span>Full Compression Verdict</span></div>
            <div className="alpha-lock-feature"><Eye size={10} /><span>My View vs GMI comparison</span></div>
            <div className="alpha-lock-feature"><TrendingUp size={10} /><span>Confirms / Invalidates</span></div>
            <div className="alpha-lock-feature"><Zap size={10} /><span>Action Bias + Best Expressions</span></div>
          </div>
          <div className="alpha-lock-cta">Use the tier switcher to preview Pro</div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Pro Stream View: full streaming read ── */
function ProStreamView({ activeScenario }) {
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const gmiCompression = COMPRESSION_DATA[activeScenario] || DEFAULT_COMPRESSION;
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const sections = useMemo(
    () => compressionToSections(gmiCompression),
    [activeScenario] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="stream-view-shell">
      <div className="stream-view-context">
        <div className="stream-context-badge">
          <span className="stream-context-icon">{scenario.icon}</span>
          <span className="stream-context-label">{scenario.label}</span>
          <span className="stream-context-sub">{scenario.subLabel}</span>
        </div>
      </div>
      <StreamingCompressionRead
        sections={sections}
        title="COMPRESSION READ"
        subtitle={`${scenario.label} — GMI View`}
        convictionScore={gmiCompression.convictionScore}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

/* ── View toggle: Orb View | Stream View ── */
function ViewToggle({ heroView, onToggle }) {
  return (
    <div className="hero-view-toggle">
      <button
        className={`hero-view-btn ${heroView === 'orb' ? 'active' : ''}`}
        onClick={() => onToggle('orb')}
      >
        <Orbit size={12} />
        <span>Orb View</span>
      </button>
      <button
        className={`hero-view-btn ${heroView === 'stream' ? 'active' : ''}`}
        onClick={() => onToggle('stream')}
      >
        <Radio size={12} />
        <span>Stream View</span>
      </button>
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
  const [heroView, setHeroView] = useState('orb');

  return (
    <motion.div
      className="compression-hero-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero header — always visible */}
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

      {/* Scenario selector — always visible */}
      <ScenarioSelector
        activeScenario={activeScenario}
        onSelect={onSelectScenario}
      />

      {/* View toggle — always visible */}
      <ViewToggle heroView={heroView} onToggle={setHeroView} />

      {/* Main compression experience */}
      <AnimatePresence mode="wait">
        {heroView === 'orb' ? (
          <motion.div
            key="orb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
          >
            {isAlpha ? (
              <AlphaOrbPreview activeScenario={activeScenario} />
            ) : (
              <CompressView
                activeScenario={activeScenario}
                appliedUserFactors={appliedUserFactors}
                userTier={userTier}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="stream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
          >
            {isAlpha ? (
              <AlphaStreamPreview />
            ) : (
              <ProStreamView activeScenario={activeScenario} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
