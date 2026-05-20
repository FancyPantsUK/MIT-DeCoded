import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, RefreshCw, Eye } from 'lucide-react';
import CompressionRitual from './CompressionRitual';
import { SCENARIOS, FACTORS, COMPRESSION_DATA, DEFAULT_COMPRESSION } from '../data/scenarios';

const card = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

function CompressCard({ title, icon, children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`compress-card ${className}`}
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={card}
    >
      <div className="compress-card-header">
        {icon}
        <span>{title}</span>
      </div>
      <div className="compress-card-body">{children}</div>
    </motion.div>
  );
}

export default function CompressView({ activeScenario }) {
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const compression = COMPRESSION_DATA[activeScenario] || DEFAULT_COMPRESSION;
  const [ritualPhase, setRitualPhase] = useState('intake');

  const resolved = ritualPhase === 'resolved';

  return (
    <motion.div
      className="compress-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Band */}
      <div className="compress-hero">
        <div className="compress-hero-left">
          <div className="compress-hero-title">COMPRESS</div>
          <p className="compress-hero-sub">From Julien's scenario dashboard to decision intelligence.</p>
        </div>
        <div className="compress-hero-right">
          <div className="compress-hero-scenario">
            <span className="compress-hero-icon">{scenario.icon}</span>
            <div>
              <span className="compress-hero-name">{scenario.label}</span>
              {scenario.subLabel && <span className="compress-hero-sublabel">{scenario.subLabel}</span>}
            </div>
          </div>
          <div className="compress-hero-stats">
            <div className="compress-hero-stat">
              <span className="compress-hero-stat-label">CONVICTION</span>
              <span className="compress-hero-stat-value">{compression.convictionScore}</span>
            </div>
            <div className={`compress-hero-status ${resolved ? 'resolved' : ''}`}>
              {resolved ? 'Resolved' : 'Processing...'}
            </div>
          </div>
        </div>
      </div>

      <div className="compress-grid">
        {/* Left Column — Supporting evidence */}
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
              <p className="scenario-read">{compression.bottomLine}</p>
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

        {/* Centre Column — Compression Engine */}
        <div className="compress-center">
          <CompressionRitual
            scenarioFactors={scenario.factors}
            convictionScore={compression.convictionScore}
            onPhaseChange={setRitualPhase}
          />
          {/* Connector glow toward verdict */}
          <div className={`core-connector ${resolved ? 'active' : ''}`} />
        </div>

        {/* Right Column — Verdict (hero card) */}
        <div className="compress-right">
          <AnimatePresence>
            {resolved && (
              <>
                <motion.div key="verdict" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <div className="verdict-hero-card">
                    <div className="verdict-hero-header">
                      <Shield size={14} />
                      <span>COMPRESSION VERDICT</span>
                    </div>
                    <div className="verdict-hero-body">
                      <div className="verdict-section">
                        <div className="verdict-label">BOTTOM LINE</div>
                        <p className="verdict-bottom-line">{compression.bottomLine}</p>
                      </div>
                      <div className="verdict-meta-row">
                        <div className="verdict-meta-item">
                          <div className="verdict-label">ACTION BIAS</div>
                          <div className={`action-bias action-bias-lg bias-${compression.actionBias.toLowerCase().replace(/\s+/g, '-')}`}>
                            {compression.actionBias}
                          </div>
                        </div>
                        <div className="verdict-meta-item">
                          <div className="verdict-label">CONFIDENCE</div>
                          <div className="verdict-confidence">{compression.convictionScore}<span className="verdict-confidence-unit">/100</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div key="changed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
                  <CompressCard title="WHAT CHANGED" icon={<RefreshCw size={12} />} delay={0}>
                    <ul className="verdict-list changed">
                      {compression.whatChanged.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </CompressCard>
                </motion.div>

                <motion.div key="confirms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
                  <CompressCard title="WHAT CONFIRMS" icon={<TrendingUp size={12} />} delay={0}>
                    <ul className="verdict-list confirms">
                      {compression.confirms.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </CompressCard>
                </motion.div>

                <motion.div key="invalidates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
                  <CompressCard title="WHAT INVALIDATES" icon={<AlertTriangle size={12} />} delay={0}>
                    <ul className="verdict-list invalidates">
                      {compression.invalidates.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </CompressCard>
                </motion.div>

                <motion.div key="expressions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.18, duration: 0.3 }}>
                  <CompressCard title="BEST EXPRESSIONS" icon={<Zap size={12} />} delay={0}>
                    <div className="expressions-list">
                      {compression.bestExpressions.map((e, i) => (
                        <div key={i} className="expression-row">
                          <span>{e.name}</span>
                          <span className={`conviction conviction-${e.conviction.toLowerCase()}`}>
                            {e.conviction}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CompressCard>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {!resolved && (
            <div className="verdict-pending">
              <div className="verdict-pending-text">Awaiting compression...</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="compress-bottom">
        <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="bottom-card-title">
            <TrendingUp size={12} /> TOP POSITIVE
          </div>
          <div className="expression-tags">
            {compression.topPositive.map((t, i) => (
              <span key={i} className="tag tag-positive">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bottom-card-title">
            <TrendingDown size={12} /> TOP NEGATIVE
          </div>
          <div className="expression-tags">
            {compression.topNegative.map((t, i) => (
              <span key={i} className="tag tag-negative">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="bottom-card-title">
            <Eye size={12} /> WATCHPOINTS
          </div>
          <div className="expression-tags">
            {compression.watchpoints.map((w, i) => (
              <span key={i} className="tag tag-diverge">{w}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="bottom-card-title">
            <AlertTriangle size={12} /> GMI DISAGREE
          </div>
          <div className="expression-tags">
            {compression.gmiDisagree.map((t, i) => (
              <span key={i} className="tag tag-diverge">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
