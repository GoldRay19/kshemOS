function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeLoanOffer({ lender = '', amount = '', message = '', fee = '' } = {}) {
  const text = [lender, amount, message, fee].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  const suspiciousTerms = ['processing fee', 'advance payment', 'instant approval', 'no documents', 'guaranteed approval', 'cash immediately', 'loan approval', 'quick loan', 'pay now', 'credit score not required'];
  const hits = suspiciousTerms.filter((term) => lowered.includes(term));
  if (hits.length) {
    score += Math.min(70, hits.length * 10);
    signals.push({ type: 'loan_terms', detail: `Matched suspicious loan terms: ${hits.slice(0, 4).join(', ')}`, severity: 'high' });
  }

  if (/urgent|today|immediately|within/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'urgency', detail: 'The lender is pushing a rushed loan decision', severity: 'high' });
  }

  if (/pay|transfer|wallet|upi/i.test(lowered)) {
    score += 10;
    signals.push({ type: 'payment_request', detail: 'The offer asks for money or payment before approval', severity: 'high' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'The loan offer should be checked through a known institution.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      lender: lender || 'Unknown',
      amount: amount || 'Not stated',
      fee: fee || 'Not stated',
      suspicious_terms: hits,
    },
  };
}
