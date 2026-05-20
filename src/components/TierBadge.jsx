const TIER_LABELS = {
  alpha: 'ALPHA',
  pro: 'PRO',
  sandbox: 'SANDBOX',
  admin: 'ADMIN',
};

export default function TierBadge({ tier }) {
  return (
    <div className={`tier-badge tier-${tier}`}>
      {TIER_LABELS[tier] || tier.toUpperCase()}
    </div>
  );
}
