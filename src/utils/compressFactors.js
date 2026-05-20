import { FACTORS } from '../data/scenarios';

// Core scores derived from factor values
function computeScores(f) {
  const riskOn = (f.roro || 0) + (f.growth || 0) + (f.liquidity || 0) - (f.rates || 0) - (f.usd || 0);
  const inflationPressure = (f.inflation || 0) + (f.oil || 0);
  const tighteningPressure = (f.rates || 0) + (f.usd || 0) - (f.liquidity || 0);
  const growthScore = f.growth || 0;
  return { riskOn, inflationPressure, tighteningPressure, growthScore };
}

function deriveActionBias(scores) {
  const { riskOn, inflationPressure, tighteningPressure, growthScore } = scores;
  if (growthScore < -0.5 && riskOn < -1) return 'DEFENSIVE';
  if (tighteningPressure > 1.5) return 'WATCH USD';
  if (inflationPressure > 1.5) return 'HEDGE INFLATION';
  if (riskOn > 2) return 'ADD RISK';
  if (riskOn > 0.5) return 'SELECTIVE RISK';
  if (riskOn < -0.5) return 'DEFENSIVE';
  return 'WAIT FOR CONFIRMATION';
}

function deriveBottomLine(scores, sourceLabel) {
  const { riskOn, inflationPressure, tighteningPressure, growthScore } = scores;
  const parts = [];

  if (riskOn > 1.5) parts.push('constructive for risk assets');
  else if (riskOn > 0.3) parts.push('modestly pro-risk');
  else if (riskOn < -1) parts.push('risk-off environment');
  else if (riskOn < -0.3) parts.push('cautious stance warranted');
  else parts.push('neutral risk positioning');

  if (inflationPressure > 1) parts.push('with inflation/rates risk elevated');
  else if (inflationPressure < -0.5) parts.push('with disinflation tailwind');

  if (tighteningPressure > 1.5) parts.push('— USD and rate pressure dominate');
  else if (tighteningPressure < -0.5) parts.push('— easing conditions supportive');

  if (growthScore < -0.7) parts.push('— slowdown/recession risk is the primary concern');
  else if (growthScore > 0.7) parts.push('— growth momentum remains the anchor');

  const prefix = sourceLabel === 'My View' ? 'Your view is' : 'GMI scenario is';
  return `${prefix} ${parts.join(' ')}.`;
}

function deriveBestExpressions(scores) {
  const { riskOn, inflationPressure, tighteningPressure, growthScore } = scores;
  const expressions = [];

  if (riskOn > 1) {
    expressions.push({ name: 'Long Equities', conviction: 'High' });
    expressions.push({ name: 'Long Credit', conviction: 'Medium' });
    expressions.push({ name: 'Long Crypto', conviction: riskOn > 2 ? 'High' : 'Medium' });
    expressions.push({ name: 'Long Cyclicals', conviction: 'Medium' });
  } else if (riskOn > 0) {
    expressions.push({ name: 'Selective Equities', conviction: 'Medium' });
    expressions.push({ name: 'Quality Growth', conviction: 'Medium' });
  }

  if (inflationPressure > 1) {
    expressions.push({ name: 'Long Energy', conviction: 'High' });
    expressions.push({ name: 'Long Commodities', conviction: 'Medium' });
    expressions.push({ name: 'Short Duration', conviction: 'Medium' });
  }

  if (tighteningPressure > 1) {
    expressions.push({ name: 'Long USD', conviction: 'High' });
    expressions.push({ name: 'Long Cash', conviction: 'Medium' });
    expressions.push({ name: 'Quality Defensives', conviction: 'Medium' });
  }

  if (growthScore < -0.5) {
    expressions.push({ name: 'Long Duration', conviction: 'Medium' });
    expressions.push({ name: 'Defensive Equities', conviction: 'Medium' });
    expressions.push({ name: 'Gold Selectively', conviction: 'Medium' });
  }

  if (expressions.length === 0) {
    expressions.push({ name: 'Balanced Allocation', conviction: 'Low' });
    expressions.push({ name: 'Wait for Signal', conviction: 'Low' });
  }

  return expressions.slice(0, 5);
}

