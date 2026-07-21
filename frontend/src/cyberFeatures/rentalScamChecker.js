function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeRentalListing({ title = '', price = '', deposit = '', location = '', landlordName = '', hasPhotos = false, asksForAdvance = false, urgency = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([title, location, landlordName, message].join(' '));
  if (asksForAdvance) { score += 30; signals.push({ type: 'advance_fee', detail: 'Landlord asks for advance payment before showing the property', severity: 'critical' }); }
  if (urgency) { score += 20; signals.push({ type: 'urgency', detail: 'Listing uses urgency to rush a decision without viewing', severity: 'high' }); }
  if (!hasPhotos) { score += 15; signals.push({ type: 'no_photos', detail: 'No photos or virtual tour available for the listing', severity: 'medium' }); }
  if (/below market|too good|overseas|abroad|can't visit|agent|broker fee/i.test(lowered)) { score += 15; signals.push({ type: 'bait_language', detail: 'Listing uses bait language or claims landlord is abroad', severity: 'medium' }); }
  if (deposit && Number(deposit.replace(/[^0-9]/g, '')) > 50000) { score += 10; signals.push({ type: 'high_deposit', detail: 'Deposit amount is unusually high', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Always visit the property in person before paying any deposit or advance fee.', signals, details: { title: title || 'Unknown', price: price || 'Not provided', location: location || 'Not provided', hasPhotos } };
}

