function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeInvestment({ platform = '', promisedReturn = '', message = '', contact = '' } = {}) {
  const text = [platform, promisedReturn, message, contact].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  const suspiciousTerms = ['guaranteed', 'risk free', 'double', '100% return', 'daily profit', 'referral bonus', 'ponzi', 'bitcoin', 'crypto', 'quick profit', 'limited slots', 'get rich', 'passive income'];
  const hits = suspiciousTerms.filter((term) => lowered.includes(term));
  if (hits.length) {
    score += Math.min(60, hits.length * 10);
    signals.push({ type: 'promised_returns', detail: `Matched investment scam terms: ${hits.slice(0, 4).join(', ')}`, severity: 'high' });
  }

  if (/(₹|rs|inr)\s*\d{2,}/i.test(promisedReturn)) {
    score += 12;
    signals.push({ type: 'large_return', detail: 'Promised return seems unrealistic for a safe investment', severity: 'high' });
  }

  if (/urgent|today|immediately|limited/i.test(lowered)) {
    score += 12;
    signals.push({ type: 'urgency', detail: 'Pressure tactics are being used to push a fast decision', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'The investment pitch looks ordinary.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      platform: platform || 'Unknown',
      promisedReturn: promisedReturn || 'Not stated',
      contact,
      suspicious_terms: hits,
    },
  };
}
