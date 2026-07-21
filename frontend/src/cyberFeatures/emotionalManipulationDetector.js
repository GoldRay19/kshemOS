function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeEmotionalManipulation({ message = '', empathy = false, guilt = false, fear = false, flattery = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (fear) { score += 25; signals.push({ type: 'fear', detail: 'The message relies on fear to push action', severity: 'high' }); }
  if (guilt) { score += 20; signals.push({ type: 'guilt', detail: 'The message uses guilt or obligation', severity: 'high' }); }
  if (empathy) { score += 15; signals.push({ type: 'empathy', detail: 'A false sense of urgency or urgency is implied through sympathy', severity: 'medium' }); }
  if (flattery) { score += 10; signals.push({ type: 'flattery', detail: 'The message uses flattery to lower resistance', severity: 'medium' }); }
  if (/please|only you|help me|family|love|regret/i.test(lowered)) { score += 12; signals.push({ type: 'manipulation_phrases', detail: 'Emotion-driven wording is present', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Take a moment to think independently before responding to emotionally charged requests.', signals, details: { message } };
}
