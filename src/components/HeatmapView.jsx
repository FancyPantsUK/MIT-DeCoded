import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, GitCompare } from 'lucide-react';
import { FACTORS } from '../data/scenarios';
import { ASSET_SENSITIVITIES, CATEGORY_ORDER } from '../data/factorSensitivities';

const MODES = [
  { id: 'gmi', label: 'GMI View' },
  { id: 'myview', label: 'My View' },
  { id: 'compare', label: 'Compare' },
];

function computeContributions(factors) {
  return ASSET_SENSITIVITIES.map((asset) => {
    const contribs = {};
    let total = 0;
    let strongest = { id: null, val: 0 };
    let weakest = { id: null, val: 0 };

    for (const f of FACTORS) {
      const c = (asset.sensitivities[f.id] || 0) * (factors[f.id] || 0);
      contribs[f.id] = c;
      total += c;
      if (c > strongest.val) strongest = { id: f.id, val: c };
      if (c < weakest.val) weakest = { id: f.id, val: c };
    }

    let direction;
    if (total > 0.75) direction = 'Bullish';
    else if (total > 0.25) direction = 'Positive';
    else if (total > -0.25) direction = 'Neutral';
    else if (total > -0.75) direction = 'Negative';
    else direction = 'Bearish';

    return { name: asset.name, category: asset.category, contribs, total, direction, strongest: strongest.id, weakest: weakest.id };
  });
}

function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return CATEGORY_ORDER.filter((c) => groups[c]).map((c) => ({ label: c, rows: groups[c] }));
}

function cellStyle(value) {
  if (value > 0.4) return { background: 'rgba(34,197,94,0.28)', color: '#22c55e' };
  if (value > 0.15) return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' };
  if (value > 0.02) return { background: 'rgba(34,197,94,0.05)', color: 'rgba(34,197,94,0.7)' };
  if (value < -0.4) return { background: 'rgba(239,68,68,0.28)', color: '#ef4444' };
  if (value < -0.15) return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' };
  if (value < -0.02) return { background: 'rgba(239,68,68,0.05)', color: 'rgba(239,68,68,0.7)' };
  return { background: 'rgba(148,163,184,0.05)', color: '#475569' };
}

function totalStyle(value) {
  if (value > 1.0) return { background: 'rgba(34,197,94,0.2)', color: '#22c55e' };
  if (value > 0.3) return { background: 'rgba(34,197,94,0.08)', color: '#22c55e' };
  if (value < -1.0) return { background: 'rgba(239,68,68,0.2)', color: '#ef4444' };
  if (value < -0.3) return { background: 'rgba(239,68,68,0.08)', color: '#ef4444' };
  return { background: 'rgba(148,163,184,0.05)', color: '#64748b' };
}

function dirCls(dir) {
  if (dir === 'Bullish') return 'bullish';
  if (dir === 'Positive') return 'positive';
  if (dir === 'Negative') return 'negative';
  if (dir === 'Bearish') return 'bearish';
  return 'neutral';
}

