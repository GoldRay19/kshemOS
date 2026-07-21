function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeWebcamMic({ camera = false, microphone = false, browser = '', reason = '' } = {}) {
  const text = normalize(reason);
  const signals = [];
  let score = 0;
  if (camera) { score += 20; signals.push({ type: 'camera_enabled', detail: 'Camera access is enabled', severity: 'medium' }); }
  if (microphone) { score += 20; signals.push({ type: 'microphone_enabled', detail: 'Microphone access is enabled', severity: 'medium' }); }
  if (/meeting|interview|call|record/i.test(text)) { score += 15; signals.push({ type: 'sensitive_context', detail: 'The usage context is likely sensitive', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Only allow camera and microphone access when the purpose is clear and trusted.', signals, details: { browser: browser || 'Unknown', reason: reason || 'Not provided' } };
}
