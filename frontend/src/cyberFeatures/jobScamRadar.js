function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeJobOffer({ company = '', salary = '', message = '', recruiter = '' } = {}) {
  const text = [company, salary, message, recruiter].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  const suspiciousTerms = [
    'registration fee', 'training fee', 'processing fee', 'advance payment',
    'guaranteed income', 'no interview', 'immediate placement', 'pay now',
    'send money', 'free money', 'work from home', 'urgent', 'quick cash',
    'salary in advance', 'token fee', 'security deposit', 'crypto', 'lottery'
  ];

  const hits = suspiciousTerms.filter((term) => lowered.includes(term));
  if (hits.length) {
    score += Math.min(70, hits.length * 16);
    signals.push({ type: 'suspicious_terms', detail: `Matched job scam terms: ${hits.slice(0, 4).join(', ')}`, severity: 'high' });
  }

  if (/(₹|rs|inr)\s*\d{2,}/i.test(salary)) {
    score += 12;
    signals.push({ type: 'high_salary_claim', detail: 'Salary claim looks unusually high or unrealistic', severity: 'medium' });
  }

  if (/urgent|today|immediately|limited/i.test(lowered)) {
    score += 22;
    signals.push({ type: 'urgency', detail: 'Offer uses urgency to push a quick decision', severity: 'high' });
  }

  if (/registration fee|pay now|send money|fee/i.test(lowered)) {
    score += 18;
    signals.push({ type: 'upfront_payment', detail: 'The offer demands money or a fee before any real verification', severity: 'high' });
  }

  if (/interview|call|video/i.test(lowered) === false && message) {
    score += 10;
    signals.push({ type: 'missing_interview', detail: 'No interview or vetting cues are present', severity: 'medium' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'This looks like a normal hiring message.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      company: company || 'Unknown',
      salary: salary || 'Not stated',
      recruiter,
      suspicious_terms: hits,
    },
  };
}
