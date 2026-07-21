function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeGiveaway({ message = '', prize = false, followRequired = false, paymentRequired = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (prize) { score += 20; signals.push({ type: 'prize_offer', detail: 'The message offers a prize or giveaway', severity: 'high' }); }
  if (followRequired) { score += 15; signals.push({ type: 'follow_required', detail: 'The offer requires a follow or engagement action', severity: 'medium' }); }
  if (paymentRequired) { score += 25; signals.push({ type: 'payment_required', detail: 'The offer asks for payment or a fee', severity: 'high' }); }
  if (/winner|selected|claim|today|limited|free/i.test(lowered)) { score += 12; signals.push({ type: 'giveaway_phrases', detail: 'The wording uses classic giveaway bait language', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Treat giveaways as suspicious when they require payment or engagement to claim a reward.', signals, details: { prize, followRequired, paymentRequired } };
}
