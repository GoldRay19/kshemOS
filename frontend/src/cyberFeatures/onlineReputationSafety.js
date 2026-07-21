function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeOnlineReputation({ hasNegativeContent = false, hasImpersonation = false, hasDoxxing = false, hasReviewManipulation = false, hasFakeProfiles = false, hasDataLeaks = false, monitorsReputation = false, hasTakenAction = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (hasNegativeContent) { score += 20; signals.push({ type: 'negative_content', detail: 'Negative or defamatory content exists online', severity: 'high' }); }
  if (hasImpersonation) { score += 20; signals.push({ type: 'impersonation', detail: 'Fake accounts impersonating you or your brand exist', severity: 'high' }); }
  if (hasDoxxing) { score += 20; signals.push({ type: 'doxxing', detail: 'Personal information has been exposed publicly', severity: 'critical' }); }
  if (hasDataLeaks) { score += 15; signals.push({ type: 'data_leaks', detail: 'Your data appears in known data leaks', severity: 'high' }); }
  if (hasFakeProfiles) { score += 15; signals.push({ type: 'fake_profiles', detail: 'Fake profiles using your name or image exist', severity: 'high' }); }
  if (hasReviewManipulation) { score += 10; signals.push({ type: 'review_manipulation', detail: 'Suspicious reviews affecting your reputation', severity: 'medium' }); }
  if (!monitorsReputation) { score += 10; signals.push({ type: 'no_monitoring', detail: 'No active reputation monitoring in place', severity: 'medium' }); }
  if (!hasTakenAction) { score += 5; signals.push({ type: 'no_action', detail: 'No action taken to address reputation issues', severity: 'low' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Monitor your online reputation regularly, report impersonation, and request removal of exposed data.', signals, details: { hasNegativeContent, hasImpersonation, hasDoxxing, hasFakeProfiles, monitorsReputation, hasTakenAction } };
}

