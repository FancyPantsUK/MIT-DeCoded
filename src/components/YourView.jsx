import { motion } from 'framer-motion';
import { YOUR_VIEW_DATA, FACTORS } from '../data/scenarios';

export default function YourView({ scenario }) {
  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-label">YOUR MACRO VIEW</div>
      <p className="tab-subtitle">What Your Scenario Implies</p>

      <div className="your-view-grid">
        <div className="view-card">
          <div className="view-card-title">SCENARIO ASSUMPTIONS</div>
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

        <div className="view-card view-card-wide">
          <div className="view-card-title">WHAT YOUR SCENARIO IMPLIES</div>
          <div className="implication-list">
            {YOUR_VIEW_DATA.implications.map((item) => (
              <div key={item.label} className="implication-row">
                <span className="implication-label">{item.label}</span>
                <span className={`implication-value ${item.direction}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
