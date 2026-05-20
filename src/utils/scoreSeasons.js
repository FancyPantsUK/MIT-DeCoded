import { SCENARIOS, FACTORS } from '../data/scenarios';
import { ASSET_SENSITIVITIES, CATEGORY_ORDER } from '../data/factorSensitivities';
import { scoreAsset } from './scoreAssets';

// Canonical seasons are the first 4 scenarios
const CANONICAL_IDS = ['spring', 'summer', 'fall', 'winter'];
export const CANONICAL_SEASONS = SCENARIOS.filter((s) => CANONICAL_IDS.includes(s.id));

/**
 * Score every asset under each canonical season, assign 1/2/3 ratings.
 * Returns grouped by category.
 */
export function computeSeasonMap() {
  const results = ASSET_SENSITIVITIES.map((asset) => {
    const seasonScores = CANONICAL_SEASONS.map((s) => ({
      id: s.id,
      label: s.label,
      icon: s.icon,
      score: scoreAsset(asset, s.factors).score,
    }));

    // Sort descending by score to assign ranks
    const sorted = [...seasonScores].sort((a, b) => b.score - a.score);
    const ratings = {};
    sorted.forEach((s, i) => {
      if (i === 0) ratings[s.id] = 1;
      else if (i === sorted.length - 1) ratings[s.id] = 3;
      else ratings[s.id] = 2;
    });

    return {
      name: asset.name,
      category: asset.category,
      seasonScores,
      ratings,
      bestSeason: sorted[0],
      worstSeason: sorted[sorted.length - 1],
    };
  });

  // Group by category
  const groups = {};
  for (const item of results) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  return CATEGORY_ORDER.filter((c) => groups[c]).map((c) => ({
    label: c,
    rows: groups[c],
  }));
}

/**
 * Compute distance from a factor set to each canonical season.
 * distance = sum(abs(active[f] - season[f])) for all 7 factors
 */
export function seasonDistances(factors) {
  return CANONICAL_SEASONS.map((s) => {
    let dist = 0;
    for (const f of FACTORS) {
      dist += Math.abs((factors[f.id] || 0) - (s.factors[f.id] || 0));
    }
    return { id: s.id, label: s.label, icon: s.icon, distance: dist };
  }).sort((a, b) => a.distance - b.distance);
}

/**
 * Compute a scenario view: closest season, top/bottom assets, factor distances.
 */
export function computeScenarioSeasonView(factors, label) {
  const distances = seasonDistances(factors);
  const closest = distances[0];
  const farthest = distances[distances.length - 1];

  // Score all assets under active factors
  const scored = ASSET_SENSITIVITIES.map((a) => scoreAsset(a, factors));
  scored.sort((a, b) => b.score - a.score);

  const topAssets = scored.slice(0, 6);
  const bottomAssets = scored.slice(-6).reverse();

  // Factor breakdown vs closest season
  const closestSeason = CANONICAL_SEASONS.find((s) => s.id === closest.id);
  const factorGaps = FACTORS.map((f) => ({
    id: f.id,
    label: f.label,
    active: factors[f.id] || 0,
    season: closestSeason.factors[f.id] || 0,
    gap: (factors[f.id] || 0) - (closestSeason.factors[f.id] || 0),
  }));

  return {
    label,
    closest,
    farthest,
    distances,
    topAssets,
    bottomAssets,
    factorGaps,
  };
}

/**
 * Compare GMI vs My View season positioning.
 */
export function compareSeasonViews(gmiFactors, userFactors, scenarioLabel) {
  const gmi = computeScenarioSeasonView(gmiFactors, 'GMI');
  const user = computeScenarioSeasonView(userFactors, 'My View');

  const gmiDist = seasonDistances(gmiFactors);
  const userDist = seasonDistances(userFactors);

  // Per-season: is user closer or farther than GMI?
  const seasonShifts = CANONICAL_SEASONS.map((s) => {
    const gd = gmiDist.find((d) => d.id === s.id).distance;
    const ud = userDist.find((d) => d.id === s.id).distance;
    const delta = gd - ud; // positive = user is closer to this season
    return { id: s.id, label: s.label, icon: s.icon, gmiDist: gd, userDist: ud, delta };
  });

  const moreToward = seasonShifts.filter((s) => s.delta > 0.1).sort((a, b) => b.delta - a.delta);
  const moreAway = seasonShifts.filter((s) => s.delta < -0.1).sort((a, b) => a.delta - b.delta);

  // Biggest factor diffs
  const factorDiffs = FACTORS.map((f) => ({
    id: f.id,
    label: f.label,
    gap: (userFactors[f.id] || 0) - (gmiFactors[f.id] || 0),
  })).sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  // Assets with biggest score change
  const gmiScored = {};
  const userScored = {};
  for (const a of ASSET_SENSITIVITIES) {
    gmiScored[a.name] = scoreAsset(a, gmiFactors);
    userScored[a.name] = scoreAsset(a, userFactors);
  }
  const assetShifts = ASSET_SENSITIVITIES.map((a) => ({
    name: a.name,
    category: a.category,
    delta: userScored[a.name].score - gmiScored[a.name].score,
    gmiDir: gmiScored[a.name].direction,
    userDir: userScored[a.name].direction,
  })).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return {
    gmi,
    user,
    seasonShifts,
    moreToward,
    moreAway,
    factorDiffs,
    assetShifts: assetShifts.slice(0, 8),
    sameClosest: gmi.closest.id === user.closest.id,
  };
}
