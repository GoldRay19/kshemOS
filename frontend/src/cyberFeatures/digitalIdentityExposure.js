function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeIdentityExposure({ leaks = [], publicProfiles = [], socialAccounts = [], phoneNumber = '' } = {}) {
  const signals = [];
  let score = 0;
  const leakCount = leaks.length || 0;
  if (leakCount >= 3) { score += 35; signals.push({ type: 'multiple_leaks', detail: 'Several likely data leaks are present', severity: 'high' }); }
  if (publicProfiles.length >= 2) { score += 20; signals.push({ type: 'public_profiles', detail: 'Multiple public profiles are exposing personal information', severity: 'medium' }); }
  if (socialAccounts.length >= 3) { score += 15; signals.push({ type: 'many_accounts', detail: 'A large number of social accounts increase exposure', severity: 'medium' }); }
  if (phoneNumber) { score += 10; signals.push({ type: 'phone_shared', detail: 'A phone number is exposed in the profile set', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Reduce public exposure by tightening privacy settings and monitoring data leaks.', signals, details: { leakCount, publicProfiles: publicProfiles.length, socialAccounts: socialAccounts.length, phoneNumber: phoneNumber || 'Not provided' } };
}
