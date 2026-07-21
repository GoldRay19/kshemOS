function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeSubscriptionFraud({ plan = '', amount = '', autoRenew = false, freeTrial = false, urgency = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([plan, amount].join(' '));
  if (autoRenew) { score += 20; signals.push({ type: 'auto_renew', detail: 'The plan auto-renews without clear consent', severity: 'high' }); }
  if (freeTrial) { score += 15; signals.push({ type: 'free_trial', detail: 'The offer uses a free trial to encourage sign-up', severity: 'medium' }); }
  if (urgency) { score += 15; signals.push({ type: 'urgency', detail: 'The offer pushes a fast sign-up decision', severity: 'medium' }); }
  if (/premium|vip|exclusive|limited|secret/i.test(lowered)) { score += 10; signals.push({ type: 'premium_bait', detail: 'The plan uses premium or exclusive language', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Read the renewal and cancellation terms carefully before subscribing.', signals, details: { plan: plan || 'Unknown', amount: amount || 'Not provided', autoRenew, freeTrial, urgency } };
}
