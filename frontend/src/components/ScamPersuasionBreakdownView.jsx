import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzePersuasionBreakdown } from '../cyberFeatures/scamPersuasionBreakdown';

export default function ScamPersuasionBreakdownView() {
  const [message, setMessage] = useState('This is the Cyber Crime Department. Your account is flagged. Others have already complied. Call us immediately at the number below.');
  const [authorityClaim, setAuthorityClaim] = useState(true); const [scarcityClaim, setScarcityClaim] = useState(true);
  const [socialProofClaim, setSocialProofClaim] = useState(true); const [reciprocityClaim, setReciprocityClaim] = useState(false);
  const [commitmentClaim, setCommitmentClaim] = useState(false); const [likingClaim, setLikingClaim] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Scam Persuasion Technique Breakdown</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Break down the persuasion tactics in a scam</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze which Cialdini-style persuasion techniques a scam message is using.</p></div>
      <CyberFeatureCard eyebrow="Persuasion Check" title="Persuasion technique analysis" description="Toggle the techniques you observe in the message.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={authorityClaim} onChange={(e) => setAuthorityClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Authority (govt, police, bank)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={scarcityClaim} onChange={(e) => setScarcityClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Scarcity (limited time)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={socialProofClaim} onChange={(e) => setSocialProofClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Social proof (others complied)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={reciprocityClaim} onChange={(e) => setReciprocityClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Reciprocity (free gift)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={commitmentClaim} onChange={(e) => setCommitmentClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Commitment (past promise)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={likingClaim} onChange={(e) => setLikingClaim(e.target.checked)} className="accent-[var(--saffron)]" /> Liking (flattery/rapport)</label>
        </div>
        <button onClick={() => setResult(analyzePersuasionBreakdown({ message, authorityClaim, scarcityClaim, socialProofClaim, reciprocityClaim, commitmentClaim, likingClaim }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Break down techniques</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

