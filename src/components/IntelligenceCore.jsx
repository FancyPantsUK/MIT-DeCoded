import { motion } from 'framer-motion';

export default function IntelligenceCore({ convictionScore }) {
  return (
    <div className="intel-core-container">
      <motion.div
        className="intel-core"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="intel-ring ring-1" />
        <div className="intel-ring ring-2" />
        <div className="intel-ring ring-3" />
        <div className="intel-orb">
          <div className="intel-score">{convictionScore}</div>
          <div className="intel-score-label">CONVICTION</div>
        </div>
      </motion.div>
      <motion.p
        className="intel-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Compressing Julien's scenario data into decision intelligence
      </motion.p>
    </div>
  );
}
