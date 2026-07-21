function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeDeviceChecklist({ screenLock = false, updates = false, antivirus = false, backup = false, vpn = false, mfa = false } = {}) {
  const signals = [];
  let score = 0;
  const enabled = [screenLock, updates, antivirus, backup, vpn, mfa].filter(Boolean).length;
  if (enabled < 3) { score += 40; signals.push({ type: 'weak_hygiene', detail: 'The device setup is missing several core protections', severity: 'high' }); }
  if (!screenLock) { score += 12; signals.push({ type: 'no_screen_lock', detail: 'Screen lock is not enabled', severity: 'medium' }); }
  if (!updates) { score += 10; signals.push({ type: 'outdated_system', detail: 'System updates are not enabled', severity: 'medium' }); }
  if (!antivirus) { score += 10; signals.push({ type: 'no_antivirus', detail: 'Antivirus or security tooling is missing', severity: 'medium' }); }
  if (!backup) { score += 8; signals.push({ type: 'no_backup', detail: 'Data backup is not enabled', severity: 'medium' }); }
  if (!mfa) { score += 10; signals.push({ type: 'no_mfa', detail: 'Multi-factor authentication is not enabled', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Improve the device baseline by enabling a lock screen, updates, backup, and MFA.', signals, details: { enabledCount: enabled } };
}
