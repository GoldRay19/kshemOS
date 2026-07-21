function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeMarketplaceListing({ title = '', price = '', sellerRating = 0, hasHistory = false, paymentMethod = '', urgency = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([title, message].join(' '));
  if (urgency) { score += 20; signals.push({ type: 'urgency', detail: 'Listing uses urgency to rush the buyer', severity: 'high' }); }
  if (sellerRating < 3) { score += 20; signals.push({ type: 'low_rating', detail: 'Seller has a low rating or no rating history', severity: 'high' }); }
  if (!hasHistory) { score += 15; signals.push({ type: 'no_history', detail: 'Seller has no transaction or review history', severity: 'medium' }); }
  if (/upi|wallet|advance|deposit|outside|pay before/i.test(lowered)) { score += 15; signals.push({ type: 'risky_payment', detail: 'Asks for non-standard or advance payment', severity: 'medium' }); }
  if (/too good|unbelievable|steal|cheap|below market|must sell/i.test(lowered)) { score += 10; signals.push({ type: 'bait_language', detail: 'Listing uses bait language to attract victims', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Meet in person for cash transactions and avoid advance payments to unknown sellers.', signals, details: { title: title || 'Unknown', price: price || 'Not provided', sellerRating, hasHistory, paymentMethod: paymentMethod || 'Not provided' } };
}

