function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeScreenshotMetadata({ fileName = '', fileSize = '', hasExif = false, hasGPS = false, hasDeviceInfo = false, hasTimestamp = false, hasEdits = false, contentText = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([fileName, contentText].join(' '));
  if (hasGPS) { score += 25; signals.push({ type: 'gps_exposed', detail: 'Screenshot metadata contains GPS location data', severity: 'high' }); }
  if (hasDeviceInfo) { score += 15; signals.push({ type: 'device_exposed', detail: 'Screenshot metadata reveals device model or software', severity: 'medium' }); }
  if (!hasTimestamp) { score += 15; signals.push({ type: 'no_timestamp', detail: 'Screenshot metadata lacks a creation timestamp', severity: 'medium' }); }
  if (hasEdits) { score += 15; signals.push({ type: 'edited', detail: 'Screenshot appears to have been edited or tampered with', severity: 'high' }); }
  if (/otp|password|bank|aadhaar|pan|upi|transaction|payment|cvv|pin|login|credential/i.test(lowered)) { score += 20; signals.push({ type: 'sensitive_content', detail: 'Screenshot contains sensitive information in visible text', severity: 'critical' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Remove metadata (especially GPS and device info) before sharing screenshots publicly.', signals, details: { fileName: fileName || 'Unknown', fileSize: fileSize || 'Unknown', hasExif, hasGPS, hasDeviceInfo, hasTimestamp, hasEdits } };
}

