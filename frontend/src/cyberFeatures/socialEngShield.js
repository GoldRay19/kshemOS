function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeSocialEngineering({ message = '', context = '' } = {}) {
  const text = [message, context].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  const suspiciousTerms = ['urgent', 'immediately', 'confidential', 'only between us', 'do not tell anyone', 'verify your account', 'security alert', 'your account will be blocked'];
  const hits = suspiciousTerms.filter((term) => lowered.includes(term));
  if (hits.length) {
    score += Math.min(70, hits.length * 12);
    signals.push({ type: 'pressure_tactics', detail: `Matched social engineering cues: ${hits.slice(0, 4).join(', ')}`, severity: 'high' });
  }

  if (/authority|police|cbi|court|bank|support/i.test(lowered)) {
    score += 12;
    signals.push({ type: 'authority_impersonation', detail: 'The message claims authority or institutional pressure', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'The request should be verified through a known contact.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      message: message || 'No message provided',
      context: context || 'No context provided',
    },
  };
}