function deriveWhatChanged(scores) {
  const items = [];
  if (scores.riskOn > 1) items.push('Risk-on score elevated — growth and liquidity dominate');
  if (scores.riskOn < -1) items.push('Risk-off score elevated — defensive posture needed');
  if (scores.inflationPressure > 1) items.push('Inflation pressure rising from energy and price inputs');
  if (scores.tighteningPressure > 1) items.push('Tightening pressure: rates and USD overpower liquidity');
  if (scores.growthScore < -0.5) items.push('Growth factor turned negative — slowdown signal');
  if (scores.growthScore > 0.5) items.push('Growth factor positive — expansion signal');
  if (items.length === 0) items.push('No dominant signal change — balanced factor environment');
  return items;
}

function deriveConfirms(scores) {
  const items = [];
  if (scores.riskOn > 0.5) items.push('Positive RORO and growth confirm risk-on');
  if (scores.inflationPressure < 0) items.push('Disinflation trend confirmed');
  if (scores.tighteningPressure < 0) items.push('Easing conditions confirmed');
  if (scores.growthScore > 0) items.push('Growth trajectory intact');
  if (items.length === 0) items.push('No strong confirming signals');
  return items;
}

function deriveInvalidates(scores) {
  const items = [];
  if (scores.riskOn > 0) items.push('Sudden credit event or VIX spike');
  if (scores.riskOn < 0) items.push('Surprise growth rebound or easing');
  if (scores.inflationPressure > 0.5) items.push('CPI drops sharply below expectations');
  if (scores.inflationPressure < -0.5) items.push('Inflation re-accelerates unexpectedly');
  items.push('Geopolitical shock alters macro regime');
  return items;
}

function deriveConviction(scores) {
  const magnitude = Math.abs(scores.riskOn) + Math.abs(scores.inflationPressure) + Math.abs(scores.tighteningPressure);
  // Stronger signals = higher conviction, capped 30-92
  return Math.min(92, Math.max(30, Math.round(35 + magnitude * 10)));
}

function deriveTopAssets(scores) {
  const { riskOn, inflationPressure, tighteningPressure } = scores;
  const positive = [];
  const negative = [];

  if (riskOn > 0.5) {
    positive.push('Nasdaq', 'Bitcoin', 'HY Credit', 'Copper');
    negative.push('Utilities', 'Long Treasuries', 'Low Vol');
  }
  if (riskOn < -0.5) {
    positive.push('Treasuries', 'Gold', 'Defensive Equity');
    negative.push('Cyclicals', 'HY Credit', 'EM Equity');
  }
  if (inflationPressure > 0.8) {
    positive.push('Energy', 'Commodities', 'TIPS');
    negative.push('Duration', 'Growth Tech');
  }
  if (tighteningPressure > 1) {
    positive.push('DXY', 'Cash', 'Quality');
    negative.push('EM Bonds', 'Commodities', 'Crypto');
  }

  // Dedupe
  return {
    topPositive: [...new Set(positive)].slice(0, 6),
    topNegative: [...new Set(negative)].slice(0, 5),
  };
}

/**
 * Compress factor values into a full compression object.
 * @param {Object} factors - { roro, growth, inflation, rates, liquidity, usd, oil }
 * @param {string} scenarioLabel - e.g. "Spring" or "My Custom View"
 * @param {string} sourceLabel - "GMI View" or "My View"
 */
export function compressFactors(factors, scenarioLabel, sourceLabel) {
  const scores = computeScores(factors);
  const conviction = deriveConviction(scores);
  const { topPositive, topNegative } = deriveTopAssets(scores);

  return {
    scenarioId: sourceLabel.toLowerCase().replace(/\s+/g, '-'),
    convictionScore: conviction,
    bottomLine: deriveBottomLine(scores, sourceLabel),
    whatChanged: deriveWhatChanged(scores),
    confirms: deriveConfirms(scores),
    invalidates: deriveInvalidates(scores),
    bestExpressions: deriveBestExpressions(scores),
    watchpoints: ['Factor balance shift', 'Data surprises vs view', 'Cross-asset confirmation'],
    actionBias: deriveActionBias(scores),
    confidence: conviction,
    requiredTier: 'pro',
    topPositive,
    topNegative,
    gmiDisagree: [],
  };
}

