function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeIdentity({ idNumber = '', message = '', issuer = '' } = {}) {
  const text = [idNumber, message, issuer].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  if (/aadhaar|pan|passport|voter|dl|uid/i.test(lowered)) {
    score += 20;
    signals.push({ type: 'identity_document', detail: 'The message references a sensitive identity document', severity: 'high' });
  }

  if (/share|send|verify|update|otp/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'identity_request', detail: 'The message asks for personal identity details or OTP', severity: 'high' });
  }

  if (/urgent|today|immediately|now/i.test(lowered)) {
    score += 10;
    signals.push({ type: 'urgency', detail: 'The request is framed with urgency', severity: 'medium' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'Identity requests should be verified before sharing any details.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      idNumber: idNumber || 'Not provided',
      issuer: issuer || 'Unknown',
    },
  };
}
