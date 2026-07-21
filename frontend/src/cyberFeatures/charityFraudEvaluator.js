function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeCharityClaim({ charityName = '', cause = '', amount = '', paymentMethod = '', registrationId = '', urgency = false, pressureForImmediate = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([charityName, cause, message].join(' '));
  if (!registrationId) { score += 25; signals.push({ type: 'no_registration', detail: 'Charity does not provide a valid registration number', severity: 'high' }); }
  if (urgency || pressureForImmediate) { score += 20; signals.push({ type: 'urgency', detail: 'Charity uses emotional urgency to pressure immediate donation', severity: 'high' }); }
  if (/upi|wallet|crypto|gift card|personal account/i.test(lowered)) { score += 20; signals.push({ type: 'risky_payment', detail: 'Asks for donation via non-standard or personal account', severity: 'high' }); }
  if (/cash|only today|match|double|limited|exclusive/i.test(lowered)) { score += 10; signals.push({ type: 'bait_tactics', detail: 'Uses matching or limited-time tactics to increase pressure', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Verify the charity through an official government registry before donating.', signals, details: { charityName: charityName || 'Unknown', cause: cause || 'Not provided', hasRegistration: !!registrationId } };
}

