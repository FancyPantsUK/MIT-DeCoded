import { ASSET_SENSITIVITIES, CATEGORY_ORDER } from '../data/factorSensitivities';

const FACTOR_LABELS = {
  roro: 'RORO',
  growth: 'Growth',
  inflation: 'Inflation',
  rates: 'Rates',
  liquidity: 'Liquidity',
  usd: 'USD',
  oil: 'Oil',
};

/**
 * Score a single asset against factor values.
 */
export function scoreAsset(asset, factors) {
  let score = 0;
  const contributions = [];

  for (const [fid, sensitivity] of Object.entries(asset.sensitivities)) {
    const factorVal = factors[fid] || 0;
    const contrib = sensitivity * factorVal;
    score += contrib;
    contributions.push({ id: fid, label: FACTOR_LABELS[fid] || fid, contrib, absContrib: Math.abs(contrib) });
  }

  const topDrivers = contributions
    .sort((a, b) => b.absContrib - a.absContrib)
    .filter((c) => c.absContrib > 0.05)
    .slice(0, 3)
    .map((c) => ({ label: c.label, contrib: c.contrib }));

  // expectedReturn: score * 2.5, capped -20% to +20%
  const expectedReturn = Math.max(-20, Math.min(20, score * 2.5));

  // conviction: based on absolute score magnitude
  const absScore = Math.abs(score);
  let conviction;
  if (absScore > 2.0) conviction = 'Very High';
  else if (absScore > 1.2) conviction = 'High';
  else if (absScore > 0.6) conviction = 'Medium';
  else if (absScore > 0.25) conviction = 'Low';
  else conviction = 'None';

  // direction
  let direction;
  if (score > 0.75) direction = 'Bullish';
  else if (score > 0.25) direction = 'Positive';
  else if (score > -0.25) direction = 'Neutral';
  else if (score > -0.75) direction = 'Negative';
  else direction = 'Bearish';

  return {
    name: asset.name,
    category: asset.category,
    score,
    expectedReturn,
    conviction,
    direction,
    topDrivers,
    sensitivities: asset.sensitivities,
  };
}

/**
 * Score and rank all assets by scenario factors.
 */
export function rankAssetsByScenario(factors) {
  return ASSET_SENSITIVITIES
    .map((a) => scoreAsset(a, factors))
    .sort((a, b) => b.score - a.score);
}

/**
 * Group scored assets by category, sorted within each group.
 */
export function groupRankingsByCategory(factors) {
  const scored = ASSET_SENSITIVITIES.map((a) => scoreAsset(a, factors));

  const groups = {};
  for (const item of scored) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  // Sort within each category
  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => b.score - a.score);
  }

  // Return in display order
  return CATEGORY_ORDER
    .filter((cat) => groups[cat])
    .map((cat) => ({
      label: cat,
      assets: groups[cat],
    }));
}

/**
 * Compare GMI vs My View rankings.
 * Returns upgrades, downgrades, and direction changes.
 */
export function compareRankings(gmiFactors, userFactors) {
  const gmiScored = {};
  const userScored = {};

  for (const asset of ASSET_SENSITIVITIES) {
    const gmi = scoreAsset(asset, gmiFactors);
    const user = scoreAsset(asset, userFactors);
    gmiScored[asset.name] = gmi;
    userScored[asset.name] = user;
  }

  const diffs = ASSET_SENSITIVITIES.map((a) => {
    const gmi = gmiScored[a.name];
    const user = userScored[a.name];
    const scoreDelta = user.score - gmi.score;
    const returnDelta = user.expectedReturn - gmi.expectedReturn;
    const directionChanged = gmi.direction !== user.direction;
    return {
      name: a.name,
      category: a.category,
      gmiScore: gmi.score,
      userScore: user.score,
      scoreDelta,
      gmiReturn: gmi.expectedReturn,
      userReturn: user.expectedReturn,
      returnDelta,
      gmiDirection: gmi.direction,
      userDirection: user.direction,
      directionChanged,
    };
  });

  const sorted = [...diffs].sort((a, b) => Math.abs(b.scoreDelta) - Math.abs(a.scoreDelta));
  const upgrades = sorted.filter((d) => d.scoreDelta > 0.1).slice(0, 8);
  const downgrades = sorted.filter((d) => d.scoreDelta < -0.1).slice(0, 8);
  const directionChanges = diffs.filter((d) => d.directionChanged);

  // Category with biggest average gap
  const catGaps = {};
  for (const d of diffs) {
    if (!catGaps[d.category]) catGaps[d.category] = [];
    catGaps[d.category].push(Math.abs(d.scoreDelta));
  }
  const catDivergence = Object.entries(catGaps)
    .map(([cat, gaps]) => ({ category: cat, avgGap: gaps.reduce((s, v) => s + v, 0) / gaps.length }))
    .sort((a, b) => b.avgGap - a.avgGap);

  return { upgrades, downgrades, directionChanges, catDivergence, allDiffs: diffs };
}
