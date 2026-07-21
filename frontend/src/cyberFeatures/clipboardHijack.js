function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeClipboardRisk({ copiedText = '', hasClipboardAccess = false, browser = '' } = {}) {
  const text = normalize(copiedText);
  const signals = [];
  let score = 0;
  if (hasClipboardAccess) { score += 35; signals.push({ type: 'clipboard_access', detail: 'The app can read clipboard data', severity: 'high' }); }
  if (/otp|password|bank|upi|aadhaar|pan|secret|token/i.test(text)) { score += 35; signals.push({ type: 'sensitive_clipboard', detail: 'Clipboard contains sensitive credential-like content', severity: 'high' }); }
  if (/http|https|verify|login|reset/i.test(text)) { score += 10; signals.push({ type: 'suspicious_content', detail: 'Clipboard content looks like a credential or login prompt', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Avoid pasting sensitive information into unknown sites or extensions.', signals, details: { browser: browser || 'Unknown', copiedTextLength: copiedText.length } };
}
