function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzePaymentReceipt({ merchantName = '', amount = '', transactionId = '', date = '', paymentMethod = '', hasQRCode = false, hasBankDetails = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([merchantName, transactionId, message].join(' '));
  if (!transactionId) { score += 25; signals.push({ type: 'no_transaction_id', detail: 'Receipt lacks a valid transaction or reference ID', severity: 'high' }); }
  if (!merchantName) { score += 20; signals.push({ type: 'no_merchant_name', detail: 'Receipt does not clearly identify the merchant', severity: 'high' }); }
  if (/personal|individual|cash|upi|wallet|gift/i.test(lowered)) { score += 15; signals.push({ type: 'unofficial_payment', detail: 'Receipt uses unofficial or non-standard payment description', severity: 'medium' }); }
  if (/refund|overpayment|claim|extra|cashback|bonus|discount|offer/i.test(lowered)) { score += 15; signals.push({ type: 'refund_bait', detail: 'Receipt references refunds or overpayments to lure victim', severity: 'high' }); }
  if (!hasBankDetails && !hasQRCode) { score += 10; signals.push({ type: 'no_payment_details', detail: 'Receipt lacks clear bank or QR payment details', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Cross-check payment receipts with your bank statement or payment app history.', signals, details: { merchantName: merchantName || 'Unknown', amount: amount || 'Not provided', transactionId: transactionId || 'Not provided', paymentMethod: paymentMethod || 'Not provided' } };
}

