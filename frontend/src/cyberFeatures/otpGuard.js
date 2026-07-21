function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeOTPRequest({ message = '', sender = '' } = {}) {
  const text = [message, sender].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  if (/otp|one time password|verification code/i.test(lowered)) {
    score += 30;
    signals.push({ type: 'otp_request', detail: 'The message asks for an OTP or verification code', severity: 'critical' });
  }

  if (/sim swap|swap|port out|porting/i.test(lowered)) {
    score += 20;
    signals.push({ type: 'sim_swap', detail: 'The message mentions SIM swap or number porting', severity: 'high' });
  }

  if (/urgent|immediately|now|today/i.test(lowered)) {
    score += 10;
    signals.push({ type: 'urgency', detail: 'The request is framed with urgency', severity: 'medium' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'Never share OTPs with unsolicited messages.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      sender: sender || 'Unknown',
      message: message || 'No message provided',
    },
  };
}
