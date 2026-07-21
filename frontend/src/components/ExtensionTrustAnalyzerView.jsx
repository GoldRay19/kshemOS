import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeExtensionTrust } from '../cyberFeatures/extensionTrustAnalyzer';

export default function ExtensionTrustAnalyzerView() {
  const [name, setName] = useState('Free VPN Pro');
  const [permissions, setPermissions] = useState('tabs, storage, clipboard, history');
  const [publisher, setPublisher] = useState('Unknown Dev');
  const [rating, setRating] = useState(3.2);
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Extension Trust Analyzer</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check if a browser extension is safe</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze extension name, permissions, publisher, and rating for red flags.</p>
      </div>
      <CyberFeatureCard eyebrow="Extension Check" title="Browser extension trust score" description="Enter the extension details to evaluate its trust level.">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Extension name" />
        <input value={permissions} onChange={(e) => setPermissions(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Permissions (comma separated)" />
        <input value={publisher} onChange={(e) => setPublisher(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Publisher" />
        <div className="flex items-center gap-3"><span className="text-sm">Rating:</span><input type="number" min="1" max="5" step="0.1" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-[var(--saffron)]" /> Verified publisher</label>
        <button onClick={() => setResult(analyzeExtensionTrust({ name, permissions: permissions.split(',').map((p) => p.trim()), publisher, rating, verified }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze extension</button>
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

