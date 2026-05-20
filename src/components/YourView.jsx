import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { FACTORS } from '../data/scenarios';
import { computeImplicationComparison, computeFactorGaps } from '../utils/implications';

function FactorRow({ factor, gmiValue, userValue, gap, onDraftChange }) {
  const gmiCls = gmiValue > 0 ? 'positive' : gmiValue < 0 ? 'negative' : 'neutral';
  const userCls = userValue > 0 ? 'positive' : userValue < 0 ? 'negative' : 'neutral';
  const gapCls = gap > 0.01 ? 'positive' : gap < -0.01 ? 'negative' : 'neutral';

  return (
    <div className="yv-factor-row">
      <div className="yv-factor-info">
        <span className="yv-factor-label">{factor.label}</span>
        <span className="yv-factor-sublabel">{factor.sublabel}</span>
      </div>
      <div className={`yv-factor-gmi ${gmiCls}`}>
        {gmiValue > 0 ? '+' : ''}{gmiValue.toFixed(2)}
      </div>
      <div className="yv-factor-slider-cell">
        <input
          type="range"
          className="yv-slider"
          min={-4}
          max={4}
          step={0.25}
          value={userValue}
          onChange={(e) => onDraftChange(factor.id, parseFloat(e.target.value))}
        />
        <span className={`yv-slider-value ${userCls}`}>
          {userValue > 0 ? '+' : ''}{userValue.toFixed(2)}
        </span>
      </div>
      <div className={`yv-factor-gap ${gapCls}`}>
        <span className={`gap-pill ${gapCls}`}>
          {gap > 0 ? '+' : ''}{gap.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ImplicationRow({ item, index }) {
  return (
    <motion.div
      className="yv-impl-row"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <span className="yv-impl-label">{item.label}</span>
      <div className="yv-impl-values">
        <span className="yv-impl-gmi">{item.gmiValue}</span>
        <ArrowRight size={10} className="yv-impl-arrow" />
        <span className={`yv-impl-user ${item.direction}`}>{item.userValue}</span>
        <span className={`yv-impl-gap ${item.direction}`}>{item.gap}</span>
      </div>
      {item.sentence && (
        <span className={`yv-impl-sentence ${item.direction}`}>{item.sentence}</span>
      )}
    </motion.div>
  );
}

export default function YourView({ scenario, draftUserFactors, appliedUserFactors, onDraftChange, onApply, onReset }) {
  const [justApplied, setJustApplied] = useState(false);

  const gmiFactors = scenario.factors;
  const factorGaps = computeFactorGaps(gmiFactors, draftUserFactors);
  const implications = computeImplicationComparison(gmiFactors, appliedUserFactors);

  const hasChanges = FACTORS.some(
    (f) => Math.abs((draftUserFactors[f.id] || 0) - (gmiFactors[f.id] || 0)) > 0.01
  );
  const draftDiffersFromApplied = FACTORS.some(
    (f) => Math.abs((draftUserFactors[f.id] || 0) - (appliedUserFactors[f.id] || 0)) > 0.01
  );

  const handleApply = () => {
    onApply();
    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 1500);
  };

  return (
    <motion.div
      className="tab-view yv-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="yv-header">
        <div className="yv-header-left">
          <div className="section-label">YOUR MACRO VIEW</div>
          <p className="tab-subtitle">Adjust factors to express your view, then apply to see implications.</p>
        </div>
        <div className="yv-header-badge">
          <span className="yv-badge-icon">{scenario.icon}</span>
          <span className="yv-badge-label">{scenario.label}</span>
        </div>
      </div>

      {/* Factor Comparison Grid */}
      <div className="yv-grid-card">
        <div className="yv-grid-header-row">
          <span className="yv-grid-col yv-grid-col-name">FACTOR</span>
          <span className="yv-grid-col yv-grid-col-gmi">GMI</span>
          <span className="yv-grid-col yv-grid-col-slider">MY VIEW</span>
          <span className="yv-grid-col yv-grid-col-gap">GAP</span>
        </div>

        {FACTORS.map((f) => {
          const gapData = factorGaps.find((g) => g.id === f.id);
          return (
            <FactorRow
              key={f.id}
              factor={f}
              gmiValue={gmiFactors[f.id] || 0}
              userValue={draftUserFactors[f.id] || 0}
              gap={gapData ? gapData.gap : 0}
              onDraftChange={onDraftChange}
            />
          );
        })}

        {/* Action Bar */}
        <div className="yv-action-bar">
          <button
            className="yv-btn yv-btn-reset"
            onClick={onReset}
            disabled={!hasChanges}
          >
            <RotateCcw size={12} />
            Reset to GMI
          </button>
          <button
            className="yv-btn yv-btn-apply"
            onClick={handleApply}
            disabled={!draftDiffersFromApplied}
          >
            <Check size={12} />
            Apply My View
          </button>
          <AnimatePresence>
            {justApplied && (
              <motion.span
                className="yv-status-flash"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                Applied
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Implications */}
      <div className="yv-impl-section">
        <div className="yv-impl-title">
          <Sliders size={12} />
          <span>WHAT YOUR SCENARIO IMPLIES</span>
        </div>
        <div className="yv-impl-header-row">
          <span className="yv-impl-col-label">METRIC</span>
          <span className="yv-impl-col-values">GMI → YOURS → GAP</span>
        </div>
        {implications.map((item, i) => (
          <ImplicationRow key={item.label} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
