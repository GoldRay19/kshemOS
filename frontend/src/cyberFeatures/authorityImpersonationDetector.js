function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeAuthorityImpersonation({ message = '', claimedOrg = '', requestedAction = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([message, claimedOrg, requestedAction].join(' '));
  if (/police|cbi|court|income tax|customs|bank|government|official/i.test(lowered)) { score += 25; signals.push({ type: 'claimed_authority', detail: 'The message claims official authority', severity: 'high' }); }
  if (/otp|password|aadhaar|pan|bank details|verify/i.test(lowered)) { score += 20; signals.push({ type: 'sensitive_request', detail: 'The message asks for sensitive information', severity: 'high' }); }
  if (/urgent|immediately|now/i.test(lowered)) { score += 12; signals.push({ type: 'urgency', detail: 'The message uses urgency to increase compliance', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Verify the authority through an official channel before acting.', signals, details: { claimedOrg: claimedOrg || 'Unknown', requestedAction: requestedAction || 'Not provided' } };
}
