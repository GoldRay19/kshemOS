import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeOnlineReputation } from '../cyberFeatures/onlineReputationSafety';

export default function OnlineReputationSafetyView() {
  const [hasNegativeContent, setHasNegativeContent] = useState(true); const [hasImpersonation, setHasImpersonation] = useState(false);
  const [hasDoxxing, setHasDoxxing] = useState(false); const [hasReviewManipulation, setHasReviewManipulation] = useState(false);
  const [hasFakeProfiles, setHasFakeProfiles] = useState(true); const [hasDataLeaks, setHasDataLeaks] = useState(true);
  const [monitorsReputation, setMonitorsReputation] = useState(false); const [hasTakenAction, setHasTakenAction] = useState(false);
  const [message, setMessage] = useState(''); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Online Reputation Safety Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check your online reputation safety</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Detect impersonation, doxxing, fake profiles, and negative content affecting your reputation.</p></div>
      <CyberFeatureCard eyebrow="Reputation Check" title="Online reputation risk analysis" description="Toggle the reputation issues you've identified.">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasNegativeContent} onChange={(e) => setHasNegativeContent(e.target.checked)} className="accent-[var(--saffron)]" /> Negative/defamatory content</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasImpersonation} onChange={(e) => setHasImpersonation(e.target.checked)} className="accent-[var(--saffron)]" /> Impersonation accounts</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDoxxing} onChange={(e) => setHasDoxxing(e.target.checked)} className="accent-[var(--saffron)]" /> Doxxing (personal info exposed)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasReviewManipulation} onChange={(e) => setHasReviewManipulation(e.target.checked)} className="accent-[var(--saffron)]" /> Fake/manipulated reviews</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasFakeProfiles} onChange={(e) => setHasFakeProfiles(e.target.checked)} className="accent-[var(--saffron)]" /> Fake profiles using your name</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDataLeaks} onChange={(e) => setHasDataLeaks(e.target.checked)} className="accent-[var(--saffron)]" /> Your data in known leaks</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={monitorsReputation} onChange={(e) => setMonitorsReputation(e.target.checked)} className="accent-[var(--saffron)]" /> Actively monitors reputation</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasTakenAction} onChange={(e) => setHasTakenAction(e.target.checked)} className="accent-[var(--saffron)]" /> Has taken corrective action</label>
        </div>
        <button onClick={() => setResult(analyzeOnlineReputation({ hasNegativeContent, hasImpersonation, hasDoxxing, hasReviewManipulation, hasFakeProfiles, hasDataLeaks, monitorsReputation, hasTakenAction, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check reputation</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

