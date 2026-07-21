function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeCrowdfunding({ campaignName = '', creatorName = '', goal = '', raised = '', platform = '', hasVerification = false, hasUpdates = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([campaignName, creatorName, message].join(' '));
  if (!hasVerification) { score += 25; signals.push({ type: 'unverified', detail: 'Campaign creator is not verified by the platform', severity: 'high' }); }
  if (!hasUpdates) { score += 20; signals.push({ type: 'no_updates', detail: 'No campaign updates or progress reports available', severity: 'medium' }); }
  if (/personal|emergency|only you|urgent|help now|before it's too late/i.test(lowered)) { score += 15; signals.push({ type: 'emotional_bait', detail: 'Uses emotional bait language to pressure donations', severity: 'medium' }); }
  if (/direct|upi|wallet|outside|personal account/i.test(lowered)) { score += 15; signals.push({ type: 'off_platform', detail: 'Asks for donations outside the official platform', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Donate only through verified platforms with transparent fund usage and regular updates.', signals, details: { campaignName: campaignName || 'Unknown', platform: platform || 'Unknown', hasVerification, hasUpdates } };
}

