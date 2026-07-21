import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeWebSafety } from '../cyberFeatures/webSafeAnalyzer';

export default function WebSafeAnalyzerView() {
  const [url, setUrl] = useState('http://example.xyz/login');
  const [wifi, setWifi] = useState('Airport Wi-Fi');
  const [browser, setBrowser] = useState('Chrome');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">WebSafe Analyzer</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Browser safety and public Wi-Fi risk checker</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Assess browsing conditions that can increase the chance of phishing, credential theft, or unsafe transactions.</p>
      </div>
      <CyberFeatureCard eyebrow="Browser context check" title="Assess browser safety" description="This reviews URL security, network context, and privacy considerations.">
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="URL" />
        <input value={wifi} onChange={(e) => setWifi(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Network" />
        <input value={browser} onChange={(e) => setBrowser(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Browser" />
        <button onClick={() => setResult(analyzeWebSafety({ url, wifi, browser }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze browsing context</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
