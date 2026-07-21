function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeLegalNotice({ senderName = '', firmName = '', caseNumber = '', courtName = '', recipientName = '', hasCourtSeal = false, hasLawyerDetails = false, asksForPayment = false, asksForPersonalInfo = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([senderName, firmName, caseNumber, courtName, message].join(' '));
  if (asksForPayment) { score += 25; signals.push({ type: 'payment_demand', detail: 'Notice demands payment to resolve the matter', severity: 'critical' }); }
  if (asksForPersonalInfo) { score += 20; signals.push({ type: 'personal_info_request', detail: 'Notice asks for personal or financial details', severity: 'high' }); }
  if (!hasCourtSeal) { score += 15; signals.push({ type: 'no_court_seal', detail: 'Notice does not have an official court seal', severity: 'high' }); }
  if (!hasLawyerDetails) { score += 15; signals.push({ type: 'no_lawyer_details', detail: 'No verifiable lawyer or firm details provided', severity: 'high' }); }
  if (!caseNumber) { score += 10; signals.push({ type: 'no_case_number', detail: 'No case number or reference ID provided', severity: 'medium' }); }
  if (/urgent|immediate|arrest|warrant|contempt|penalty|fine|settle now|last chance/i.test(lowered)) { score += 15; signals.push({ type: 'intimidation', detail: 'Notice uses intimidation or threat language', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Legal notices are sent via registered post, not email or message. Verify with the court directly.', signals, details: { firmName: firmName || 'Unknown', caseNumber: caseNumber || 'Not provided', courtName: courtName || 'Not provided', hasCourtSeal, hasLawyerDetails } };
}

