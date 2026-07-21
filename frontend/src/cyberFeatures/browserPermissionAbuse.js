function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeBrowserPermissions({ camera = false, microphone = false, location = false, notifications = false, clipboard = false, screenShare = false } = {}) {
  const signals = [];
  let score = 0;
  const enabled = [camera, microphone, location, notifications, clipboard, screenShare].filter(Boolean).length;
  if (enabled >= 4) { score += 45; signals.push({ type: 'overbroad_permissions', detail: 'Many sensitive permissions are enabled at once', severity: 'high' }); }
  if (camera) { score += 12; signals.push({ type: 'camera_access', detail: 'Camera permission is enabled', severity: 'medium' }); }
  if (microphone) { score += 12; signals.push({ type: 'microphone_access', detail: 'Microphone permission is enabled', severity: 'medium' }); }
  if (location) { score += 10; signals.push({ type: 'location_access', detail: 'Location permission is enabled', severity: 'medium' }); }
  if (notifications) { score += 8; signals.push({ type: 'notification_access', detail: 'Notifications are allowed', severity: 'low' }); }
  if (clipboard) { score += 10; signals.push({ type: 'clipboard_access', detail: 'Clipboard access is allowed', severity: 'high' }); }
  if (screenShare) { score += 15; signals.push({ type: 'screen_share', detail: 'Screen sharing permission is enabled', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Review which permissions are really necessary and keep sensitive access disabled by default.', signals, details: { enabledPermissions: enabled } };
}
