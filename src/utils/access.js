const TIER_LEVELS = {
  alpha: 1,
  pro: 2,
  sandbox: 3,
  admin: 4,
};

export const TIER_LIST = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'pro', label: 'Pro' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'admin', label: 'Admin' },
];

// Modes that require a specific tier
export const MODE_TIER = {
  myview: 'pro',
  compare: 'pro',
};

export const canAccess = (userTier, requiredTier) => {
  return (TIER_LEVELS[userTier] || 0) >= (TIER_LEVELS[requiredTier] || 0);
};

export const canUseMode = (userTier, modeId) => {
  const required = MODE_TIER[modeId];
  if (!required) return true;
  return canAccess(userTier, required);
};

export function getInitialTier() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier');
    if (tier && TIER_LEVELS[tier]) return tier;
  }
  return 'alpha';
}
