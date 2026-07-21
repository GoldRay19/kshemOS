function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeScamPsychology({ message = '', tone = '', urgency = false, reward = false, authority = false, secrecy = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (urgency) { score += 20; signals.push({ type: 'urgency', detail: 'The message creates urgency', severity: 'high' }); }
  if (reward) { score += 18; signals.push({ type: 'reward', detail: 'The message dangles a reward or prize', severity: 'high' }); }
  if (authority) { score += 20; signals.push({ type: 'authority', detail: 'The message pretends to be official', severity: 'high' }); }
  if (secrecy) { score += 15; signals.push({ type: 'secrecy', detail: 'The message asks the target to stay silent', severity: 'medium' }); }
  if (/fear|panic|now|hurry|limited|exclusive|free|secret/i.test(lowered)) { score += 12; signals.push({ type: 'persuasion_language', detail: 'The wording uses fear or exclusivity tactics', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Recognize emotional triggers and pause before reacting.', signals, details: { tone: tone || 'Neutral', urgency, reward, authority, secrecy } };
}
