import { motion } from 'framer-motion';
import { DIVERGENCE_DATA, FACTORS } from '../data/scenarios';
import { computeFactorGaps } from '../utils/implications';

export default function DivergenceView({ scenario, appliedUserFactors }) {
  const factorGaps = computeFactorGaps(scenario.factors, appliedUserFactors);
  const hasUserEdits = factorGaps.some((g) => Math.abs(g.gap) > 0.01);

  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-label">VIEW DIVERGENCE ANALYSIS</div>
      <p className="tab-subtitle">Where Your Views Disagree in Real-World Terms</p>

      {/* Factor-Level Comparison */}
      <div className="div-factor-section">
        <div className="div-factor-title">GMI vs MY VIEW — Factor Comparison</div>
        <div className="div-factor-grid">
          <div className="div-factor-header">
            <span className="div-fcol div-fcol-name">FACTOR</span>
            <span className="div-fcol">GMI</span>
            <span className="div-fcol">MINE</span>
            <span className="div-fcol">GAP</span>
          </div>
          {factorGaps.map((row, i) => {
            const gmiCls = row.gmi > 0 ? 'positive' : row.gmi < 0 ? 'negative' : 'neutral';
            const userCls = row.user > 0 ? 'positive' : row.user < 0 ? 'negative' : 'neutral';
            return (
              <motion.div
                key={row.id}
                className="div-factor-row"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="div-fcol div-fcol-name">
                  {row.label}
                  <span className="div-fcol-sub">{row.sublabel}</span>
                </span>
                <span className={`div-fcol div-fval ${gmiCls}`}>
                  {row.gmi > 0 ? '+' : ''}{row.gmi.toFixed(2)}
                </span>
                <span className={`div-fcol div-fval ${userCls}`}>
                  {row.user > 0 ? '+' : ''}{row.user.toFixed(2)}
                </span>
                <span className={`div-fcol div-fval`}>
                  <span className={`gap-pill ${row.direction}`}>
                    {row.gap > 0 ? '+' : ''}{row.gap.toFixed(2)}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
        {!hasUserEdits && (
          <div className="div-factor-hint">
            Adjust factors in Your View tab to see divergence here.
          </div>
        )}
      </div>

      {/* Asset-Level Divergence (static) */}
      <div className="section-label" style={{ marginTop: 20 }}>ASSET-LEVEL DIVERGENCE</div>
      <div className="divergence-card">
        <div className="divergence-header-row">
          <span className="div-col div-col-name">ASSET</span>
          <span className="div-col">GMI</span>
          <span className="div-col">YOURS</span>
          <span className="div-col">GAP</span>
        </div>
        {DIVERGENCE_DATA.map((row, i) => {
          const gapNum = parseFloat(row.gap);
          const gapCls = gapNum > 0 ? 'positive' : gapNum < 0 ? 'negative' : 'neutral';
          return (
            <motion.div
              key={row.name}
              className="divergence-row"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="div-col div-col-name">{row.name}</span>
              <span className="div-col div-val">{row.gmi}</span>
              <span className="div-col div-val">{row.yours}</span>
              <span className={`div-col div-val div-gap ${gapCls}`}>{row.gap}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>TOP 10 LARGEST DIFFERENCES</div>
      <div className="divergence-tags">
        {[...DIVERGENCE_DATA]
          .sort((a, b) => Math.abs(parseFloat(b.gap)) - Math.abs(parseFloat(a.gap)))
          .map((row) => {
            const gapNum = parseFloat(row.gap);
            const cls = gapNum > 0 ? 'tag-positive' : gapNum < 0 ? 'tag-negative' : 'tag-diverge';
            return (
              <span key={row.name} className={`tag ${cls}`}>
                {row.name}: {row.gap}
              </span>
            );
          })}
      </div>
    </motion.div>
  );
}
