function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeDocumentConsistency({ fileName = '', fileType = '', claimedContent = '', actualContent = '', hasDigitalSignature = false, createdDate = '', modifiedDate = '', authorName = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([fileName, claimedContent, actualContent, authorName].join(' '));
  const claimedNorm = normalize(claimedContent);
  const actualNorm = normalize(actualContent);
  if (claimedNorm && actualNorm && claimedNorm !== actualNorm) { score += 30; signals.push({ type: 'content_mismatch', detail: 'Claimed document content does not match actual content', severity: 'critical' }); }
  if (!hasDigitalSignature) { score += 20; signals.push({ type: 'no_signature', detail: 'Document lacks a valid digital signature', severity: 'high' }); }
  if (createdDate && modifiedDate && createdDate !== modifiedDate) { score += 15; signals.push({ type: 'date_mismatch', detail: 'Created and modified dates are inconsistent', severity: 'medium' }); }
  if (/bank|otp|aadhaar|pan|payment|transfer|urgent|verify|notice|fine|legal/i.test(lowered)) { score += 15; signals.push({ type: 'suspicious_terms', detail: 'Document contains suspicious or scam-related terms', severity: 'medium' }); }
  if (/copy|fake|scam|tamper|unauthorized|illegal/i.test(lowered)) { score += 10; signals.push({ type: 'tamper_language', detail: 'Document references tampering or unauthorized access', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Verify digital documents through the official issuer. Check for digital signatures and metadata consistency.', signals, details: { fileName: fileName || 'Unknown', fileType: fileType || 'Unknown', hasDigitalSignature, authorName: authorName || 'Unknown' } };
}

