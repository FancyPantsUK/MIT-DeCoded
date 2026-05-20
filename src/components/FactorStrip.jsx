import { motion } from 'framer-motion';
import { FACTORS } from '../data/scenarios';

function FactorBar({ factor, value }) {
  const maxVal = 4;
  const pct = (Math.abs(value) / maxVal) * 100;
  const isPositive = value >= 0;
  const displayVal = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

  return (
    <motion.div
      className="factor-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="factor-label">{factor.label}</div>
      <div className="factor-bar-track">
        <div className="factor-bar-center" />
        <motion.div
          className={`factor-bar-fill ${isPositive ? 'positive' : 'negative'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct / 2}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            [isPositive ? 'left' : 'right']: '50%',
            ...(isPositive ? {} : { transform: 'translateX(0)' }),
          }}
        />
      </div>
      <div className={`factor-value ${isPositive ? 'positive' : 'negative'}`}>
        {displayVal}
      </div>
      <div className="factor-sublabel">{factor.sublabel}</div>
    </motion.div>
  );
}

export default function FactorStrip({ scenarioFactors }) {
  return (
    <div className="factor-strip">
      <div className="section-label">FACTOR SENSITIVITY MATRIX</div>
      <div className="factor-grid">
        {FACTORS.map((f) => (
          <FactorBar key={f.id} factor={f} value={scenarioFactors[f.id] || 0} />
        ))}
      </div>
    </div>
  );
}
