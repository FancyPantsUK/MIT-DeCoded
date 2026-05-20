import { motion } from 'framer-motion';
import { DIVERGENCE_DATA } from '../data/scenarios';

export default function DivergenceView() {
  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-label">VIEW DIVERGENCE ANALYSIS</div>
      <p className="tab-subtitle">Where Your Views Disagree in Real-World Terms</p>

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
        {DIVERGENCE_DATA
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
