function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeGovernmentNotice({ department = '', noticeId = '', recipientName = '', amount = '', dueDate = '', hasSeal = false, hasSignature = false, asksForPayment = false, asksForOTP = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([department, noticeId, recipientName, message].join(' '));
  if (asksForPayment) { score += 25; signals.push({ type: 'payment_request', detail: 'Notice asks for immediate payment — government never demands instant payment', severity: 'critical' }); }
  if (asksForOTP) { score += 30; signals.push({ type: 'otp_request', detail: 'Notice asks for OTP or bank details — official notices never do', severity: 'critical' }); }
  if (!hasSeal) { score += 15; signals.push({ type: 'no_official_seal', detail: 'Notice lacks an official government seal or watermark', severity: 'high' }); }
  if (!hasSignature) { score += 10; signals.push({ type: 'no_signature', detail: 'Notice lacks an authorized signatory', severity: 'medium' }); }
  if (/urgent|immediate|final notice|legal action|arrest|penalty|fine|blocked|suspend/i.test(lowered)) { score += 15; signals.push({ type: 'threat_language', detail: 'Notice uses threat language to create panic', severity: 'high' }); }
  if (/upi|wallet|gift card|crypto|personal account/i.test(lowered)) { score += 10; signals.push({ type: 'unofficial_payment', detail: 'Payment is to be made through unofficial channels', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Government agencies never ask for immediate payment, OTPs, or bank details through notices. Verify on the official website.', signals, details: { department: department || 'Unknown', noticeId: noticeId || 'Not provided', hasSeal, hasSignature } };
}

