function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeFakeDocument({ title = '', issuer = '', watermark = '', metadata = '', text = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([title, issuer, watermark, metadata, text].join(' '));
  if (!watermark) { score += 20; signals.push({ type: 'no_watermark', detail: 'Document lacks visible watermarking', severity: 'medium' }); }
  if (/fake|urgent|verify now|download|claim/i.test(lowered)) { score += 25; signals.push({ type: 'suspicious_language', detail: 'The document uses urgency or claim-like wording', severity: 'high' }); }
  if (/scan|pdf|image/i.test(lowered) && !metadata) { score += 15; signals.push({ type: 'missing_metadata', detail: 'The file metadata is missing or weak', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Verify the document with its original issuer before trusting it.', signals, details: { title, issuer, watermark: watermark || 'Not provided', metadata: metadata || 'Not provided' } };
}