/**
 * Compare GMI compression vs My View compression.
 * Returns a structured comparison object.
 */
export function compareCompressions(gmiFactors, userFactors, scenarioLabel) {
  const gmiScores = computeScores(gmiFactors);
  const userScores = computeScores(userFactors);

  const gmi = compressFactors(gmiFactors, scenarioLabel, 'GMI View');
  const user = compressFactors(userFactors, scenarioLabel, 'My View');

  const riskDelta = userScores.riskOn - gmiScores.riskOn;
  const inflDelta = userScores.inflationPressure - gmiScores.inflationPressure;
  const tightDelta = userScores.tighteningPressure - gmiScores.tighteningPressure;

  // Factor gaps
  const factorGaps = FACTORS.map((f) => {
    const gap = (userFactors[f.id] || 0) - (gmiFactors[f.id] || 0);
    return { id: f.id, label: f.label, gap, direction: gap > 0.01 ? 'bullish' : gap < -0.01 ? 'bearish' : 'aligned' };
  });

  const biggestGaps = [...factorGaps]
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .filter((g) => Math.abs(g.gap) > 0.01)
    .slice(0, 3);

  // Bullish / bearish differences
  const moreBullish = [];
  const moreBearish = [];
  if (riskDelta > 0.3) moreBullish.push('More risk-on overall');
  if (riskDelta < -0.3) moreBearish.push('More risk-off overall');
  if (inflDelta > 0.3) moreBearish.push('Higher inflation pressure');
  if (inflDelta < -0.3) moreBullish.push('Less inflation concern');
  if (tightDelta > 0.3) moreBearish.push('More tightening pressure');
  if (tightDelta < -0.3) moreBullish.push('Less tightening concern');

  factorGaps.forEach((g) => {
    if (g.gap > 0.5) moreBullish.push(`Higher ${g.label}`);
    if (g.gap < -0.5) moreBearish.push(`Lower ${g.label}`);
  });

  // Conclusion
  let conclusion;
  if (Math.abs(riskDelta) < 0.2 && Math.abs(inflDelta) < 0.2) {
    conclusion = 'Your view is broadly aligned with GMI.';
  } else if (riskDelta > 0.3) {
    conclusion = `Your view is more risk-on than GMI because of ${biggestGaps.length > 0 ? biggestGaps.map((g) => g.label).join(', ') : 'overall factor tilt'}.`;
  } else if (riskDelta < -0.3) {
    conclusion = `Your view is more risk-off than GMI because of ${biggestGaps.length > 0 ? biggestGaps.map((g) => g.label).join(', ') : 'overall factor tilt'}.`;
  } else {
    conclusion = `Similar risk stance but different composition: ${biggestGaps.length > 0 ? biggestGaps.map((g) => `${g.label} (${g.gap > 0 ? '+' : ''}${g.gap.toFixed(2)})`).join(', ') : 'minor differences'}.`;
  }

  // Expression changes
  const gmiExprNames = new Set(gmi.bestExpressions.map((e) => e.name));
  const userExprNames = new Set(user.bestExpressions.map((e) => e.name));
  const addedExpressions = user.bestExpressions.filter((e) => !gmiExprNames.has(e.name));
  const removedExpressions = gmi.bestExpressions.filter((e) => !userExprNames.has(e.name));

  return {
    gmi,
    user,
    riskDelta,
    inflDelta,
    tightDelta,
    factorGaps,
    biggestGaps,
    moreBullish: [...new Set(moreBullish)].slice(0, 4),
    moreBearish: [...new Set(moreBearish)].slice(0, 4),
    conclusion,
    biasChanged: gmi.actionBias !== user.actionBias,
    gmiActionBias: gmi.actionBias,
    userActionBias: user.actionBias,
    addedExpressions,
    removedExpressions,
  };
}
