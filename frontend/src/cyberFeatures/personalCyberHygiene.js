function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeCyberHygiene({ usesPasswordManager = false, changesPasswordsRegularly = false, usesMFAOnAllAccounts = false, avoidsPublicWiFi = false, updatesSoftware = false, reviewsPermissions = false, logsOutOfSessions = false, avoidsSharingOTP = false } = {}) {
  const signals = [];
  let score = 0;
  const goodHabits = [usesPasswordManager, changesPasswordsRegularly, usesMFAOnAllAccounts, avoidsPublicWiFi, updatesSoftware, reviewsPermissions, logsOutOfSessions, avoidsSharingOTP].filter(Boolean).length;
  if (goodHabits < 4) { score += 35; signals.push({ type: 'poor_hygiene', detail: `Only ${goodHabits}/8 good cyber hygiene habits followed`, severity: 'high' }); }
  if (!usesPasswordManager) { score += 12; signals.push({ type: 'no_password_manager', detail: 'Not using a password manager', severity: 'medium' }); }
  if (!usesMFAOnAllAccounts) { score += 12; signals.push({ type: 'no_mfa', detail: 'MFA not enabled on all accounts', severity: 'high' }); }
  if (!updatesSoftware) { score += 10; signals.push({ type: 'no_updates', detail: 'Software updates are not regularly applied', severity: 'medium' }); }
  if (!avoidsSharingOTP) { score += 10; signals.push({ type: 'shares_otp', detail: 'OTP sharing awareness is low', severity: 'high' }); }
  if (!avoidsPublicWiFi) { score += 8; signals.push({ type: 'public_wifi', detail: 'Uses public WiFi without precautions', severity: 'medium' }); }
  if (!reviewsPermissions) { score += 8; signals.push({ type: 'no_permission_review', detail: 'App permissions are not regularly reviewed', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Build strong cyber hygiene: use a password manager, enable MFA, update software, and never share OTPs.', signals, details: { goodHabitsCount: goodHabits, totalHabits: 8 } };
}

