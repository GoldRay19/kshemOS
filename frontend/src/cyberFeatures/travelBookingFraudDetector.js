function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeTravelBooking({ bookingId = '', airline = '', hotel = '', amount = '', paymentMethod = '', message = '', urgency = false, askForOTP = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([bookingId, airline, hotel, message].join(' '));
  if (askForOTP) { score += 30; signals.push({ type: 'otp_request', detail: 'Booking asks for OTP or CVV — never required for bookings', severity: 'critical' }); }
  if (urgency) { score += 20; signals.push({ type: 'urgency', detail: 'Booking uses limited-time urgency to rush payment', severity: 'high' }); }
  if (/outside|direct transfer|wallet|crypto|gift card/i.test(lowered)) { score += 20; signals.push({ type: 'nonstandard_payment', detail: 'Uses non-standard payment method outside the platform', severity: 'high' }); }
  if (/free upgrade|exclusive discount|limited seats|last minute/i.test(lowered)) { score += 10; signals.push({ type: 'bait_offer', detail: 'Uses bait offers to lure victims', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Always book through official travel websites and avoid third-party payment requests.', signals, details: { airline: airline || 'Unknown', hotel: hotel || 'Not provided', amount: amount || 'Not provided' } };
}

