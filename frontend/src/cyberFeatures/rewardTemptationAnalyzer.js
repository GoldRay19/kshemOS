function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeRewardTemptation({ message = '', prize = false, cashback = false, bonus = false, limited = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (prize) { score += 20; signals.push({ type: 'prize', detail: 'The message offers a prize or incentive', severity: 'high' }); }
  if (cashback) { score += 15; signals.push({ type: 'cashback', detail: 'Cashback or reward is being used as bait', severity: 'medium' }); }
  if (bonus) { score += 15; signals.push({ type: 'bonus', detail: 'A bonus is being used to increase trust', severity: 'medium' }); }
  if (limited) { score += 15; signals.push({ type: 'limited_offer', detail: 'The offer claims to be limited or exclusive', severity: 'medium' }); }
  if (/free|winner|claim|selected|congratulations|exclusive/i.test(lowered)) { score += 12; signals.push({ type: 'temptation_phrases', detail: 'The message uses reward language to lower caution', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Do not act on reward-based messages without verifying the source.', signals, details: { prize, cashback, bonus, limited } };
}
