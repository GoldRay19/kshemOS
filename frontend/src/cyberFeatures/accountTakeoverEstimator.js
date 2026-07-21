function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeAccountTakeoverRisk({ hasMFA = false, hasStrongPassword = false, hasRecentBreach = false, hasSuspiciousLogin = false, sharedPasswordElsewhere = false, accountAge = 0, hasRecoveryEmail = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (!hasMFA) { score += 25; signals.push({ type: 'no_mfa', detail: 'Multi-factor authentication is not enabled', severity: 'critical' }); }
  if (!hasStrongPassword) { score += 20; signals.push({ type: 'weak_password', detail: 'Password is weak or commonly used', severity: 'high' }); }
  if (sharedPasswordElsewhere) { score += 20; signals.push({ type: 'shared_password', detail: 'Password is reused across multiple platforms', severity: 'high' }); }
  if (hasSuspiciousLogin) { score += 15; signals.push({ type: 'suspicious_login', detail: 'Suspicious login activity has been detected recently', severity: 'high' }); }
  if (hasRecentBreach) { score += 10; signals.push({ type: 'recent_breach', detail: 'Account was part of a recent data breach', severity: 'high' }); }
  if (!hasRecoveryEmail) { score += 10; signals.push({ type: 'no_recovery', detail: 'No recovery email or phone configured for account', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Enable MFA, use unique strong passwords, and set up recovery options immediately.', signals, details: { hasMFA, hasStrongPassword, hasRecentBreach, hasSuspiciousLogin, sharedPasswordElsewhere, accountAge, hasRecoveryEmail } };
}

