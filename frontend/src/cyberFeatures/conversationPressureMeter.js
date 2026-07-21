function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeConversationPressure({ message = '', repeatedRequests = false, interruptions = false, blame = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (repeatedRequests) { score += 20; signals.push({ type: 'repeated_requests', detail: 'The conversation repeatedly pushes the same request', severity: 'high' }); }
  if (interruptions) { score += 15; signals.push({ type: 'interruptions', detail: 'The sender interrupts or disregards hesitation', severity: 'medium' }); }
  if (blame) { score += 15; signals.push({ type: 'blame', detail: 'The sender uses blame to force compliance', severity: 'medium' }); }
  if (/now|hurry|do it|immediately|must|cannot wait/i.test(lowered)) { score += 15; signals.push({ type: 'pressure_words', detail: 'The message uses pressure language', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Slow the interaction down and respond only after you verify the request.', signals, details: { repeatedRequests, interruptions, blame } };
}
