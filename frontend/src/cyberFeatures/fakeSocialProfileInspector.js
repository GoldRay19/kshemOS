function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzeSocialProfile({ username = '', bio = '', followers = 0, verified = false, profilePhoto = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize([username, bio].join(' '));
  if (!verified) { score += 15; signals.push({ type: 'unverified_profile', detail: 'The profile is not verified or lacks trust signals', severity: 'medium' }); }
  if (/free|gift|cash|crypto|offer|prize|winner|money/i.test(lowered)) { score += 25; signals.push({ type: 'bait_words', detail: 'The bio or handle uses reward or money bait language', severity: 'high' }); }
  if (followers < 100) { score += 10; signals.push({ type: 'low_followers', detail: 'The profile has a very small footprint', severity: 'medium' }); }
  if (!profilePhoto) { score += 8; signals.push({ type: 'no_photo', detail: 'The profile lacks a profile image', severity: 'low' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Inspect public profiles carefully before interacting or sharing information.', signals, details: { username, followers, verified, profilePhoto } };
}