function HeatTable({ group, index }) {
  return (
    <motion.div
      className="heat-table-wrap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="view-card-title">{group.label.toUpperCase()}</div>
      <table className="heat-table">
        <thead>
          <tr>
            <th className="heat-name-col"></th>
            {FACTORS.map((f) => <th key={f.id}>{f.label}</th>)}
            <th className="heat-total-col">TOTAL</th>
            <th className="heat-dir-col">DIR</th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row) => (
            <tr key={row.name}>
              <td className="heat-name">{row.name}</td>
              {FACTORS.map((f) => (
                <td key={f.id} className="heat-cell" style={cellStyle(row.contribs[f.id])}>
                  {row.contribs[f.id] > 0 ? '+' : ''}{row.contribs[f.id].toFixed(2)}
                </td>
              ))}
              <td className="heat-cell heat-total" style={totalStyle(row.total)}>
                {row.total > 0 ? '+' : ''}{row.total.toFixed(2)}
              </td>
              <td className={`heat-cell heat-dir ${dirCls(row.direction)}`}>
                {row.direction}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function CompareHeatmap({ gmiFactors, userFactors }) {
  const gmiItems = computeContributions(gmiFactors);
  const userItems = computeContributions(userFactors);

  const diffs = gmiItems.map((gmi, i) => {
    const user = userItems[i];
    const totalDelta = user.total - gmi.total;
    const factorDeltas = {};
    for (const f of FACTORS) {
      factorDeltas[f.id] = user.contribs[f.id] - gmi.contribs[f.id];
    }
    return { name: gmi.name, category: gmi.category, totalDelta, factorDeltas, gmiDir: gmi.direction, userDir: user.direction, dirChanged: gmi.direction !== user.direction };
  });

  // Factor gap strip
  const factorGaps = FACTORS.map((f) => ({
    id: f.id,
    label: f.label,
    gap: (userFactors[f.id] || 0) - (gmiFactors[f.id] || 0),
  }));

  // Top upgraded/downgraded
  const sorted = [...diffs].sort((a, b) => b.totalDelta - a.totalDelta);
  const upgraded = sorted.filter((d) => d.totalDelta > 0.05).slice(0, 8);
  const downgraded = [...sorted].reverse().filter((d) => d.totalDelta < -0.05).slice(0, 8);

  // Category impact
  const catImpact = {};
  for (const d of diffs) {
    if (!catImpact[d.category]) catImpact[d.category] = [];
    catImpact[d.category].push(d.totalDelta);
  }
  const catShifts = Object.entries(catImpact)
    .map(([cat, deltas]) => ({ category: cat, avgDelta: deltas.reduce((s, v) => s + v, 0) / deltas.length }))
    .sort((a, b) => b.avgDelta - a.avgDelta);

  return (
    <div className="hm-compare">
      {/* Factor Gap Strip */}
      <div className="hm-gap-strip">
        <div className="hm-gap-strip-title">FACTOR GAP: My View vs GMI</div>
        <div className="hm-gap-chips">
          {factorGaps.map((fg) => {
            const cls = fg.gap > 0.01 ? 'positive' : fg.gap < -0.01 ? 'negative' : 'neutral';
            return (
              <div key={fg.id} className={`hm-gap-chip ${cls}`}>
                <span className="hm-gap-chip-label">{fg.label}</span>
                <span className="hm-gap-chip-value">{fg.gap > 0 ? '+' : ''}{fg.gap.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hm-compare-grid">
        {/* Category Impact Shift */}
        <div className="hm-compare-card">
          <div className="hm-compare-card-title">CATEGORY IMPACT SHIFT</div>
          <div className="hm-compare-list">
            {catShifts.map((c) => {
              const cls = c.avgDelta > 0.05 ? 'positive' : c.avgDelta < -0.05 ? 'negative' : 'neutral';
              return (
                <div key={c.category} className="hm-compare-item">
                  <span className="hm-compare-name">{c.category}</span>
                  <span className={`gap-pill ${cls}`}>{c.avgDelta > 0 ? '+' : ''}{c.avgDelta.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Upgraded */}
        <div className="hm-compare-card">
          <div className="hm-compare-card-title upgraded"><ArrowUpRight size={12} /> TOP UPGRADED ASSETS</div>
          {upgraded.length > 0 ? (
            <div className="hm-compare-list">
              {upgraded.map((d) => (
                <div key={d.name} className="hm-compare-item">
                  <span className="hm-compare-name">{d.name}</span>
                  <span className="hm-compare-cat">{d.category}</span>
                  <span className="gap-pill positive">+{d.totalDelta.toFixed(2)}</span>
                  {d.dirChanged && (
                    <span className="dg-dir-change">
                      <span className={dirCls(d.gmiDir)}>{d.gmiDir}</span>
                      <span className="dg-dir-arrow">&rarr;</span>
                      <span className={dirCls(d.userDir)}>{d.userDir}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="compare-none">No upgrades</p>
          )}
        </div>

        {/* Top Downgraded */}
        <div className="hm-compare-card">
          <div className="hm-compare-card-title downgraded"><ArrowDownRight size={12} /> TOP DOWNGRADED ASSETS</div>
          {downgraded.length > 0 ? (
            <div className="hm-compare-list">
              {downgraded.map((d) => (
                <div key={d.name} className="hm-compare-item">
                  <span className="hm-compare-name">{d.name}</span>
                  <span className="hm-compare-cat">{d.category}</span>
                  <span className="gap-pill negative">{d.totalDelta.toFixed(2)}</span>
                  {d.dirChanged && (
                    <span className="dg-dir-change">
                      <span className={dirCls(d.gmiDir)}>{d.gmiDir}</span>
                      <span className="dg-dir-arrow">&rarr;</span>
                      <span className={dirCls(d.userDir)}>{d.userDir}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="compare-none">No downgrades</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeatmapView({ scenario, appliedUserFactors }) {
  const [viewMode, setViewMode] = useState('gmi');

  const gmiFactors = scenario.factors;
  const userFactors = appliedUserFactors || gmiFactors;
  const activeFactors = viewMode === 'myview' ? userFactors : gmiFactors;

  const groups = useMemo(() => {
    const items = computeContributions(activeFactors);
    return groupByCategory(items);
  }, [activeFactors]);

  const modeLabel = viewMode === 'gmi' ? `${scenario.label} — GMI View` : viewMode === 'myview' ? `${scenario.label} — My View` : `${scenario.label} — GMI vs My View`;

  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dg-header">
        <div className="dg-header-left">
          <div className="section-label">FACTOR SENSITIVITY MATRIX</div>
          <p className="tab-subtitle">Factor contribution by asset/category under the active scenario.</p>
        </div>
        <div className="dg-header-right">
          <div className="compress-mode-toggle">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`mode-btn ${viewMode === m.id ? 'active' : ''}`}
                onClick={() => setViewMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <span className="dg-mode-label">{modeLabel}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'compare' ? (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <CompareHeatmap gmiFactors={gmiFactors} userFactors={userFactors} />
          </motion.div>
        ) : (
          <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="heatmap-grid">
              {groups.map((group, i) => (
                <HeatTable key={group.label} group={group} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
