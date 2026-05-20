import { motion } from 'framer-motion';
import { HEATMAP_DATA, FACTORS } from '../data/scenarios';

function HeatCell({ value }) {
  let bg, color;
  if (value > 0.5) { bg = 'rgba(34,197,94,0.25)'; color = '#22c55e'; }
  else if (value > 0) { bg = 'rgba(34,197,94,0.1)'; color = '#22c55e'; }
  else if (value < -0.5) { bg = 'rgba(239,68,68,0.25)'; color = '#ef4444'; }
  else if (value < 0) { bg = 'rgba(239,68,68,0.1)'; color = '#ef4444'; }
  else { bg = 'rgba(148,163,184,0.08)'; color = '#64748b'; }

  return (
    <td className="heat-cell" style={{ background: bg, color }}>
      {value > 0 ? '+' : ''}{value.toFixed(1)}
    </td>
  );
}

function HeatTable({ title, rows }) {
  return (
    <div className="heat-table-wrap">
      <div className="view-card-title">{title.toUpperCase()}</div>
      <table className="heat-table">
        <thead>
          <tr>
            <th className="heat-name-col"></th>
            {FACTORS.map((f) => (
              <th key={f.id}>{f.label}</th>
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
              <td className="heat-name">{row.name}</td>
              {FACTORS.map((f) => (
                <HeatCell key={f.id} value={row[f.id]} />
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HeatmapView() {
  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="section-label">FACTOR SENSITIVITY MATRIX</div>
      <p className="tab-subtitle">How each asset responds to factor changes</p>

      <div className="heatmap-grid">
        {Object.entries(HEATMAP_DATA).map(([title, rows]) => (
          <HeatTable key={title} title={title} rows={rows} />
        ))}
      </div>
    </motion.div>
  );
}
