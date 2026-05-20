// Factor sensitivities for each asset across Julien's 7 factors.
// Each sensitivity represents how much the asset responds to a +1 move in that factor.
// Positive = asset benefits from factor increase. Negative = asset suffers.

export const ASSET_SENSITIVITIES = [
  // ── Asset Classes ──
  { name: 'US Equities',     category: 'Asset Classes',   sensitivities: { roro:  0.8, growth:  0.9, inflation: -0.2, rates: -0.3, liquidity:  0.6, usd:  0.1, oil: -0.1 } },
  { name: 'EM Equities',     category: 'Asset Classes',   sensitivities: { roro:  0.9, growth:  0.7, inflation:  0.1, rates: -0.4, liquidity:  0.8, usd: -0.9, oil:  0.1 } },
  { name: 'US Treasuries',   category: 'Asset Classes',   sensitivities: { roro: -0.6, growth: -0.5, inflation: -0.7, rates: -0.9, liquidity:  0.3, usd:  0.2, oil: -0.2 } },
  { name: 'Gold',            category: 'Asset Classes',   sensitivities: { roro:  0.1, growth: -0.1, inflation:  0.6, rates: -0.5, liquidity:  0.7, usd: -0.6, oil:  0.2 } },
  { name: 'Commodities',     category: 'Asset Classes',   sensitivities: { roro:  0.5, growth:  0.6, inflation:  0.8, rates: -0.2, liquidity:  0.4, usd: -0.7, oil:  0.7 } },
  { name: 'REITs',           category: 'Asset Classes',   sensitivities: { roro:  0.4, growth:  0.3, inflation: -0.3, rates: -0.7, liquidity:  0.5, usd:  0.0, oil: -0.1 } },

  // ── Equity Regions ──
  { name: 'US',              category: 'Equity Regions',  sensitivities: { roro:  0.7, growth:  0.8, inflation: -0.2, rates: -0.3, liquidity:  0.5, usd:  0.2, oil: -0.1 } },
  { name: 'Europe',          category: 'Equity Regions',  sensitivities: { roro:  0.6, growth:  0.5, inflation: -0.1, rates: -0.3, liquidity:  0.5, usd: -0.4, oil: -0.3 } },
  { name: 'Japan',           category: 'Equity Regions',  sensitivities: { roro:  0.5, growth:  0.6, inflation:  0.1, rates: -0.2, liquidity:  0.4, usd: -0.5, oil: -0.2 } },
  { name: 'China',           category: 'Equity Regions',  sensitivities: { roro:  0.7, growth:  0.8, inflation:  0.0, rates: -0.3, liquidity:  0.9, usd: -0.6, oil:  0.1 } },
  { name: 'EM ex-China',     category: 'Equity Regions',  sensitivities: { roro:  0.8, growth:  0.6, inflation:  0.1, rates: -0.4, liquidity:  0.7, usd: -0.8, oil:  0.2 } },
  { name: 'UK',              category: 'Equity Regions',  sensitivities: { roro:  0.4, growth:  0.4, inflation:  0.0, rates: -0.3, liquidity:  0.3, usd: -0.3, oil:  0.2 } },

  // ── Equity Sectors ──
  { name: 'Technology',      category: 'Equity Sectors',  sensitivities: { roro:  0.9, growth:  0.8, inflation: -0.3, rates: -0.5, liquidity:  0.7, usd:  0.1, oil: -0.1 } },
  { name: 'Financials',      category: 'Equity Sectors',  sensitivities: { roro:  0.6, growth:  0.7, inflation:  0.2, rates:  0.4, liquidity:  0.3, usd:  0.1, oil:  0.0 } },
  { name: 'Healthcare',      category: 'Equity Sectors',  sensitivities: { roro: -0.1, growth:  0.2, inflation:  0.1, rates: -0.2, liquidity:  0.2, usd:  0.1, oil:  0.0 } },
  { name: 'Energy',          category: 'Equity Sectors',  sensitivities: { roro:  0.3, growth:  0.5, inflation:  0.7, rates:  0.1, liquidity:  0.2, usd: -0.3, oil:  0.9 } },
  { name: 'Utilities',       category: 'Equity Sectors',  sensitivities: { roro: -0.5, growth: -0.3, inflation: -0.2, rates: -0.6, liquidity:  0.3, usd:  0.1, oil: -0.2 } },
  { name: 'Consumer Disc.',  category: 'Equity Sectors',  sensitivities: { roro:  0.7, growth:  0.8, inflation: -0.3, rates: -0.3, liquidity:  0.5, usd:  0.0, oil: -0.2 } },

  // ── Fixed Income ──
  { name: '2Y Treasuries',   category: 'Fixed Income',   sensitivities: { roro: -0.3, growth: -0.2, inflation: -0.4, rates: -0.6, liquidity:  0.2, usd:  0.1, oil: -0.1 } },
  { name: '10Y Treasuries',  category: 'Fixed Income',   sensitivities: { roro: -0.5, growth: -0.5, inflation: -0.7, rates: -0.9, liquidity:  0.3, usd:  0.2, oil: -0.2 } },
  { name: 'IG Credit',       category: 'Fixed Income',   sensitivities: { roro:  0.3, growth:  0.3, inflation: -0.2, rates: -0.4, liquidity:  0.4, usd:  0.1, oil: -0.1 } },
  { name: 'HY Credit',       category: 'Fixed Income',   sensitivities: { roro:  0.7, growth:  0.5, inflation: -0.1, rates: -0.3, liquidity:  0.6, usd: -0.1, oil:  0.0 } },
  { name: 'EM Bonds',        category: 'Fixed Income',   sensitivities: { roro:  0.5, growth:  0.4, inflation:  0.0, rates: -0.3, liquidity:  0.6, usd: -0.8, oil:  0.1 } },
  { name: 'TIPS',            category: 'Fixed Income',   sensitivities: { roro:  0.0, growth:  0.0, inflation:  0.5, rates: -0.3, liquidity:  0.2, usd: -0.1, oil:  0.3 } },

  // ── Currencies ──
  { name: 'EUR/USD',         category: 'Currencies',     sensitivities: { roro:  0.3, growth:  0.1, inflation:  0.0, rates: -0.2, liquidity:  0.3, usd: -0.9, oil:  0.0 } },
  { name: 'GBP/USD',         category: 'Currencies',     sensitivities: { roro:  0.3, growth:  0.2, inflation:  0.0, rates: -0.1, liquidity:  0.2, usd: -0.8, oil: -0.1 } },
  { name: 'USD/JPY',         category: 'Currencies',     sensitivities: { roro:  0.2, growth:  0.3, inflation:  0.1, rates:  0.5, liquidity: -0.2, usd:  0.7, oil:  0.0 } },
  { name: 'AUD/USD',         category: 'Currencies',     sensitivities: { roro:  0.6, growth:  0.5, inflation:  0.1, rates: -0.2, liquidity:  0.4, usd: -0.8, oil:  0.3 } },
  { name: 'USD/CNH',         category: 'Currencies',     sensitivities: { roro: -0.3, growth: -0.3, inflation:  0.0, rates:  0.3, liquidity: -0.4, usd:  0.8, oil:  0.0 } },
  { name: 'DXY',             category: 'Currencies',     sensitivities: { roro: -0.4, growth: -0.2, inflation:  0.1, rates:  0.4, liquidity: -0.5, usd:  1.0, oil:  0.0 } },

  // ── Commodities ──
  { name: 'Gold',            category: 'Commodities',    sensitivities: { roro:  0.1, growth: -0.1, inflation:  0.6, rates: -0.5, liquidity:  0.7, usd: -0.6, oil:  0.1 } },
  { name: 'Silver',          category: 'Commodities',    sensitivities: { roro:  0.3, growth:  0.2, inflation:  0.5, rates: -0.4, liquidity:  0.6, usd: -0.5, oil:  0.1 } },
  { name: 'Copper',          category: 'Commodities',    sensitivities: { roro:  0.6, growth:  0.8, inflation:  0.3, rates: -0.2, liquidity:  0.5, usd: -0.6, oil:  0.2 } },
  { name: 'Crude Oil',       category: 'Commodities',    sensitivities: { roro:  0.3, growth:  0.5, inflation:  0.4, rates: -0.1, liquidity:  0.2, usd: -0.4, oil:  1.0 } },
  { name: 'Natural Gas',     category: 'Commodities',    sensitivities: { roro:  0.1, growth:  0.3, inflation:  0.3, rates:  0.0, liquidity:  0.1, usd: -0.2, oil:  0.6 } },
  { name: 'Wheat',           category: 'Commodities',    sensitivities: { roro:  0.0, growth:  0.1, inflation:  0.4, rates: -0.1, liquidity:  0.1, usd: -0.3, oil:  0.3 } },

  // ── Style Factors ──
  { name: 'Momentum',        category: 'Style Factors',  sensitivities: { roro:  0.6, growth:  0.5, inflation: -0.1, rates: -0.2, liquidity:  0.5, usd:  0.0, oil:  0.0 } },
  { name: 'Value',           category: 'Style Factors',  sensitivities: { roro:  0.3, growth:  0.6, inflation:  0.4, rates:  0.2, liquidity:  0.2, usd: -0.1, oil:  0.2 } },
  { name: 'Quality',         category: 'Style Factors',  sensitivities: { roro: -0.1, growth:  0.3, inflation: -0.1, rates: -0.2, liquidity:  0.3, usd:  0.2, oil:  0.0 } },
  { name: 'Size (Small)',    category: 'Style Factors',  sensitivities: { roro:  0.7, growth:  0.7, inflation: -0.1, rates: -0.4, liquidity:  0.6, usd: -0.2, oil:  0.0 } },
  { name: 'Low Vol',         category: 'Style Factors',  sensitivities: { roro: -0.6, growth: -0.3, inflation: -0.1, rates: -0.3, liquidity:  0.2, usd:  0.2, oil:  0.0 } },
  { name: 'Growth',          category: 'Style Factors',  sensitivities: { roro:  0.8, growth:  0.7, inflation: -0.3, rates: -0.5, liquidity:  0.6, usd:  0.0, oil: -0.1 } },

  // ── Crypto ──
  { name: 'Bitcoin',         category: 'Crypto',         sensitivities: { roro:  0.9, growth:  0.4, inflation:  0.2, rates: -0.5, liquidity:  1.0, usd: -0.7, oil:  0.0 } },
  { name: 'Ethereum',        category: 'Crypto',         sensitivities: { roro:  0.9, growth:  0.5, inflation:  0.1, rates: -0.5, liquidity:  0.9, usd: -0.6, oil:  0.0 } },
  { name: 'Solana',          category: 'Crypto',         sensitivities: { roro:  1.0, growth:  0.5, inflation:  0.1, rates: -0.4, liquidity:  1.0, usd: -0.5, oil:  0.0 } },
  { name: 'DeFi Index',      category: 'Crypto',         sensitivities: { roro:  0.8, growth:  0.4, inflation:  0.1, rates: -0.4, liquidity:  0.9, usd: -0.5, oil:  0.0 } },
  { name: 'Stablecoins',     category: 'Crypto',         sensitivities: { roro:  0.0, growth:  0.0, inflation:  0.0, rates:  0.1, liquidity:  0.0, usd:  0.1, oil:  0.0 } },
  { name: 'Alt L1s',         category: 'Crypto',         sensitivities: { roro:  1.0, growth:  0.4, inflation:  0.0, rates: -0.4, liquidity:  0.9, usd: -0.5, oil:  0.0 } },
];

// Category order for display
export const CATEGORY_ORDER = [
  'Asset Classes',
  'Equity Regions',
  'Equity Sectors',
  'Fixed Income',
  'Currencies',
  'Commodities',
  'Style Factors',
  'Crypto',
];
