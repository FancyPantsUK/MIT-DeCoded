import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, GitCompare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  CANONICAL_SEASONS,
  computeSeasonMap,
  computeScenarioSeasonView,
  compareSeasonViews,
} from '../utils/scoreSeasons';

const SEASON_COLS = ['spring', 'summer', 'fall', 'winter'];
const SEASON_LABELS = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };

const MODES = [
  { id: 'map', label: 'Season Map' },
  { id: 'gmi', label: 'GMI View' },
  { id: 'myview', label: 'My View' },
  { id: 'compare', label: 'Compare' },
];

function RatingCell({ value }) {
  let bg, color;
  if (value === 1) { bg = 'rgba(34,197,94,0.2)'; color = '#22c55e'; }
  else if (value === 2) { bg = 'rgba(245,158,11,0.2)'; color = '#f59e0b'; }
  else { bg = 'rgba(239,68,68,0.2)'; color = '#ef4444'; }
  return (
    <td className="season-cell" style={{ background: bg, color }}>{value}</td>
  );
}

function SeasonMapTable({ group, index }) {
  return (
    <motion.div
      className="season-table-wrap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="view-card-title">{group.label.toUpperCase()}</div>
      <table className="season-table">
        <thead>
          <tr>
            <th className="season-name-col"></th>
            {SEASON_COLS.map((s) => <th key={s}>{SEASON_LABELS[s]}</th>)}
            <th>BEST</th>
            <th>WORST</th>
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row) => (
            <tr key={row.name}>
              <td className="season-name">{row.name}</td>
              {SEASON_COLS.map((s) => <RatingCell key={s} value={row.ratings[s]} />)}
              <td className="season-best">{row.bestSeason.icon} {row.bestSeason.label}</td>
              <td className="season-worst">{row.worstSeason.icon} {row.worstSeason.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="season-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} /> 1 = Favourable</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> 2 = Neutral</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> 3 = Unfavourable</span>
      </div>
    </motion.div>
  );
}

function dirCls(dir) {
  if (dir === 'Bullish') return 'bullish';
  if (dir === 'Positive') return 'positive';
  if (dir === 'Negative') return 'negative';
  if (dir === 'Bearish') return 'bearish';
  return 'neutral';
}

function ScenarioSeasonPanel({ view, scenarioLabel }) {
  return (
    <div className="ssn-panel">
      {/* Closest Season Hero */}
      <div className="ssn-closest">
        <div className="ssn-closest-icon">{view.closest.icon}</div>
        <div className="ssn-closest-info">
          <div className="ssn-closest-label">CLOSEST SEASON</div>
          <div className="ssn-closest-name">{view.closest.label}</div>
          <div className="ssn-closest-dist">Distance: {view.closest.distance.toFixed(2)}</div>
        </div>
      </div>

      {/* Distance Cards */}
      <div className="ssn-distance-strip">
        {view.distances.map((d, i) => (
          <div key={d.id} className={`ssn-dist-chip ${i === 0 ? 'closest' : ''}`}>
            <span className="ssn-dist-icon">{d.icon}</span>
            <span className="ssn-dist-label">{d.label}</span>
            <span className="ssn-dist-value">{d.distance.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Factor gaps vs closest season */}
      <div className="ssn-card">
        <div className="ssn-card-title">FACTOR DISTANCE TO {view.closest.label.toUpperCase()}</div>
        <div className="ssn-factor-list">
          {view.factorGaps.map((fg) => {
            const cls = Math.abs(fg.gap) < 0.1 ? 'neutral' : fg.gap > 0 ? 'positive' : 'negative';
            return (
              <div key={fg.id} className="ssn-factor-row">
                <span className="ssn-factor-label">{fg.label}</span>
                <span className="ssn-factor-active">{fg.active > 0 ? '+' : ''}{fg.active.toFixed(2)}</span>
                <span className="ssn-factor-season">{fg.season > 0 ? '+' : ''}{fg.season.toFixed(2)}</span>
                <span className={`gap-pill ${cls}`}>{fg.gap > 0 ? '+' : ''}{fg.gap.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top / Bottom Assets */}
      <div className="ssn-assets-row">
        <div className="ssn-card ssn-card-half">
          <div className="ssn-card-title top"><TrendingUp size={11} /> TOP FAVOURED</div>
          <div className="ssn-asset-list">
            {view.topAssets.map((a) => (
              <div key={a.name} className="ssn-asset-item">
                <span className="ssn-asset-name">{a.name}</span>
                <span className={`ssn-asset-dir ${dirCls(a.direction)}`}>{a.direction}</span>
                <span className="ssn-asset-score positive">{a.score > 0 ? '+' : ''}{a.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ssn-card ssn-card-half">
          <div className="ssn-card-title bottom"><TrendingDown size={11} /> LEAST FAVOURED</div>
          <div className="ssn-asset-list">
            {view.bottomAssets.map((a) => (
              <div key={a.name} className="ssn-asset-item">
                <span className="ssn-asset-name">{a.name}</span>
                <span className={`ssn-asset-dir ${dirCls(a.direction)}`}>{a.direction}</span>
                <span className="ssn-asset-score negative">{a.score > 0 ? '+' : ''}{a.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePanel({ comparison }) {
  return (
    <div className="ssn-compare">
      {/* Side-by-side closest season */}
      <div className="ssn-compare-hero-row">
        <div className="ssn-compare-hero">
          <div className="ssn-compare-hero-label">GMI CLOSEST</div>
          <div className="ssn-compare-hero-icon">{comparison.gmi.closest.icon}</div>
          <div className="ssn-compare-hero-name">{comparison.gmi.closest.label}</div>
          <div className="ssn-compare-hero-dist">{comparison.gmi.closest.distance.toFixed(2)}</div>
        </div>
        <div className="ssn-compare-vs">vs</div>
        <div className="ssn-compare-hero">
          <div className="ssn-compare-hero-label">MY VIEW CLOSEST</div>
          <div className="ssn-compare-hero-icon">{comparison.user.closest.icon}</div>
          <div className="ssn-compare-hero-name">{comparison.user.closest.label}</div>
          <div className="ssn-compare-hero-dist">{comparison.user.closest.distance.toFixed(2)}</div>
        </div>
      </div>

      <div className="ssn-compare-grid">
        {/* Season Shifts */}
        <div className="ssn-card">
          <div className="ssn-card-title">SEASON PROXIMITY SHIFT</div>
          <div className="ssn-shift-list">
            {comparison.seasonShifts.map((s) => {
              const cls = s.delta > 0.1 ? 'positive' : s.delta < -0.1 ? 'negative' : 'neutral';
              return (
                <div key={s.id} className="ssn-shift-row">
                  <span className="ssn-shift-icon">{s.icon}</span>
                  <span className="ssn-shift-label">{s.label}</span>
                  <span className={`gap-pill ${cls}`}>{s.delta > 0 ? '+' : ''}{s.delta.toFixed(2)}</span>
                  <span className="ssn-shift-hint">
                    {s.delta > 0.1 ? 'Closer' : s.delta < -0.1 ? 'Farther' : 'Same'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Factor Diffs */}
        <div className="ssn-card">
          <div className="ssn-card-title">BIGGEST FACTOR DIFFERENCES</div>
          <div className="ssn-factor-list">
            {comparison.factorDiffs.filter((f) => Math.abs(f.gap) > 0.01).slice(0, 5).map((f) => {
              const cls = f.gap > 0 ? 'positive' : 'negative';
              return (
                <div key={f.id} className="ssn-factor-row">
                  <span className="ssn-factor-label">{f.label}</span>
                  <span className={`gap-pill ${cls}`}>{f.gap > 0 ? '+' : ''}{f.gap.toFixed(2)}</span>
                </div>
              );
            })}
            {comparison.factorDiffs.every((f) => Math.abs(f.gap) <= 0.01) && (
              <p className="compare-none">Factors are aligned</p>
            )}
          </div>
        </div>

        {/* Biggest Asset Shifts */}
        <div className="ssn-card">
          <div className="ssn-card-title">BIGGEST ASSET SHIFTS</div>
          <div className="ssn-asset-list">
            {comparison.assetShifts.map((a) => {
              const cls = a.delta > 0 ? 'positive' : 'negative';
              return (
                <div key={a.name} className="ssn-asset-item">
                  <span className="ssn-asset-name">{a.name}</span>
                  <span className={`gap-pill ${cls}`}>{a.delta > 0 ? '+' : ''}{a.delta.toFixed(2)}</span>
                  {a.gmiDir !== a.userDir && (
                    <span className="dg-dir-change">
                      <span className={dirCls(a.gmiDir)}>{a.gmiDir}</span>
                      <span className="dg-dir-arrow">&rarr;</span>
                      <span className={dirCls(a.userDir)}>{a.userDir}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeasonsView({ scenario, appliedUserFactors }) {
  const [viewMode, setViewMode] = useState('map');

  const gmiFactors = scenario.factors;
  const userFactors = appliedUserFactors || gmiFactors;

  const seasonMap = useMemo(() => computeSeasonMap(), []);

  const gmiView = useMemo(
    () => computeScenarioSeasonView(gmiFactors, scenario.label),
    [gmiFactors, scenario.label]
  );

  const userView = useMemo(
    () => computeScenarioSeasonView(userFactors, 'My View'),
    [userFactors]
  );

  const comparison = useMemo(
    () => compareSeasonViews(gmiFactors, userFactors, scenario.label),
    [gmiFactors, userFactors, scenario.label]
  );

  const modeLabel = viewMode === 'map' ? 'Canonical Seasons'
    : viewMode === 'gmi' ? `${scenario.label} — GMI View`
    : viewMode === 'myview' ? `${scenario.label} — My View`
    : `${scenario.label} — GMI vs My View`;

  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dg-header">
        <div className="dg-header-left">
          <div className="section-label">MACRO SEASON SCORECARD</div>
          <p className="tab-subtitle">Season ratings generated from the factor sensitivity engine.</p>
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
        {viewMode === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="seasons-grid">
              {seasonMap.map((group, i) => (
                <SeasonMapTable key={group.label} group={group} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'gmi' && (
          <motion.div key="gmi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScenarioSeasonPanel view={gmiView} scenarioLabel={scenario.label} />
          </motion.div>
        )}

        {viewMode === 'myview' && (
          <motion.div key="myview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScenarioSeasonPanel view={userView} scenarioLabel="My View" />
          </motion.div>
        )}

        {viewMode === 'compare' && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ComparePanel comparison={comparison} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
