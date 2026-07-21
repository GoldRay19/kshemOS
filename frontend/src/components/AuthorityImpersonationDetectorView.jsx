import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeAuthorityImpersonation } from '../cyberFeatures/authorityImpersonationDetector';

export default function AuthorityImpersonationDetectorView() {
  const [message, setMessage] = useState('This is the Income Tax Department. Your PAN has been used in illegal transactions. Pay the penalty now to avoid arrest.');
  const [claimedOrg, setClaimedOrg] = useState('Income Tax Department');
  const [requestedAction, setRequestedAction] = useState('Pay penalty via UPI');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Authority Impersonation Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Detect fake authority impersonation</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers pretend to be government agencies, banks, or police. This tool flags those attempts.</p>
      </div>
      <CyberFeatureCard eyebrow="Auth Check" title="Authority impersonation analysis" description="Enter the message and the organization it claims to be from.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message content" />
        <input value={claimedOrg} onChange={(e) => setClaimedOrg(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Claimed organization" />
        <input value={requestedAction} onChange={(e) => setRequestedAction(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Requested action" />
        <button onClick={() => setResult(analyzeAuthorityImpersonation({ message, claimedOrg, requestedAction }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Detect impersonation</button>
        {result && (
          <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm">
            <div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div>
            <p className="font-semibold">{result.recommendation}</p>
            <ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul>
          </div>
        )}
      </CyberFeatureCard>
    </div>
  );
}

