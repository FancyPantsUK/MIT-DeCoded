import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { FACTORS } from '../data/scenarios';

const ThreeIntelligenceCore = lazy(() => import('./ThreeIntelligenceCore'));

const PHASES = {
  INTAKE: 'intake',
  COMPRESSING: 'compressing',
  RESOLVED: 'resolved',
};

const STATUS_LABELS = {
  [PHASES.INTAKE]: 'Reading scenario inputs',
  [PHASES.COMPRESSING]: 'Compressing factor structure',
  [PHASES.RESOLVED]: 'Decision surface resolved',
};

const PHASE_DURATIONS = {
  [PHASES.INTAKE]: 1800,
  [PHASES.COMPRESSING]: 2000,
};

function SignalChip({ factor, value, index, phase }) {
  const cls = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  const displayVal = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

  return (
    <motion.div
      className="signal-chip"
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 20, scale: 0.8 }}
      animate={
        phase === PHASES.INTAKE
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : phase === PHASES.COMPRESSING
            ? { opacity: 0, x: 0, y: -20, scale: 0.5 }
            : { opacity: 0, scale: 0 }
      }
      transition={{
        delay: phase === PHASES.INTAKE ? index * 0.15 : 0,
        duration: phase === PHASES.INTAKE ? 0.5 : 0.3,
        ease: 'easeOut',
      }}
    >
      <span className="signal-chip-label">{factor.label}</span>
      <span className={`signal-chip-value ${cls}`}>{displayVal}</span>
    </motion.div>
  );
}

function CompressionStatus({ phase }) {
  return (
    <motion.div
      className="compression-status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`status-indicator status-${phase}`} />
      <AnimatePresence mode="wait">
        <motion.span
          key={phase}
          className="status-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {STATUS_LABELS[phase]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

function CSSFallbackCore({ phase, convictionScore }) {
  return (
    <div className={`intel-core ${phase === PHASES.COMPRESSING ? 'core-compressing' : ''} ${phase === PHASES.RESOLVED ? 'core-resolved' : ''}`}>
      <div className="intel-ring ring-1" />
      <div className="intel-ring ring-2" />
      <div className="intel-ring ring-3" />
      <div className={`intel-orb ${phase === PHASES.COMPRESSING ? 'orb-compressing' : ''}`}>
        <AnimatePresence mode="wait">
          {phase === PHASES.RESOLVED ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ textAlign: 'center' }}
            >
              <div className="intel-score">{convictionScore}</div>
              <div className="intel-score-label">CONVICTION</div>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ textAlign: 'center' }}
            >
              <div className="intel-score-label" style={{ fontSize: '7px' }}>
                {phase === PHASES.INTAKE ? 'READING' : 'COMPRESSING'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CompressionRitual({ scenarioFactors, convictionScore, children, onPhaseChange }) {
  const [phase, setPhase] = useState(PHASES.INTAKE);
  const [ritualKey, setRitualKey] = useState(0);
  const [threeReady, setThreeReady] = useState(false);
  const [threeFailed, setThreeFailed] = useState(false);

  const runRitual = useCallback(() => {
    setPhase(PHASES.INTAKE);
    onPhaseChange?.(PHASES.INTAKE);

    const t1 = setTimeout(() => {
      setPhase(PHASES.COMPRESSING);
      onPhaseChange?.(PHASES.COMPRESSING);
    }, PHASE_DURATIONS[PHASES.INTAKE]);

    const t2 = setTimeout(() => {
      setPhase(PHASES.RESOLVED);
      onPhaseChange?.(PHASES.RESOLVED);
    }, PHASE_DURATIONS[PHASES.INTAKE] + PHASE_DURATIONS[PHASES.COMPRESSING]);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onPhaseChange]);

  useEffect(() => {
    const cleanup = runRitual();
    return cleanup;
  }, [ritualKey, runRitual]);

  // Check if reduced motion is preferred
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) setThreeFailed(true);
  }, []);

  const handleRecompress = () => {
    setRitualKey((k) => k + 1);
  };

  const showThree = !threeFailed;

  return (
    <div className="ritual-container">
      <div className="ritual-header">
        <div className="ritual-header-left">
          <div className="ritual-engine-label">DECISION COMPRESSION ENGINE</div>
          <CompressionStatus phase={phase} />
        </div>
        <button className="recompress-btn electric-btn" onClick={handleRecompress} title="Recompress">
          <RotateCcw size={13} />
          <span>Recompress</span>
        </button>
      </div>

      <div className="signal-chips-container">
        <AnimatePresence>
          {phase !== PHASES.RESOLVED && (
            <motion.div
              className="signal-chips"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {FACTORS.map((f, i) => (
                <SignalChip
                  key={`${ritualKey}-${f.id}`}
                  factor={f}
                  value={scenarioFactors[f.id] || 0}
                  index={i}
                  phase={phase}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ritual-core-area">
        <motion.div
          className="intel-core-container"
          animate={
            phase === PHASES.COMPRESSING
              ? { scale: [1, 1.08, 1.04, 1.1, 1] }
              : { scale: 1 }
          }
          transition={
            phase === PHASES.COMPRESSING
              ? { duration: 1.8, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        >
          {/* Three.js layer behind CSS core */}
          {showThree && (
            <Suspense fallback={null}>
              <ThreeIntelligenceCore
                factors={scenarioFactors}
                phase={phase}
                convictionScore={convictionScore}
              />
            </Suspense>
          )}

          {/* CSS core overlaid — shows score/status, also fallback if Three fails */}
          <CSSFallbackCore phase={phase} convictionScore={convictionScore} />

          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="intel-caption"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {phase === PHASES.INTAKE && "Reading Julien's scenario inputs\u2026"}
              {phase === PHASES.COMPRESSING && 'Resolving decision surface\u2026'}
              {phase === PHASES.RESOLVED && 'Scenario compressed into decision intelligence'}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === PHASES.RESOLVED && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
