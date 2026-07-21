function normalize(text) { return (text || '').toLowerCase().trim(); }

export function generatePreparednessReport({ hasIncidentResponsePlan = false, hasDataBackup = false, hasCyberInsurance = false, knowsReportingProcess = false, hasSecuritySoftware = false, hasContactList = false, regularlyUpdatesSoftware = false, hasPasswordManager = false } = {}) {
  const signals = [];
  let score = 0;
  const preparedAreas = [hasIncidentResponsePlan, hasDataBackup, hasCyberInsurance, knowsReportingProcess, hasSecuritySoftware, hasContactList, regularlyUpdatesSoftware, hasPasswordManager].filter(Boolean).length;
  if (preparedAreas < 3) { score += 35; signals.push({ type: 'not_prepared', detail: `Only ${preparedAreas}/8 preparedness areas covered`, severity: 'high' }); }
  if (!hasIncidentResponsePlan) { score += 15; signals.push({ type: 'no_incident_plan', detail: 'No incident response plan in place', severity: 'high' }); }
  if (!hasDataBackup) { score += 12; signals.push({ type: 'no_backup', detail: 'No regular data backup system', severity: 'high' }); }
  if (!knowsReportingProcess) { score += 10; signals.push({ type: 'no_reporting', detail: 'Does not know how to report cyber incidents', severity: 'medium' }); }
  if (!hasSecuritySoftware) { score += 10; signals.push({ type: 'no_security_tools', detail: 'No security software or endpoint protection', severity: 'medium' }); }
  if (!hasContactList) { score += 8; signals.push({ type: 'no_contact_list', detail: 'No emergency contact list for cyber incidents', severity: 'medium' }); }
  if (!regularlyUpdatesSoftware) { score += 5; signals.push({ type: 'no_updates', detail: 'Software updates are not regular', severity: 'medium' }); }
  if (!hasPasswordManager) { score += 5; signals.push({ type: 'no_password_manager', detail: 'No password manager used', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Prepare for cyber incidents by creating a response plan, backing up data, and knowing how to report attacks.', signals, details: { preparednessScore: preparedAreas, totalAreas: 8 } };
}

