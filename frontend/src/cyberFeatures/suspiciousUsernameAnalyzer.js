function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeUsername({ username = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(username);
  if (/admin|support|verify|security|official|bank|help|free|winner|prize|crypto|cash|loan/i.test(lowered)) { score += 25; signals.push({ type: 'suspicious_words', detail: 'The username contains authority or reward bait words', severity: 'high' }); }
  if (lowered.length < 6) { score += 10; signals.push({ type: 'short_username', detail: 'The username is very short and easy to impersonate', severity: 'medium' }); }
  if (/\d{3,}/.test(lowered)) { score += 10; signals.push({ type: 'numbered_username', detail: 'The username includes many digits', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Be cautious with usernames that imitate institutions or promise rewards.', signals, details: { username } };
}
