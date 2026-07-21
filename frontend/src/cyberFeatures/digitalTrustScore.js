function normalize(text) { return (text || '').toLowerCase().trim(); }

export function calculateDigitalTrustScore({ hasSecurePassword = false, usesMFA = false, hasRecentBreach = false, hasSuspiciousActivity = false, profileVerified = false, hasPositiveReviews = false, accountAgeInMonths = 0, hasCompletedProfile = false, reportedByOthers = false } = {}) {
  const signals = [];
  let score = 50;
  if (hasSecurePassword) { score += 10; signals.push({ type: 'secure_password', detail: 'Account uses a strong, unique password', severity: 'positive' }); }
  if (usesMFA) { score += 10; signals.push({ type: 'mfa_enabled', detail: 'Multi-factor authentication is enabled', severity: 'positive' }); }
  if (!hasRecentBreach) { score += 8; signals.push({ type: 'no_breach', detail: 'No known data breaches associated', severity: 'positive' }); }
  if (!hasSuspiciousActivity) { score += 8; signals.push({ type: 'clean_activity', detail: 'No suspicious activity detected', severity: 'positive' }); }
  if (profileVerified) { score += 7; signals.push({ type: 'verified', detail: 'Profile is verified by platform', severity: 'positive' }); }
  if (hasPositiveReviews) { score += 5; signals.push({ type: 'positive_reviews', detail: 'Has positive reviews or ratings', severity: 'positive' }); }
  if (accountAgeInMonths > 12) { score += 5; signals.push({ type: 'mature_account', detail: 'Account is more than 1 year old', severity: 'positive' }); }
  if (hasCompletedProfile) { score += 4; signals.push({ type: 'complete_profile', detail: 'Profile is fully completed', severity: 'positive' }); }
  if (hasRecentBreach) { score -= 15; signals.push({ type: 'breach_history', detail: 'Account has known data breaches', severity: 'negative' }); }
  if (hasSuspiciousActivity) { score -= 15; signals.push({ type: 'suspicious_activity', detail: 'Suspicious activity detected on account', severity: 'negative' }); }
  if (reportedByOthers) { score -= 20; signals.push({ type: 'reported', detail: 'Account has been reported by other users', severity: 'negative' }); }
  score = Math.max(0, Math.min(100, score));
  const trustBand = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const recommendation = score >= 70 ? 'This account appears trustworthy based on available signals.' : score >= 40 ? 'Some risk signals present. Exercise caution when interacting.' : 'Low trust score. Avoid sharing sensitive information.';
  return { trust_score: score, trust_band: trustBand, recommendation, signals, details: { accountAgeMonths: accountAgeInMonths, profileVerified, hasPositiveReviews, hasSuspiciousActivity } };
}

