function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeMFAReadiness({ hasMFA = false, mfaType = '', usesAuthenticatorApp = false, usesSMS = false, usesBiometrics = false, hasBackupCodes = false, hasMultipleMFA = false, accountsWithoutMFA = 0 } = {}) {
  const signals = [];
  let score = 0;
  if (!hasMFA) { score += 40; signals.push({ type: 'no_mfa', detail: 'MFA is not enabled at all — highest risk', severity: 'critical' }); }
  if (accountsWithoutMFA >= 3) { score += 20; signals.push({ type: 'multiple_no_mfa', detail: `Accounts without MFA: ${accountsWithoutMFA}`, severity: 'high' }); }
  if (hasMFA && usesSMS && !usesAuthenticatorApp) { score += 15; signals.push({ type: 'sms_only_mfa', detail: 'MFA uses SMS which is vulnerable to SIM-swap attacks', severity: 'medium' }); }
  if (!hasBackupCodes && hasMFA) { score += 10; signals.push({ type: 'no_backup_codes', detail: 'No backup codes stored for MFA recovery', severity: 'medium' }); }
  if (!hasMultipleMFA && hasMFA) { score += 10; signals.push({ type: 'single_mfa', detail: 'Only one MFA method configured', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Enable MFA on all accounts, prefer authenticator apps over SMS, and store backup codes safely.', signals, details: { hasMFA, mfaType: mfaType || 'None', usesAuthenticatorApp, usesSMS, usesBiometrics, hasBackupCodes, hasMultipleMFA, accountsWithoutMFA } };
}

