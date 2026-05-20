import { FACTORS } from '../data/scenarios';

// Macro implication formulas — transparent mock logic
const IMPLICATION_DEFS = [
  {
    label: 'Equities/Bonds Ratio',
    calc: (f) => f.roro + f.growth - f.rates + f.liquidity,
    format: (v) => {
      if (Math.abs(v) < 0.1) return 'Neutral allocation';
      const dir = v > 0 ? 'Overweight' : 'Underweight';
      return `${dir} equities by ${Math.abs(v).toFixed(1)}x`;
    },
    sentence: (gap) => gap > 0
      ? 'Your view implies more equity risk than GMI.'
      : gap < 0
        ? 'Your view implies less equity risk than GMI.'
        : null,
  },
  {
    label: 'ISM Manufacturing',
    calc: (f) => 50 + f.growth * 3.1,
    format: (v) => `${v.toFixed(1)} implied (${v >= 50 ? '+' : ''}${(v - 50).toFixed(1)}pt)`,
    sentence: (gap) => gap > 0
      ? 'Your view implies stronger ISM momentum than GMI.'
      : gap < 0
        ? 'Your view implies weaker ISM momentum than GMI.'
        : null,
  },
  {
    label: 'US CPI YoY',
    calc: (f) => 3.0 + f.inflation * 0.79 + f.oil * 0.12,
    format: (v) => `${v.toFixed(1)}% implied`,
    sentence: (gap) => gap > 0
      ? 'Your view implies more CPI pressure than GMI.'
      : gap < 0
        ? 'Your view implies less CPI pressure than GMI.'
        : null,
  },
  {
    label: 'US 2Y Yield',
    calc: (f) => 4.5 + (f.rates * 0.45 + f.inflation * 0.25),
    format: (v) => {
      const delta = (v - 4.5) * 100;
      return `${v.toFixed(2)}% implied (${delta >= 0 ? '+' : ''}${delta.toFixed(0)}bp)`;
    },
    sentence: (gap) => gap > 0
      ? 'Your view implies higher short-end rates than GMI.'
      : gap < 0
        ? 'Your view implies lower short-end rates than GMI.'
        : null,
  },
  {
    label: 'Liquidity Index',
    calc: (f) => f.liquidity * 1.2 - f.usd * 0.8,
    format: (v) => {
      if (Math.abs(v) < 0.2) return 'Neutral liquidity';
      return `${v > 0 ? '+' : ''}${v.toFixed(1)}% TLI`;
    },
    sentence: (gap) => gap > 0
      ? 'Your view implies looser global liquidity than GMI.'
      : gap < 0
        ? 'Your view implies tighter global liquidity than GMI.'
        : null,
  },
];

export function computeImplications(factors) {
  return IMPLICATION_DEFS.map((def) => {
    const value = def.calc(factors);
    const direction = value > 0.1 ? 'positive' : value < -0.1 ? 'negative' : 'neutral';
    return {
      label: def.label,
      value: def.format(value),
      rawValue: value,
      direction,
    };
  });
}

export function computeImplicationComparison(gmiFactors, userFactors) {
  return IMPLICATION_DEFS.map((def) => {
    const gmiRaw = def.calc(gmiFactors);
    const userRaw = def.calc(userFactors);
    const gap = userRaw - gmiRaw;
    const direction = gap > 0.05 ? 'positive' : gap < -0.05 ? 'negative' : 'neutral';
    return {
      label: def.label,
      gmiValue: def.format(gmiRaw),
      userValue: def.format(userRaw),
      gap: gap > 0 ? `+${gap.toFixed(2)}` : gap.toFixed(2),
      direction,
      sentence: def.sentence(gap),
    };
  });
}

export function computeFactorGaps(gmiFactors, userFactors) {
  return FACTORS.map((f) => {
    const gmi = gmiFactors[f.id] || 0;
    const user = userFactors[f.id] || 0;
    const gap = user - gmi;
    return {
      id: f.id,
      label: f.label,
      sublabel: f.sublabel,
      gmi,
      user,
      gap,
      direction: gap > 0.01 ? 'positive' : gap < -0.01 ? 'negative' : 'neutral',
    };
  });
}
