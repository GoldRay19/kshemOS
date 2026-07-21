import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeClipboardRisk } from '../cyberFeatures/clipboardHijack';

export default function ClipboardHijackView() {
  const [copiedText, setCopiedText] = useState('Your OTP is 483921. Do not share this with anyone.');
  const [hasClipboardAccess, setHasClipboardAccess] = useState(true);
  const [browser, setBrowser] = useState('Chrome 120');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Clipboard Hijack Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Detect clipboard snooping risks</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Paste what's in your clipboard to check if it's sensitive content that malicious sites could steal.</p>
      </div>
      <CyberFeatureCard eyebrow="Clipboard Check" title="Inspect clipboard content" description="Check if the copied content contains sensitive data like OTPs or passwords.">
        <textarea value={copiedText} onChange={(e) => setCopiedText(e.target.value)} className="min-h-24 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasClipboardAccess} onChange={(e) => setHasClipboardAccess(e.target.checked)} className="accent-[var(--saffron)]" /> App has clipboard access</label>
        <input value={browser} onChange={(e) => setBrowser(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Browser" />
        <button onClick={() => setResult(analyzeClipboardRisk({ copiedText, hasClipboardAccess, browser }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check clipboard risk</button>
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

