function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeStudentScamRisk({ message = '', offerType = '', asksForFee = false, asksForPersonalInfo = false, asksForOTP = false, urgency = false, platform = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([message, offerType, platform].join(' '));
  if (asksForFee) { score += 25; signals.push({ type: 'fee_request', detail: 'Asks for upfront fee — legit educational offers never do', severity: 'high' }); }
  if (asksForOTP) { score += 25; signals.push({ type: 'otp_request', detail: 'Asks for OTP or password — classic credential harvesting', severity: 'critical' }); }
  if (asksForPersonalInfo) { score += 20; signals.push({ type: 'personal_info', detail: 'Requests personal documents or ID details', severity: 'high' }); }
  if (urgency) { score += 15; signals.push({ type: 'urgency', detail: 'Uses limited-time pressure to rush the student', severity: 'medium' }); }
  if (/scholarship|internship|work from home|easy money|part time|data entry|online job|guaranteed/i.test(lowered)) { score += 15; signals.push({ type: 'student_bait', detail: 'Uses common student-targeted bait phrases', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Never pay for internships, scholarships, or job offers. Verify through official college or career channels.', signals, details: { offerType: offerType || 'Unknown', platform: platform || 'Unknown', asksForFee, asksForPersonalInfo, asksForOTP } };
}

