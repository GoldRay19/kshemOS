function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeExtensionTrust({ name = '', permissions = [], publisher = '', rating = 0, verified = false } = {}) {
  const signals = [];
  let score = 0;
  const loweredName = normalize(name);
  if (!verified) { score += 25; signals.push({ type: 'unverified_publisher', detail: 'The extension publisher is not verified', severity: 'high' }); }
  if (permissions.some((p) => /clipboard|tabs|history|downloads|storage|notifications|webRequest/i.test(p))) { score += 30; signals.push({ type: 'broad_permissions', detail: 'The extension requests broad browser access', severity: 'high' }); }
  if (/ad|vpn|cashback|coupon|tracker|helper/i.test(loweredName)) { score += 15; signals.push({ type: 'suspicious_name', detail: 'The extension name resembles adware or helperware', severity: 'medium' }); }
  if (rating < 4) { score += 10; signals.push({ type: 'low_rating', detail: 'The extension has a low user rating', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Prefer browser extensions from reputable publishers with minimal permissions.', signals, details: { name, publisher: publisher || 'Unknown', permissions, rating, verified } };
}
