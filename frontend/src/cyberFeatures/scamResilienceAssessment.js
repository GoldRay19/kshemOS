function normalize(text) { return (text || '').toLowerCase().trim(); }

export function assessScamResilience({ recognizesPhishing = false, neverSharesOTP = false, verifiesCaller = false, usesMFA = false, hasStrongPasswords = false, reportsSuspiciousActivity = false, staysInformed = false, pausesBeforeActing = false, hasBeenScammedBefore = false } = {}) {
  const signals = [];
  let score = 0;
  const strongAreas = [recognizesPhishing, neverSharesOTP, verifiesCaller, usesMFA, hasStrongPasswords, reportsSuspiciousActivity, staysInformed, pausesBeforeActing].filter(Boolean).length;
  if (strongAreas < 4) { score += 30; signals.push({ type: 'low_resilience', detail: `Only ${strongAreas}/8 scam resilience traits are strong`, severity: 'high' }); }
  if (hasBeenScammedBefore) { score += 15; signals.push({ type: 'previous_victim', detail: 'Has been scammed before — higher risk of repeat targeting', severity: 'high' }); }
  if (!neverSharesOTP) { score += 15; signals.push({ type: 'shares_otp', detail: 'Would share OTP under pressure — critical vulnerability', severity: 'critical' }); }
  if (!verifiesCaller) { score += 12; signals.push({ type: 'no_verification', detail: 'Does not independently verify caller identity', severity: 'high' }); }
  if (!pausesBeforeActing) { score += 12; signals.push({ type: 'impulsive', detail: 'Tends to act quickly without verifying', severity: 'medium' }); }
  if (!recognizesPhishing) { score += 10; signals.push({ type: 'no_phishing_awareness', detail: 'Cannot recognize common phishing attempts', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Build scam resilience by practicing the pause, verifying callers, and never sharing OTPs.', signals, details: { strongTraitsCount: strongAreas, totalTraits: 8, hasBeenScammedBefore } };
}

