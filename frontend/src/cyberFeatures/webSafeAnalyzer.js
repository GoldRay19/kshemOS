function normalize(text) {
  return (text || '').toLowerCase().trim();
}

export function analyzeWebSafety({ url = '', wifi = '', browser = '' } = {}) {
  const text = [url, wifi, browser].join(' ');
  const lowered = normalize(text);
  const signals = [];
  let score = 0;

  if (/http:|localhost|ip address|\.xyz|\.top|\.club/i.test(lowered)) {
    score += 25;
    signals.push({ type: 'unsafe_url', detail: 'The URL uses non-secure or suspicious-looking patterns', severity: 'high' });
  }

  if (/public wifi|free wifi|airport|coffee shop|hotel/i.test(lowered)) {
    score += 15;
    signals.push({ type: 'public_wifi', detail: 'The browsing context uses a public network', severity: 'medium' });
  }

  if (/incognito|private browsing|vpn/i.test(lowered)) {
    score += 5;
    signals.push({ type: 'browser_privacy', detail: 'Browser privacy controls are mentioned as a safeguard', severity: 'low' });
  }

  const finalScore = Math.min(100, score);
  let riskBand = 'low';
  let recommendation = 'Use HTTPS and avoid sensitive transactions on public networks.';
  if (finalScore >= 70) riskBand = 'critical';
  else if (finalScore >= 45) riskBand = 'high';
  else if (finalScore >= 20) riskBand = 'medium';

  return {
    risk_score: finalScore,
    risk_band: riskBand,
    recommendation,
    signals,
    details: {
      url: url || 'Not provided',
      wifi: wifi || 'Not provided',
      browser: browser || 'Unknown',
    },
  };
}
