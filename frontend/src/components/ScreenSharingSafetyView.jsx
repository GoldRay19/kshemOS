import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeScreenSharing } from '../cyberFeatures/screenSharingSafety';

export default function ScreenSharingSafetyView() {
  const [isSharing, setIsSharing] = useState(true);
  const [includesSensitiveContent, setIncludesSensitiveContent] = useState(false);
  const [app, setApp] = useState('Zoom');
  const [context, setContext] = useState('Bank account overview');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Screen Sharing Safety Advisor</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Assess screen sharing risks</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check what content is being shared and whether sensitive data might be exposed.</p>
      </div>
      <CyberFeatureCard eyebrow="Sharing Audit" title="Screen sharing safety check" description="Toggle the sharing context to evaluate exposure.">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isSharing} onChange={(e) => setIsSharing(e.target.checked)} className="accent-[var(--saffron)]" /> Screen sharing is active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includesSensitiveContent} onChange={(e) => setIncludesSensitiveContent(e.target.checked)} className="accent-[var(--saffron)]" /> Sensitive content visible</label>
        <input value={app} onChange={(e) => setApp(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="App" />
        <input value={context} onChange={(e) => setContext(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Context" />
        <button onClick={() => setResult(analyzeScreenSharing({ isSharing, includesSensitiveContent, app, context }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess risk</button>
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

