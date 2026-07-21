function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeDigitalInheritance({ hasWill = false, hasExecutor = false, hasPasswordManager = false, hasDigitalAssetList = false, hasBeneficiaryInfo = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (!hasWill) { score += 25; signals.push({ type: 'no_will', detail: 'No digital will or inheritance plan exists', severity: 'high' }); }
  if (!hasExecutor) { score += 20; signals.push({ type: 'no_executor', detail: 'No executor assigned for digital assets', severity: 'high' }); }
  if (!hasDigitalAssetList) { score += 20; signals.push({ type: 'no_asset_list', detail: 'No inventory of digital assets (accounts, crypto, subscriptions)', severity: 'high' }); }
  if (!hasPasswordManager) { score += 15; signals.push({ type: 'no_password_manager', detail: 'No secure password sharing plan for heirs', severity: 'medium' }); }
  if (!hasBeneficiaryInfo) { score += 10; signals.push({ type: 'no_beneficiary', detail: 'No beneficiary information documented for digital accounts', severity: 'medium' }); }
  if (/inheritance|claim|fee|legal|processing|advance/i.test(lowered)) { score += 10; signals.push({ type: 'scam_language', detail: 'Message uses inheritance scam language patterns', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Document your digital assets, assign an executor, and store credentials securely for your heirs.', signals, details: { preparedness: { hasWill, hasExecutor, hasPasswordManager, hasDigitalAssetList, hasBeneficiaryInfo } } };
}

