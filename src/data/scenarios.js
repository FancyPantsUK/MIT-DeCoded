export const FACTORS = [
  { id: 'roro', label: 'RORO', sublabel: 'Risk On / Risk Off' },
  { id: 'growth', label: 'Growth', sublabel: 'Economic Growth' },
  { id: 'inflation', label: 'Inflation', sublabel: 'Price Pressure' },
  { id: 'rates', label: 'Rates', sublabel: 'Interest Rates' },
  { id: 'liquidity', label: 'Liquidity', sublabel: 'System Liquidity' },
  { id: 'usd', label: 'USD', sublabel: 'Dollar Strength' },
  { id: 'oil', label: 'Oil', sublabel: 'Energy Price' },
];

export const SCENARIOS = [
  {
    id: 'spring',
    label: 'Spring',
    icon: '🌱',
    factors: { roro: 0.50, growth: 1.00, inflation: -1.00, rates: 0.00, liquidity: 0.00, usd: 0.00, oil: 0.00 },
    description: 'Early cycle recovery. Growth accelerating, inflation fading, liquidity improving.',
  },
  {
    id: 'summer',
    label: 'Summer',
    icon: '☀️',
    factors: { roro: 0.25, growth: 1.00, inflation: 1.00, rates: 0.00, liquidity: 0.00, usd: 0.00, oil: 0.00 },
    description: 'Mid-cycle expansion. Growth strong, inflation rising, classic risk-on.',
  },
  {
    id: 'fall',
    label: 'Fall',
    icon: '🍂',
    factors: { roro: -0.50, growth: -0.50, inflation: 0.50, rates: 0.50, liquidity: -0.50, usd: 0.25, oil: 0.25 },
    description: 'Late cycle. Growth decelerating, inflation sticky, tightening bites.',
  },
  {
    id: 'winter',
    label: 'Winter',
    icon: '❄️',
    factors: { roro: -1.00, growth: -1.00, inflation: -0.50, rates: -0.50, liquidity: -1.00, usd: 0.50, oil: -0.50 },
    description: 'Recession. Risk off, growth collapsing, deflation risk, dollar bid.',
  },
  {
    id: 'dollar-wrecking-ball',
    label: 'Dollar Wrecking Ball',
    icon: '💥',
    factors: { roro: 0.00, growth: 0.00, inflation: 0.00, rates: 0.00, liquidity: 0.00, usd: 4.00, oil: 0.00 },
    description: 'USD surge dominates all else. EM stress, commodity crush, global tightening.',
  },
  {
    id: 'tightening',
    label: 'Tightening + Rate Hikes',
    icon: '🔒',
    factors: { roro: -0.25, growth: -0.25, inflation: 0.50, rates: 2.00, liquidity: -1.50, usd: 1.00, oil: 0.00 },
    description: 'Central bank hiking cycle. Liquidity draining, rates surging.',
  },
  {
    id: 'easing',
    label: 'Easing + Rate Cuts',
    icon: '🔓',
    factors: { roro: 0.75, growth: 0.25, inflation: -0.50, rates: -2.00, liquidity: 1.50, usd: -1.00, oil: 0.00 },
    description: 'Central bank easing. Liquidity flood, rates falling, risk assets bid.',
  },
  {
    id: 'oil-shock',
    label: 'Oil Shock',
    icon: '🛢️',
    factors: { roro: -0.50, growth: -0.50, inflation: 2.00, rates: 0.50, liquidity: -0.50, usd: 0.25, oil: 4.00 },
    description: 'Energy price spike. Stagflation risk, consumer squeeze, margin pressure.',
  },
  {
    id: 'melt-up',
    label: 'Market Melt-Up',
    icon: '🚀',
    factors: { roro: 2.00, growth: 1.50, inflation: 0.50, rates: -0.25, liquidity: 2.00, usd: -0.50, oil: 0.25 },
    description: 'Euphoria. Everything rallies, liquidity overflows, FOMO dominates.',
  },
];

