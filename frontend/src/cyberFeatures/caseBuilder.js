function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function buildCyberCase({ title = '', summary = '', evidence = [], urgency = '' } = {}) {
  const text = [title, summary, ...evidence, urgency].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  if (evidence.length >= 3) {
    score += 20;
    signals.push({ type: 'evidence_collected', detail: 'Multiple evidence items have been gathered', severity: 'medium' });
  }

  if (/urgent|immediately|today|critical/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'urgency', detail: 'The case has urgent follow-up needs', severity: 'medium' });
  }

  if (/otp|payment|wallet|upi|bank|aadhaar|pan/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'financial_identity', detail: 'The case includes payment or identity-sensitive details', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  return {
    risk_score: finalScore,
    risk_band: finalScore >= 50 ? 'high' : 'medium',
    recommendation: 'Secure the evidence, preserve timestamps, and escalate to the proper cybercrime desk.',
    signals,
    details: {
      title: title || 'Untitled case',
      evidenceCount: evidence.length,
      urgency: urgency || 'Standard',
    },
  };
}
