function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzePrivacyExposure({ publicPosts = 0, sharedLocation = false, sharedContacts = false, publicEmail = false, profileVisibility = 'private' } = {}) {
  const signals = [];
  let score = 0;
  if (publicPosts > 5) { score += 20; signals.push({ type: 'too_many_posts', detail: 'Many public posts expose personal habits or details', severity: 'medium' }); }
  if (sharedLocation) { score += 25; signals.push({ type: 'location_shared', detail: 'Location is publicly shared', severity: 'high' }); }
  if (sharedContacts) { score += 20; signals.push({ type: 'contacts_shared', detail: 'Contacts or address information is exposed', severity: 'high' }); }
  if (publicEmail) { score += 15; signals.push({ type: 'email_public', detail: 'Email address is exposed publicly', severity: 'medium' }); }
  if (profileVisibility === 'public') { score += 15; signals.push({ type: 'public_profile', detail: 'The profile is publicly visible', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Tighten profile privacy and limit what is shared publicly.', signals, details: { publicPosts, sharedLocation, sharedContacts, publicEmail, profileVisibility } };
}
