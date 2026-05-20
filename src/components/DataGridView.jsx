import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, GitCompare } from 'lucide-react';
import { groupRankingsByCategory, rankAssetsByScenario, compareRankings } from '../utils/scoreAssets';

const MODES = [
  { id: 'gmi', label: 'GMI View' },
  { id: 'myview', label: 'My View' },
  { id: 'compare', label: 'Compare' },
];

function dirCls(direction) {
  switch (direction) {
    case 'Bullish': return 'bullish';
    case 'Positive': return 'positive';
    case 'Negative': return 'negative';
    case 'Bearish': return 'bearish';
    default: return 'neutral';
  }
}

function CategoryCard({ category, index, isPerformance }) {
  const maxScore = Math.max(...category.assets.map((a) => Math.abs(a.score)), 0.1);

  return (
    <motion.div
      className="category-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="category-title">{category.label}</div>
      <div className="asset-list">
        {category.assets.map((asset) => {
          const pct = (Math.abs(asset.score) / maxScore) * 100;
          const cls = asset.score > 0.05 ? 'positive' : asset.score < -0.05 ? 'negative' : 'neutral';
          return (
            <div key={asset.name} className="asset-row">
              <span className="asset-name">{asset.name}</span>
              <div className="asset-bar-track">
                <div className={`asset-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`asset-score ${cls}`}>
                {asset.score > 0 ? '+' : ''}{asset.score.toFixed(1)}
              </span>
              {isPerformance && (
                <span className={`asset-return ${cls}`}>
                  {asset.expectedReturn > 0 ? '+' : ''}{asset.expectedReturn.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
      {isPerformance && (
        <div className="category-drivers">
          {category.assets.slice(0, 2).map((a) => (
            <span key={a.name} className="driver-tag">
              {a.name}: {a.topDrivers.slice(0, 2).map((d) => d.label).join(', ')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CompareView({ comparison }) {
  return (
    <div className="dg-compare">
      <div className="dg-compare-row">
        {/* Upgrades */}
        <div className="dg-compare-card">
          <div className="dg-compare-title upgrades">
            <ArrowUpRight size={12} /> BIGGEST UPGRADES (My View vs GMI)
          </div>
          {comparison.upgrades.length > 0 ? (
            <div className="dg-compare-list">
              {comparison.upgrades.map((d) => (
                <div key={d.name} className="dg-compare-item">
                  <span className="dg-compare-name">{d.name}</span>
                  <span className="dg-compare-cat">{d.category}</span>
                  <span className="gap-pill positive">+{d.scoreDelta.toFixed(2)}</span>
                  {d.directionChanged && (
                    <span className="dg-dir-change">
                      <span className={dirCls(d.gmiDirection)}>{d.gmiDirection}</span>
                      <span className="dg-dir-arrow">&rarr;</span>
                      <span className={dirCls(d.userDirection)}>{d.userDirection}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="compare-none">No upgrades</p>
          )}
        </div>

        {/* Downgrades */}
        <div className="dg-compare-card">
          <div className="dg-compare-title downgrades">
            <ArrowDownRight size={12} /> BIGGEST DOWNGRADES (My View vs GMI)
          </div>
          {comparison.downgrades.length > 0 ? (
            <div className="dg-compare-list">
              {comparison.downgrades.map((d) => (
                <div key={d.name} className="dg-compare-item">
                  <span className="dg-compare-name">{d.name}</span>
                  <span className="dg-compare-cat">{d.category}</span>
                  <span className="gap-pill negative">{d.scoreDelta.toFixed(2)}</span>
                  {d.directionChanged && (
                    <span className="dg-dir-change">
                      <span className={dirCls(d.gmiDirection)}>{d.gmiDirection}</span>
                      <span className="dg-dir-arrow">&rarr;</span>
                      <span className={dirCls(d.userDirection)}>{d.userDirection}</span>
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

      {/* Direction Changes + Most Divergent Category */}
      <div className="dg-compare-row">
        <div className="dg-compare-card">
          <div className="dg-compare-title">
            <GitCompare size={12} /> DIRECTION CHANGES
          </div>
          {comparison.directionChanges.length > 0 ? (
            <div className="dg-compare-list">
              {comparison.directionChanges.slice(0, 8).map((d) => (
                <div key={d.name} className="dg-compare-item">
                  <span className="dg-compare-name">{d.name}</span>
                  <span className="dg-dir-change">
                    <span className={dirCls(d.gmiDirection)}>{d.gmiDirection}</span>
                    <span className="dg-dir-arrow">&rarr;</span>
                    <span className={dirCls(d.userDirection)}>{d.userDirection}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="compare-none">No direction changes</p>
          )}
        </div>

        <div className="dg-compare-card">
          <div className="dg-compare-title">
            <TrendingUp size={12} /> MOST DIVERGENT CATEGORIES
          </div>
          <div className="dg-compare-list">
            {comparison.catDivergence.slice(0, 4).map((c) => (
              <div key={c.category} className="dg-compare-item">
                <span className="dg-compare-name">{c.category}</span>
                <span className={`gap-pill ${c.avgGap > 0.3 ? 'positive' : 'neutral'}`}>
                  avg {c.avgGap.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataGridView({ activeTab, scenario, appliedUserFactors }) {
  const [viewMode, setViewMode] = useState('gmi');
  const isPerformance = activeTab === 'performance';

  const gmiFactors = scenario.factors;
  const userFactors = appliedUserFactors || gmiFactors;

  const activeFactors = viewMode === 'myview' ? userFactors : gmiFactors;

  const categories = useMemo(
    () => groupRankingsByCategory(activeFactors),
    [activeFactors]
  );

  const comparison = useMemo(
    () => viewMode === 'compare' ? compareRankings(gmiFactors, userFactors) : null,
    [viewMode, gmiFactors, userFactors]
  );

  const title = isPerformance ? 'SCENARIO PERFORMANCE' : 'FACTOR RANKINGS';
  const subtitle = isPerformance
    ? 'Expected returns by category under selected scenario'
    : 'Dynamic rankings driven by scenario factor sensitivities';

  const modeLabel = viewMode === 'gmi' ? `${scenario.label} — GMI View` : viewMode === 'myview' ? `${scenario.label} — My View` : `${scenario.label} — GMI vs My View`;

  return (
    <motion.div
      className="tab-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={`${activeTab}-${viewMode}`}
    >
      {/* Header with mode toggle */}
      <div className="dg-header">
        <div className="dg-header-left">
          <div className="section-label">{title}</div>
          <p className="tab-subtitle">{subtitle}</p>
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

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'compare' && comparison ? (
          <motion.div
            key="compare"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CompareView comparison={comparison} />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="category-grid">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.label} category={cat} index={i} isPerformance={isPerformance} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
