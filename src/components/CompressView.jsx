import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, RefreshCw } from 'lucide-react';
import CompressionRitual from './CompressionRitual';
import { SCENARIOS, FACTORS, COMPRESSION_DATA, DEFAULT_COMPRESSION } from '../data/scenarios';

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
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

  const verdardDelay = (i) => (ritualPhase === 'resolved' ? i * 0.08 : 0);

  return (
    <motion.div
      className="compress-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="compress-header">
        <div className="section-label">COMPRESS</div>
        <p className="compress-subtitle">From Julien's scenario dashboard to decision intelligence.</p>
      </div>

      <div className="compress-grid">
        {/* Left Column */}
        <div className="compress-left">
          <CompressCard title="CURRENT MACRO SEASON" icon={<Zap size={14} />} delay={0}>
            <div className="season-display">
              <span className="season-icon">{scenario.icon}</span>
              <div>
                <span className="season-name">{scenario.label}</span>
                {scenario.subLabel && (
                  <span className="season-sublabel">{scenario.subLabel}</span>
                )}
              </div>
            </div>
            <p className="scenario-desc">{scenario.description}</p>
          </CompressCard>

          <CompressCard title="FACTOR SUMMARY" icon={<TrendingUp size={14} />} delay={1}>
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
          </CompressCard>

          <CompressCard title="SCENARIO READ" icon={<ChevronRight size={14} />} delay={2}>
            <p className="scenario-read">{compression.bottomLine}</p>
          </CompressCard>
        </div>

        {/* Centre Column — Compression Ritual */}
        <div className="compress-center">
          <CompressionRitual
            scenarioFactors={scenario.factors}
            convictionScore={compression.convictionScore}
            onPhaseChange={setRitualPhase}
          >
            {/* Verdict cards revealed after ritual resolves */}
            <div className="ritual-verdict-stack">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: verdardDelay(0), duration: 0.35 }}>
                <CompressCard title="COMPRESSION VERDICT" icon={<Shield size={14} />} delay={0} className="verdict-card">
                  <div className="verdict-section">
                    <div className="verdict-label">BOTTOM LINE</div>
                    <p>{compression.bottomLine}</p>
                  </div>
                  <div className="verdict-section">
                    <div className="verdict-label">ACTION BIAS</div>
                    <div className={`action-bias bias-${compression.actionBias.toLowerCase().replace(/\s+/g, '-')}`}>
                      {compression.actionBias}
                    </div>
                  </div>
                </CompressCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: verdardDelay(1), duration: 0.35 }}>
                <CompressCard title="WHAT CHANGED" icon={<RefreshCw size={14} />} delay={0}>
                  <ul className="verdict-list changed">
                    {compression.whatChanged.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </CompressCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: verdardDelay(2), duration: 0.35 }}>
                <CompressCard title="BEST EXPRESSIONS" icon={<Zap size={14} />} delay={0}>
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

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: verdardDelay(3), duration: 0.35 }}>
                <CompressCard title="WATCHPOINTS" icon={<AlertTriangle size={14} />} delay={0}>
                  <ul className="verdict-list watchpoints">
                    {compression.watchpoints.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </CompressCard>
              </motion.div>
            </div>
          </CompressionRitual>
        </div>

        {/* Right Column */}
        <div className="compress-right">
          <CompressCard title="WHAT CONFIRMS" icon={<TrendingUp size={14} />} delay={2}>
            <ul className="verdict-list confirms">
              {compression.confirms.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </CompressCard>

          <CompressCard title="WHAT INVALIDATES" icon={<AlertTriangle size={14} />} delay={3}>
            <ul className="verdict-list invalidates">
              {compression.invalidates.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </CompressCard>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="compress-bottom">
        <motion.div className="bottom-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="bottom-card-title">
            <TrendingUp size={14} /> TOP POSITIVE EXPRESSIONS
          </div>
          <div className="expression-tags">
            {compression.topPositive.map((t, i) => (
              <span key={i} className="tag tag-positive">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <div className="bottom-card-title">
            <TrendingDown size={14} /> TOP NEGATIVE EXPRESSIONS
          </div>
          <div className="expression-tags">
            {compression.topNegative.map((t, i) => (
              <span key={i} className="tag tag-negative">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <div className="bottom-card-title">
            <AlertTriangle size={14} /> WHERE YOU DISAGREE WITH GMI
          </div>
          <div className="expression-tags">
            {compression.gmiDisagree.map((t, i) => (
              <span key={i} className="tag tag-diverge">{t}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="bottom-card tier-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <div className="bottom-card-title">UPGRADE YOUR INTELLIGENCE</div>
          <div className="tier-compare">
            <div className="tier-col">
              <div className="tier-name alpha">ALPHA</div>
              <p className="tier-desc">Data layer</p>
              <ul>
                <li>Rankings</li>
                <li>Performance</li>
                <li>Heatmap</li>
                <li>Seasons</li>
              </ul>
            </div>
            <div className="tier-col">
              <div className="tier-name pro">PRO</div>
              <p className="tier-desc">Intelligence layer</p>
              <ul>
                <li>Everything in Alpha</li>
                <li>Your View</li>
                <li>Divergence</li>
                <li>Compress</li>
                <li>Ask Dashboard</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
