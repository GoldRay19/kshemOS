function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeDeliveryScam({ trackingId = '', courierName = '', deliveryAddress = '', amountDue = '', message = '', asksForPayment = false, asksForOTP = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([trackingId, courierName, deliveryAddress, message].join(' '));
  if (asksForPayment) { score += 25; signals.push({ type: 'payment_request', detail: 'Delivery notification asks for payment before release', severity: 'high' }); }
  if (asksForOTP) { score += 25; signals.push({ type: 'otp_request', detail: 'Delivery asks for OTP or personal verification code', severity: 'critical' }); }
  if (/customs|custom|seized|held|blocked|fine|penalty|import/i.test(lowered)) { score += 20; signals.push({ type: 'customs_threat', detail: 'Mentions customs issues or penalties to create urgency', severity: 'high' }); }
  if (/wrong address|incorrect|update|confirm|reschedule/i.test(lowered)) { score += 10; signals.push({ type: 'address_confusion', detail: 'Claims address issue to extract personal details', severity: 'medium' }); }
  if (!trackingId || !courierName) { score += 10; signals.push({ type: 'vague_details', detail: 'Delivery lacks specific tracking or courier details', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Verify delivery status directly on the official courier website before making any payment.', signals, details: { courierName: courierName || 'Unknown', trackingId: trackingId || 'Not provided', amountDue: amountDue || 'Not provided' } };
}

