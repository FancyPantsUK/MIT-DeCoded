const TIER_LEVELS = {
  alpha: 1,
  pro: 2,
};

export const canAccess = (userTier, requiredTier) => {
  return (TIER_LEVELS[userTier] || 0) >= (TIER_LEVELS[requiredTier] || 0);
};

export const USER_TIER = 'pro';
