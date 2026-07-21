function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeFamilySafety({ hasSharedPasswordPolicy = false, hasCyberRules = false, hasParentalControls = false, hasOpenCommunication = false, hasEmergencyPlan = false, familySize = 0, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const missingCount = [!hasSharedPasswordPolicy, !hasCyberRules, !hasParentalControls, !hasOpenCommunication, !hasEmergencyPlan].filter(Boolean).length;
  if (missingCount >= 3) { score += 35; signals.push({ type: 'high_gaps', detail: 'Family cyber safety has significant gaps', severity: 'high' }); }
  if (!hasSharedPasswordPolicy) { score += 15; signals.push({ type: 'no_password_policy', detail: 'No family password sharing or management policy', severity: 'medium' }); }
  if (!hasCyberRules) { score += 15; signals.push({ type: 'no_cyber_rules', detail: 'No agreed cyber safety rules for the household', severity: 'medium' }); }
  if (!hasParentalControls && familySize > 1) { score += 15; signals.push({ type: 'no_parental_controls', detail: 'No parental controls for children in the household', severity: 'high' }); }
  if (!hasOpenCommunication) { score += 10; signals.push({ type: 'no_communication', detail: 'No open communication policy about online risks', severity: 'medium' }); }
  if (!hasEmergencyPlan) { score += 10; signals.push({ type: 'no_emergency_plan', detail: 'No family plan for cyber incident response', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Set up family cyber rules, parental controls, and a shared plan for handling online risks.', signals, details: { familySize, missingAreas: missingCount, hasPasswordPolicy: hasSharedPasswordPolicy } };
}

