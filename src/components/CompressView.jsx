import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, RefreshCw, Eye, GitCompare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CompressionRitual from './CompressionRitual';
import { SCENARIOS, FACTORS, COMPRESSION_DATA, DEFAULT_COMPRESSION } from '../data/scenarios';
import { compressFactors, compareCompressions } from '../utils/compressFactors';

const MODES = [
  { id: 'gmi', label: 'GMI View' },
  { id: 'myview', label: 'My View' },
  { id: 'compare', label: 'Compare' },
];

const MODE_STATUS = {
  gmi: 'Compressing GMI Scenario',
  myview: 'Compressing My View',
  compare: 'Comparing GMI vs My View',
};

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

function VerdictColumn({ compression, resolved }) {
  if (!resolved) {
    return (
      <div className="verdict-pending">
        <div className="verdict-pending-text">Awaiting compression...</div>
      </div>
    );
  }

  return (
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
            <CompressCard title="WHAT CHANGED" icon={<RefreshCw size={12} />}>
              <ul className="verdict-list changed">
                {compression.whatChanged.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CompressCard>
          </motion.div>

          <motion.div key="confirms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
            <CompressCard title="WHAT CONFIRMS" icon={<TrendingUp size={12} />}>
              <ul className="verdict-list confirms">
                {compression.confirms.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CompressCard>
          </motion.div>

          <motion.div key="invalidates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
            <CompressCard title="WHAT INVALIDATES" icon={<AlertTriangle size={12} />}>
              <ul className="verdict-list invalidates">
                {compression.invalidates.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CompressCard>
          </motion.div>

          <motion.div key="expressions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.18, duration: 0.3 }}>
            <CompressCard title="BEST EXPRESSIONS" icon={<Zap size={12} />}>
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
  );
}

function CompareColumn({ comparison, resolved }) {
  if (!resolved) {
    return (
      <div className="verdict-pending">
        <div className="verdict-pending-text">Awaiting comparison...</div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {resolved && (
        <>
          {/* Conclusion Card */}
          <motion.div key="conclusion" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="verdict-hero-card compare-hero-card">
              <div className="verdict-hero-header compare-header">
                <GitCompare size={14} />
                <span>COMPARISON VERDICT</span>
              </div>
              <div className="verdict-hero-body">
                <p className="verdict-bottom-line">{comparison.conclusion}</p>
                {comparison.biasChanged && (
                  <div className="compare-bias-shift">
                    <span className="compare-bias-label">BIAS SHIFT:</span>
                    <span className="compare-bias-from">{comparison.gmiActionBias}</span>
                    <span className="compare-bias-arrow">&rarr;</span>
                    <span className="compare-bias-to">{comparison.userActionBias}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bullish / Bearish Differences */}
          <motion.div key="diffs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
            <div className="compare-diffs-row">
              <CompressCard title="MORE BULLISH" icon={<ArrowUpRight size={12} />} className="compare-bullish-card">
                {comparison.moreBullish.length > 0 ? (
                  <ul className="verdict-list confirms">
                    {comparison.moreBullish.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                ) : (
                  <p className="compare-none">No bullish divergence</p>
                )}
              </CompressCard>
              <CompressCard title="MORE BEARISH" icon={<ArrowDownRight size={12} />} className="compare-bearish-card">
                {comparison.moreBearish.length > 0 ? (
                  <ul className="verdict-list invalidates">
                    {comparison.moreBearish.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                ) : (
                  <p className="compare-none">No bearish divergence</p>
                )}
              </CompressCard>
            </div>
          </motion.div>

          {/* Biggest Factor Gaps */}
          <motion.div key="gaps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
            <CompressCard title="BIGGEST FACTOR GAPS" icon={<TrendingUp size={12} />}>
              {comparison.biggestGaps.length > 0 ? (
                <div className="compare-gap-list">
                  {comparison.biggestGaps.map((g) => (
                    <div key={g.id} className="compare-gap-row">
                      <span className="compare-gap-label">{g.label}</span>
                      <span className={`gap-pill ${g.direction === 'bullish' ? 'positive' : g.direction === 'bearish' ? 'negative' : 'neutral'}`}>
                        {g.gap > 0 ? '+' : ''}{g.gap.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="compare-none">Factors are aligned</p>
              )}
            </CompressCard>
          </motion.div>

          {/* Expression Changes */}
          <motion.div key="expr-changes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
            <CompressCard title="EXPRESSION CHANGES" icon={<Zap size={12} />}>
              <div className="compare-expr-changes">
                {comparison.addedExpressions.length > 0 && (
                  <div className="compare-expr-group">
                    <span className="compare-expr-badge added">ADDED</span>
                    {comparison.addedExpressions.map((e, i) => (
                      <span key={i} className="tag tag-positive">{e.name}</span>
                    ))}
                  </div>
                )}
                {comparison.removedExpressions.length > 0 && (
                  <div className="compare-expr-group">
                    <span className="compare-expr-badge removed">REMOVED</span>
                    {comparison.removedExpressions.map((e, i) => (
                      <span key={i} className="tag tag-negative">{e.name}</span>
                    ))}
                  </div>
                )}
                {comparison.addedExpressions.length === 0 && comparison.removedExpressions.length === 0 && (
                  <p className="compare-none">Same expression set</p>
                )}
              </div>
            </CompressCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CompressView({ activeScenario, appliedUserFactors }) {
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const gmiCompression = COMPRESSION_DATA[activeScenario] || DEFAULT_COMPRESSION;
  const [ritualPhase, setRitualPhase] = useState('intake');
  const [compressMode, setCompressMode] = useState('gmi');

  const resolved = ritualPhase === 'resolved';

  const userFactors = appliedUserFactors || scenario.factors;

  const myViewCompression = useMemo(
    () => compressFactors(userFactors, scenario.label, 'My View'),
    [userFactors, scenario.label]
  );

  const comparison = useMemo(
    () => compareCompressions(scenario.factors, userFactors, scenario.label),
    [scenario.factors, userFactors, scenario.label]
  );

  const activeCompression = compressMode === 'gmi' ? gmiCompression : myViewCompression;
  const activeFactors = compressMode === 'gmi' ? scenario.factors : userFactors;

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
          <p className="compress-hero-sub">{MODE_STATUS[compressMode]}</p>
        </div>
        <div className="compress-hero-right">
          {/* Mode Toggle */}
          <div className="compress-mode-toggle">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`mode-btn ${compressMode === m.id ? 'active' : ''}`}
                onClick={() => setCompressMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="compress-hero-stats">
            <div className="compress-hero-stat">
              <span className="compress-hero-stat-label">CONVICTION</span>
              <span className="compress-hero-stat-value">
                {compressMode === 'compare' ? `${gmiCompression.convictionScore} / ${myViewCompression.convictionScore}` : activeCompression.convictionScore}
              </span>
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
              <span>{compressMode === 'gmi' ? 'SCENARIO READ' : compressMode === 'myview' ? 'MY VIEW READ' : 'GMI READ'}</span>
            </div>
            <div className="compress-card-body">
              <p className="scenario-read">{activeCompression.bottomLine}</p>
            </div>
          </div>

          <div className="compress-card compress-card-supporting">
            <div className="compress-card-header">
              <TrendingUp size={12} />
              <span>{compressMode === 'compare' ? 'FACTOR COMPARISON' : 'FACTORS'}</span>
            </div>
            <div className="compress-card-body">
              {compressMode === 'compare' ? (
                <div className="factor-compare-mini">
                  <div className="factor-compare-header-row">
                    <span className="fcm-col fcm-label"></span>
                    <span className="fcm-col">GMI</span>
                    <span className="fcm-col">MINE</span>
                    <span className="fcm-col">GAP</span>
                  </div>
                  {FACTORS.map((f) => {
                    const gmi = scenario.factors[f.id] || 0;
                    const user = userFactors[f.id] || 0;
                    const gap = user - gmi;
                    const gapCls = gap > 0.01 ? 'positive' : gap < -0.01 ? 'negative' : 'neutral';
                    return (
                      <div key={f.id} className="factor-compare-row">
                        <span className="fcm-col fcm-label">{f.label}</span>
                        <span className="fcm-col fcm-val">{gmi > 0 ? '+' : ''}{gmi.toFixed(2)}</span>
                        <span className="fcm-col fcm-val">{user > 0 ? '+' : ''}{user.toFixed(2)}</span>
                        <span className={`fcm-col fcm-gap ${gapCls}`}>
                          {gap > 0 ? '+' : ''}{gap.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="factor-summary-list">
                  {FACTORS.map((f) => {
                    const val = activeFactors[f.id] || 0;
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
              )}
            </div>
          </div>
        </div>

        {/* Centre Column — Compression Engine */}
        <div className="compress-center">
          <CompressionRitual
            key={compressMode}
            scenarioFactors={activeFactors}
            convictionScore={activeCompression.convictionScore}
            onPhaseChange={setRitualPhase}
          />
          <div className={`core-connector ${resolved ? 'active' : ''}`} />
        </div>

        {/* Right Column — Verdict or Compare */}
        <div className="compress-right">
          {compressMode === 'compare' ? (
            <CompareColumn comparison={comparison} resolved={resolved} />
          ) : (
            <VerdictColumn compression={activeCompression} resolved={resolved} />
          )}
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="compress-bottom">
        {compressMode === 'compare' ? (
          <>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <div className="bottom-card-title">
                <TrendingUp size={12} /> MORE BULLISH
              </div>
              <div className="expression-tags">
                {comparison.moreBullish.length > 0
                  ? comparison.moreBullish.map((t, i) => <span key={i} className="tag tag-positive">{t}</span>)
                  : <span className="tag tag-diverge">Aligned</span>
                }
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bottom-card-title">
                <TrendingDown size={12} /> MORE BEARISH
              </div>
              <div className="expression-tags">
                {comparison.moreBearish.length > 0
                  ? comparison.moreBearish.map((t, i) => <span key={i} className="tag tag-negative">{t}</span>)
                  : <span className="tag tag-diverge">Aligned</span>
                }
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <div className="bottom-card-title">
                <Zap size={12} /> ADDED EXPRESSIONS
              </div>
              <div className="expression-tags">
                {comparison.addedExpressions.length > 0
                  ? comparison.addedExpressions.map((e, i) => <span key={i} className="tag tag-positive">{e.name}</span>)
                  : <span className="tag tag-diverge">None</span>
                }
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="bottom-card-title">
                <AlertTriangle size={12} /> REMOVED EXPRESSIONS
              </div>
              <div className="expression-tags">
                {comparison.removedExpressions.length > 0
                  ? comparison.removedExpressions.map((e, i) => <span key={i} className="tag tag-negative">{e.name}</span>)
                  : <span className="tag tag-diverge">None</span>
                }
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <div className="bottom-card-title">
                <TrendingUp size={12} /> TOP POSITIVE
              </div>
              <div className="expression-tags">
                {activeCompression.topPositive.map((t, i) => (
                  <span key={i} className="tag tag-positive">{t}</span>
                ))}
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bottom-card-title">
                <TrendingDown size={12} /> TOP NEGATIVE
              </div>
              <div className="expression-tags">
                {activeCompression.topNegative.map((t, i) => (
                  <span key={i} className="tag tag-negative">{t}</span>
                ))}
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <div className="bottom-card-title">
                <Eye size={12} /> WATCHPOINTS
              </div>
              <div className="expression-tags">
                {activeCompression.watchpoints.map((w, i) => (
                  <span key={i} className="tag tag-diverge">{w}</span>
                ))}
              </div>
            </motion.div>
            <motion.div className="bottom-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="bottom-card-title">
                <AlertTriangle size={12} /> GMI DISAGREE
              </div>
              <div className="expression-tags">
                {activeCompression.gmiDisagree && activeCompression.gmiDisagree.length > 0
                  ? activeCompression.gmiDisagree.map((t, i) => <span key={i} className="tag tag-diverge">{t}</span>)
                  : <span className="tag tag-diverge">N/A</span>
                }
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
