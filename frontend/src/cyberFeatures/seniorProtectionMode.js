function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeSeniorRisk({ message = '', callerClaim = '', asksForOTP = false, asksForMoney = false, asksForPersonalInfo = false, asksForRemoteAccess = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([message, callerClaim].join(' '));
  if (asksForOTP) { score += 30; signals.push({ type: 'otp_request', detail: 'Caller is asking for OTP — seniors should never share OTPs', severity: 'critical' }); }
  if (asksForMoney) { score += 25; signals.push({ type: 'money_request', detail: 'Caller is asking for money or payment', severity: 'critical' }); }
  if (asksForRemoteAccess) { score += 25; signals.push({ type: 'remote_access', detail: 'Caller is asking for remote device access', severity: 'critical' }); }
  if (asksForPersonalInfo) { score += 20; signals.push({ type: 'personal_info', detail: 'Caller is asking for Aadhaar, PAN, or bank details', severity: 'high' }); }
  if (/police|cbi|court|bank|income tax|customs|government|official|arrest|warrant|digital arrest|parcel/i.test(lowered)) { score += 15; signals.push({ type: 'authority_pressure', detail: 'Caller claims to be from a government or law enforcement agency', severity: 'high' }); }
  if (/son|daughter|grandson|granddaughter|nephew|niece|family|relative|friend|emergency|accident|hospital/i.test(lowered)) { score += 15; signals.push({ type: 'family_emergency', detail: 'Caller claims a family emergency to exploit trust', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Seniors should never share OTPs, money, or remote access with unexpected callers. Hang up and call a trusted family member.', signals, details: { callerClaim: callerClaim || 'Unknown', asksForOTP, asksForMoney, asksForPersonalInfo, asksForRemoteAccess } };
}

