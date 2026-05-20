import { motion } from 'framer-motion';
import { SEASONS_DATA } from '../data/scenarios';

const SEASON_COLS = ['spring', 'summer', 'fall', 'winter'];
const SEASON_LABELS = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };

function RatingCell({ value }) {
  let bg, color, label;
  if (value === 1) { bg = 'rgba(34,197,94,0.2)'; color = '#22c55e'; label = '1'; }
  else if (value === 2) { bg = 'rgba(245,158,11,0.2)'; color = '#f59e0b'; label = '2'; }
  else { bg = 'rgba(239,68,68,0.2)'; color = '#ef4444'; label = '3'; }

  return (
    <td className="season-cell" style={{ background: bg, color }}>
      {label}
    </td>
  );
}

function SeasonTable({ title, rows }) {
  return (
    <div className="season-table-wrap">
      <div className="view-card-title">{title.toUpperCase()}</div>
      <table className="season-table">
        <thead>
          <tr>
            <th className="season-name-col"></th>
            {SEASON_COLS.map((s) => (
              <th key={s}>{SEASON_LABELS[s]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <td className="season-name">{row.name}</td>
              {SEASON_COLS.map((s) => (
                <RatingCell key={s} value={row[s]} />
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      <div className="season-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} /> 1 = Favourable</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> 2 = Neutral</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> 3 = Unfavourable</span>
      </div>
    </div>
  );
}

export default function SeasonsView() {
  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-label">MACRO SEASON SCORECARD</div>
      <p className="tab-subtitle">How each asset performs across macro seasons</p>

      <div className="seasons-grid">
        {Object.entries(SEASONS_DATA).map(([title, rows]) => (
          <SeasonTable key={title} title={title} rows={rows} />
        ))}
      </div>
    </motion.div>
  );
}
