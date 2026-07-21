function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeScreenSharing({ isSharing = false, includesSensitiveContent = false, app = '', context = '' } = {}) {
  const text = normalize([app, context].join(' '));
  const signals = [];
  let score = 0;
  if (isSharing) { score += 20; signals.push({ type: 'active_screen_share', detail: 'Screen sharing is currently active', severity: 'medium' }); }
  if (includesSensitiveContent) { score += 35; signals.push({ type: 'sensitive_content', detail: 'Shared content likely contains private or financial information', severity: 'high' }); }
  if (/bank|account|password|otp|chat|email|document|invoice|receipt/i.test(text)) { score += 20; signals.push({ type: 'suspicious_context', detail: 'The sharing context includes sensitive material', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Pause sharing and close sensitive tabs before presenting your screen.', signals, details: { app: app || 'Unknown', context: context || 'Not specified' } };
}
