import { motion } from 'framer-motion';
import { SCENARIOS } from '../data/scenarios';

export default function ScenarioSelector({ activeScenario, onSelect }) {
  return (
    <motion.div
      className="scenario-selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="section-label">MACRO SEASON SCORECARD</div>
      <div className="scenario-buttons">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`scenario-btn ${activeScenario === s.id ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <span className="scenario-icon">{s.icon}</span>
            <span className="scenario-label">{s.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
