export default function TierBadge({ tier }) {
  return (
    <div className={`tier-badge tier-${tier}`}>
      {tier.toUpperCase()}
    </div>
  );
}
