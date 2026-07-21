function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeInvoiceFraud({ vendor = '', amount = '', dueDate = '', message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([vendor, amount, dueDate, message].join(' '));
  if (/urgent|immediately|payment now|pay today/i.test(lowered)) { score += 25; signals.push({ type: 'urgency', detail: 'The invoice uses urgency to force payment', severity: 'high' }); }
  if (/bank|upi|wallet|crypto|gift card/i.test(lowered)) { score += 20; signals.push({ type: 'nonstandard_payment', detail: 'The payment method is unusual or risky', severity: 'high' }); }
  if (!amount || Number(amount) <= 0) { score += 15; signals.push({ type: 'missing_amount', detail: 'The invoice amount is missing or invalid', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Cross-check the invoice with the known vendor before paying.', signals, details: { vendor: vendor || 'Unknown', amount: amount || 'Not provided', dueDate: dueDate || 'Not provided' } };
}
