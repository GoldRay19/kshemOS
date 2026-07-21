function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeCourier({ courier = '', trackingNumber = '', message = '' } = {}) {
  const text = [courier, trackingNumber, message].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  const suspiciousTerms = ['customs', 'parcel seized', 'delivery blocked', 'pay fee', 'release parcel', 'tracking number', 'clearance', 'verification', 'urgent', 'immediately', 'pay now'];
  const hits = suspiciousTerms.filter((term) => lowered.includes(term));
  if (hits.length) {
    score += Math.min(70, hits.length * 10);
    signals.push({ type: 'courier_terms', detail: `Matched courier scam terms: ${hits.slice(0, 4).join(', ')}`, severity: 'high' });
  }

  if (/\d{5,}/.test(trackingNumber)) {
    score += 5;
    signals.push({ type: 'tracking_number', detail: 'A tracking number is present but the context is suspicious', severity: 'medium' });
  }

  if (/pay|transfer|upi|wallet|otp/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'payment_request', detail: 'The alert asks for money or a code to release the parcel', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'The parcel notice should be verified with the official courier.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      courier: courier || 'Unknown',
      trackingNumber: trackingNumber || 'Not provided',
      suspicious_terms: hits,
    },
  };
}
