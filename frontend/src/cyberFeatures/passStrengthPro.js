function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzePasswordStrength(password) {
  const value = password || '';
  const lowered = normalize(value);
  const signals = [];
  let score = 0;

  if (value.length < 8) {
    score += 30;
    signals.push({ type: 'short_password', detail: 'Password is shorter than 8 characters', severity: 'high' });
  }

  if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*]/.test(value)) {
    score += 20;
    signals.push({ type: 'weak_complexity', detail: 'Password lacks uppercase, number, or symbol diversity', severity: 'medium' });
  }

  if (['password', '123456', 'qwerty', 'admin', 'welcome'].some((term) => lowered.includes(term))) {
    score += 25;
    signals.push({ type: 'common_password', detail: 'Password is commonly used or predictable', severity: 'high' });
  }

  if (value.length >= 14 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value)) {
    score -= 25;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let riskBand = 'low';
  let recommendation = 'This password is strong enough for everyday use.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      length: value.length,
      has_uppercase: /[A-Z]/.test(value),
      has_number: /[0-9]/.test(value),
      has_symbol: /[!@#$%^&*]/.test(value),
    },
  };
}
