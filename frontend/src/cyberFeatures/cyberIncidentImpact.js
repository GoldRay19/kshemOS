function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeIncidentImpact({ incidentType = '', dataLoss = false, moneyAtRisk = false, devicesAffected = 0, accountsAffected = 0 } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(incidentType);
  if (dataLoss) { score += 25; signals.push({ type: 'data_loss', detail: 'The incident may result in data loss', severity: 'high' }); }
  if (moneyAtRisk) { score += 25; signals.push({ type: 'financial_risk', detail: 'Money or banking access may be at risk', severity: 'high' }); }
  if (devicesAffected >= 2) { score += 15; signals.push({ type: 'multiple_devices', detail: 'Multiple devices appear to be affected', severity: 'medium' }); }
  if (accountsAffected >= 2) { score += 15; signals.push({ type: 'multiple_accounts', detail: 'Multiple accounts appear to be affected', severity: 'medium' }); }
  if (/identity|bank|payment|otp/i.test(lowered)) { score += 10; signals.push({ type: 'sensitive_context', detail: 'The incident touches sensitive identity or payment data', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Treat the incident as urgent and preserve evidence immediately.', signals, details: { incidentType: incidentType || 'Unknown', dataLoss, moneyAtRisk, devicesAffected, accountsAffected } };
}
