import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/scenarios';

function CategoryCard({ category, index }) {
  const maxScore = Math.max(...category.assets.map((a) => Math.abs(a.score)));

  return (
    <motion.div
      className="category-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="category-title">{category.label}</div>
      <div className="asset-list">
        {category.assets.map((asset) => {
          const pct = (Math.abs(asset.score) / (maxScore || 1)) * 100;
          const cls = asset.score > 0 ? 'positive' : asset.score < 0 ? 'negative' : 'neutral';
          return (
            <div key={asset.name} className="asset-row">
              <span className="asset-name">{asset.name}</span>
              <div className="asset-bar-track">
                <div
                  className={`asset-bar-fill ${cls}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`asset-score ${cls}`}>
                {asset.score > 0 ? '+' : ''}{asset.score.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function DataGridView({ activeTab }) {
  return (
    <motion.div
      className="data-grid-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={activeTab}
    >
      <div className="section-label">GMI FACTOR RANKINGS — {activeTab.toUpperCase()}</div>
      <div className="category-grid">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
