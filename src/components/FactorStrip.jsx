import { motion } from 'framer-motion';
import { FACTORS } from '../data/scenarios';

// Dynamic sublabels based on factor values
function getFactorSublabel(factorId, value) {
  const abs = Math.abs(value);
  if (abs === 0) return '\u2014';
  const map = {
    roro: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 2.1).toFixed(1)} RORO` : `${value > 0 ? '+' : ''}${(value * 1.5).toFixed(1)} RORO`,
    growth: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 3.1).toFixed(1)}pt ISM` : `${value > 0 ? '+' : ''}${(value * 1.8).toFixed(1)}pt ISM`,
    inflation: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 0.79).toFixed(2)}% CPI` : `${value > 0 ? '+' : ''}${(value * 0.4).toFixed(2)}% CPI`,
    rates: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 45).toFixed(0)}bp 2Y` : `${value > 0 ? '+' : ''}${(value * 25).toFixed(0)}bp 2Y`,
    liquidity: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 1.2).toFixed(1)}% TLI` : `${value > 0 ? '+' : ''}${(value * 0.8).toFixed(1)}% TLI`,
    usd: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 3.8).toFixed(1)}% DXY` : `${value > 0 ? '+' : ''}${(value * 1.5).toFixed(1)}% DXY`,
    oil: abs > 0.5 ? `${value > 0 ? '+' : ''}${(value * 12).toFixed(0)}% Brent` : `${value > 0 ? '+' : ''}${(value * 5).toFixed(0)}% Brent`,
  };
  return map[factorId] || '\u2014';
}

function FactorBar({ factor, value }) {
  const maxVal = 4;
  const pct = Math.min((Math.abs(value) / maxVal) * 100, 100);
  const isPositive = value >= 0;
  const isZero = value === 0;
  const displayVal = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  const knobPosition = 50 + (value / maxVal) * 50;
  const sublabel = getFactorSublabel(factor.id, value);

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
        {!isZero && (
          <motion.div
            className={`factor-bar-fill ${isPositive ? 'positive' : 'negative'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct / 2}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              [isPositive ? 'left' : 'right']: '50%',
            }}
          />
        )}
        <motion.div
          className="factor-knob"
          initial={{ left: '50%' }}
          animate={{ left: `${knobPosition}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className={`factor-value ${isPositive && !isZero ? 'positive' : ''} ${!isPositive && !isZero ? 'negative' : ''} ${isZero ? 'neutral' : ''}`}>
        {displayVal}
      </div>
      <div className="factor-sublabel">{sublabel}</div>
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
