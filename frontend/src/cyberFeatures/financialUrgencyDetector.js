function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeFinancialUrgency({ amount = '', deadline = '', paymentMethod = '', message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([amount, deadline, paymentMethod, message].join(' '));
  if (/today|now|immediately|within|hours|minutes|last chance/i.test(lowered)) { score += 25; signals.push({ type: 'time_pressure', detail: 'The request creates immediate financial pressure', severity: 'high' }); }
  if (Number(amount) > 1000) { score += 15; signals.push({ type: 'high_amount', detail: 'The requested amount is large enough to be risky', severity: 'medium' }); }
  if (/upi|wallet|gift card|crypto|cash app/i.test(lowered)) { score += 20; signals.push({ type: 'risky_method', detail: 'The payment method is less traceable or less safe', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Pause and verify any high-pressure payment request before proceeding.', signals, details: { amount: amount || 'Not provided', deadline: deadline || 'Not provided', paymentMethod: paymentMethod || 'Not provided' } };
}