export const CATEGORIES = [
  {
    id: 'asset-classes',
    label: 'Asset Classes',
    assets: [
      { name: 'US Equities', score: 1.2 },
      { name: 'EM Equities', score: 0.8 },
      { name: 'US Treasuries', score: -0.3 },
      { name: 'Gold', score: 0.5 },
      { name: 'Commodities', score: -0.7 },
      { name: 'REITs', score: 0.4 },
    ],
  },
  {
    id: 'equity-regions',
    label: 'Equity Regions',
    assets: [
      { name: 'US', score: 1.1 },
      { name: 'Europe', score: 0.6 },
      { name: 'Japan', score: 0.9 },
      { name: 'China', score: -0.4 },
      { name: 'EM ex-China', score: 0.3 },
      { name: 'UK', score: -0.2 },
    ],
  },
  {
    id: 'equity-sectors',
    label: 'Equity Sectors',
    assets: [
      { name: 'Technology', score: 1.5 },
      { name: 'Financials', score: 0.8 },
      { name: 'Healthcare', score: 0.3 },
      { name: 'Energy', score: -0.6 },
      { name: 'Utilities', score: -0.9 },
      { name: 'Consumer Disc.', score: 1.0 },
    ],
  },
  {
    id: 'fixed-income',
    label: 'Fixed Income',
    assets: [
      { name: '2Y Treasuries', score: -0.2 },
      { name: '10Y Treasuries', score: -0.5 },
      { name: 'IG Credit', score: 0.4 },
      { name: 'HY Credit', score: 0.9 },
      { name: 'EM Bonds', score: 0.3 },
      { name: 'TIPS', score: -0.1 },
    ],
  },
  {
    id: 'currencies',
    label: 'Currencies',
    assets: [
      { name: 'EUR/USD', score: 0.3 },
      { name: 'GBP/USD', score: 0.2 },
      { name: 'USD/JPY', score: -0.4 },
      { name: 'AUD/USD', score: 0.6 },
      { name: 'USD/CNH', score: -0.3 },
      { name: 'DXY', score: -0.5 },
    ],
  },
  {
    id: 'commodities',
    label: 'Commodities',
    assets: [
      { name: 'Gold', score: 0.5 },
      { name: 'Silver', score: 0.7 },
      { name: 'Copper', score: 1.0 },
      { name: 'Crude Oil', score: -0.3 },
      { name: 'Natural Gas', score: -0.8 },
      { name: 'Wheat', score: -0.2 },
    ],
  },
  {
    id: 'style-factors',
    label: 'Style Factors',
    assets: [
      { name: 'Momentum', score: 1.3 },
      { name: 'Value', score: 0.4 },
      { name: 'Quality', score: 0.6 },
      { name: 'Size (Small)', score: 0.8 },
      { name: 'Low Vol', score: -0.7 },
      { name: 'Growth', score: 1.1 },
    ],
  },
  {
    id: 'crypto',
    label: 'Crypto',
    assets: [
      { name: 'Bitcoin', score: 1.8 },
      { name: 'Ethereum', score: 1.5 },
      { name: 'Solana', score: 2.0 },
      { name: 'DeFi Index', score: 1.2 },
      { name: 'Stablecoins', score: 0.0 },
      { name: 'Alt L1s', score: 0.9 },
    ],
  },
];

export const COMPRESSION_DATA = {
  spring: {
    convictionScore: 78,
    bottomLine: 'Early cycle recovery favours risk assets, growth equities, and crypto. Inflation fading removes the headwind. This is the classic "buy the dip" season.',
    confirms: [
      'ISM new orders trending above 50',
      'Yield curve re-steepening',
      'Credit spreads tightening',
      'Global liquidity bottoming',
    ],
    invalidates: [
      'Inflation re-accelerating above 4%',
      'Credit event / bank stress',
      'Dollar breaking to new highs',
      'Oil shock above $100',
    ],
    bestExpressions: [
      { name: 'Long Nasdaq', conviction: 'High' },
      { name: 'Long Bitcoin', conviction: 'High' },
      { name: 'Long Copper', conviction: 'Medium' },
      { name: 'Short USD (DXY)', conviction: 'Medium' },
    ],
    watchpoints: [
      'Fed rhetoric on pause timing',
      'China stimulus follow-through',
      'Earnings revisions breadth',
    ],
    actionBias: 'ADD RISK',
    topPositive: ['Nasdaq', 'Bitcoin', 'Solana', 'Copper', 'Japan Equities'],
    topNegative: ['Utilities', 'Long-dated Treasuries', 'DXY', 'Natural Gas'],
    gmiDisagree: ['GMI more cautious on EM debt', 'GMI overweight gold vs consensus'],
  },
  summer: {
    convictionScore: 65,
    bottomLine: 'Mid-cycle with rising inflation creates a more selective environment. Growth names still work but watch for rate sensitivity.',
    confirms: ['PMI expansion broadening', 'Wage growth stable', 'Capex cycle intact'],
    invalidates: ['CPI prints above expectations for 3 months', 'Fed pivots hawkish', 'Oil above $120'],
    bestExpressions: [
      { name: 'Long Value Equities', conviction: 'High' },
      { name: 'Long Commodities', conviction: 'Medium' },
      { name: 'Short Duration', conviction: 'Medium' },
    ],
    watchpoints: ['Real rates trajectory', 'Commodity super-cycle signals'],
    actionBias: 'SELECTIVE RISK',
    topPositive: ['Energy', 'Financials', 'Commodities', 'Value', 'EM'],
    topNegative: ['Long Duration', 'Growth Factor', 'Utilities'],
    gmiDisagree: ['GMI prefers crypto over commodities here'],
  },
};

// Default compression for scenarios without specific data
export const DEFAULT_COMPRESSION = {
  convictionScore: 50,
  bottomLine: 'Scenario analysis in progress. Select factors and review sensitivity matrix for detailed read.',
  confirms: ['Review factor sensitivity matrix', 'Check cross-asset correlations'],
  invalidates: ['Monitor for regime change signals'],
  bestExpressions: [{ name: 'Await clearer signal', conviction: 'Low' }],
  watchpoints: ['Macro data releases', 'Central bank communications'],
  actionBias: 'NEUTRAL',
  topPositive: ['Pending analysis'],
  topNegative: ['Pending analysis'],
  gmiDisagree: ['Insufficient data for divergence analysis'],
};

export const TABS = [
  { id: 'rankings', label: 'Rankings', requiredTier: 'alpha' },
  { id: 'performance', label: 'Performance', requiredTier: 'alpha' },
  { id: 'your-view', label: 'Your View', requiredTier: 'pro' },
  { id: 'divergence', label: 'Divergence', requiredTier: 'pro' },
  { id: 'heatmap', label: 'Heatmap', requiredTier: 'alpha' },
  { id: 'seasons', label: 'Seasons', requiredTier: 'alpha' },
  { id: 'compress', label: 'Compress', requiredTier: 'pro' },
];
