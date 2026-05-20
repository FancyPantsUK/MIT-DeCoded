import { motion } from 'framer-motion';
import { Sliders, Lock, RotateCcw, ChevronDown } from 'lucide-react';

const MOCK_ASSETS = ['Bitcoin', 'S&P 500', 'Gold', 'US 10Y', 'DXY'];
const MOCK_FACTORS = ['RORO', 'Growth', 'Inflation', 'Rates', 'Liquidity', 'USD', 'Oil'];

export default function SensitivitySandbox() {
  return (
    <motion.div
      className="sandbox-panel electric-card electric-card-purple"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="sandbox-header">
        <div className="sandbox-header-left">
          <Sliders size={14} className="sandbox-icon" />
          <span className="sandbox-title">Sensitivity Sandbox</span>
        </div>
        <div className="sandbox-status-badge">COMING NEXT</div>
      </div>

      <p className="sandbox-desc">
        Temporarily override model assumptions without changing the official GMI matrix.
      </p>

      <div className="sandbox-controls">
        <div className="sandbox-control disabled">
          <label className="sandbox-label">Select Asset</label>
          <div className="sandbox-select">
            <span>Bitcoin</span>
            <ChevronDown size={12} />
          </div>
        </div>

        <div className="sandbox-control disabled">
          <label className="sandbox-label">Select Factor</label>
          <div className="sandbox-select">
            <span>Liquidity</span>
            <ChevronDown size={12} />
          </div>
        </div>

        <div className="sandbox-control disabled">
          <label className="sandbox-label">Override Sensitivity</label>
          <div className="sandbox-slider-mock">
            <div className="sandbox-slider-track">
              <div className="sandbox-slider-fill" style={{ width: '65%' }} />
              <div className="sandbox-slider-thumb" style={{ left: '65%' }} />
            </div>
            <span className="sandbox-slider-value">0.85</span>
          </div>
        </div>

        <button className="sandbox-reset disabled" disabled>
          <RotateCcw size={11} />
          <span>Reset Overrides</span>
        </button>
      </div>

      <div className="sandbox-lock-overlay">
        <Lock size={16} />
        <span>Sandbox editing activates next release</span>
      </div>
    </motion.div>
  );
}
