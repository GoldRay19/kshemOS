function normalize(text) { return (text || '').toLowerCase().trim(); }

export function analyzePersuasionBreakdown({ message = '', authorityClaim = false, scarcityClaim = false, socialProofClaim = false, reciprocityClaim = false, commitmentClaim = false, likingClaim = false } = {}) {
  const signals = [];
  let score = 0;
  const lowered = normalize(message);
  if (authorityClaim) { score += 20; signals.push({ type: 'authority', detail: 'Uses authority to compel action (police, bank, government)', severity: 'high' }); }
  if (scarcityClaim) { score += 18; signals.push({ type: 'scarcity', detail: 'Uses scarcity or limited-time pressure to rush decision', severity: 'high' }); }
  if (socialProofClaim) { score += 15; signals.push({ type: 'social_proof', detail: 'Claims others have already participated or benefited', severity: 'medium' }); }
  if (reciprocityClaim) { score += 15; signals.push({ type: 'reciprocity', detail: 'Offers something free to create a sense of obligation', severity: 'medium' }); }
  if (commitmentClaim) { score += 12; signals.push({ type: 'commitment', detail: 'References past actions or promises to build consistency pressure', severity: 'medium' }); }
  if (likingClaim) { score += 10; signals.push({ type: 'liking', detail: 'Uses flattery or similarity to build false rapport', severity: 'medium' }); }
  if (/official|government|police|cbi|court|bank|urgent|limited|exclusive|only today|everyone|thousands|free gift|special offer|as a loyal/i.test(lowered)) { score += 10; signals.push({ type: 'persuasion_phrases', detail: 'Message contains classic persuasion technique phrases', severity: 'medium' }); }
  const finalScore = Math.min(100, score);
  return { risk_score: finalScore, risk_band: finalScore >= 60 ? 'high' : finalScore >= 25 ? 'medium' : 'low', recommendation: 'Recognize that scammers exploit psychological triggers. Verify independently before acting.', signals, details: { authorityClaim, scarcityClaim, socialProofClaim, reciprocityClaim, commitmentClaim, likingClaim } };
}

