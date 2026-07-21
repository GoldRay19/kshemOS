function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeChildrenOnlineRisk({ childAge = 0, hasParentalControls = false, hasScreenTimeLimits = false, hasContentFilters = false, hasLocationTracking = false, hasOnlineActivityLogs = false, hasSafeSearch = false, message = '' } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  const protectionsOn = [hasParentalControls, hasScreenTimeLimits, hasContentFilters, hasLocationTracking, hasOnlineActivityLogs, hasSafeSearch].filter(Boolean).length;
  if (protectionsOn < 4) { score += 30; signals.push({ type: 'low_protection', detail: 'Child has fewer than 4 online safety protections active', severity: 'high' }); }
  if (!hasParentalControls) { score += 15; signals.push({ type: 'no_parental_controls', detail: 'No parental control software installed', severity: 'high' }); }
  if (!hasScreenTimeLimits) { score += 12; signals.push({ type: 'no_screen_time', detail: 'No screen time limits configured', severity: 'medium' }); }
  if (!hasContentFilters) { score += 12; signals.push({ type: 'no_content_filters', detail: 'No content or age-appropriate filters enabled', severity: 'medium' }); }
  if (!hasSafeSearch) { score += 10; signals.push({ type: 'no_safe_search', detail: 'Safe search is not enforced on browsers', severity: 'medium' }); }
  if (!hasLocationTracking && childAge < 13) { score += 10; signals.push({ type: 'no_location', detail: 'No location tracking for younger children', severity: 'medium' }); }
  if (/free|friend request|gift|prize|win|click|download|private/i.test(lowered)) { score += 11; signals.push({ type: 'predator_bait', detail: 'Message contains language often used by online predators', severity: 'high' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Ensure strong parental controls, content filters, and open conversations about online safety.', signals, details: { childAge, protectionsActive: protectionsOn, totalProtections: 6 } };
}

