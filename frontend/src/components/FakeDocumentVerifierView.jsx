import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeFakeDocument } from '../cyberFeatures/fakeDocumentVerifier';

export default function FakeDocumentVerifierView() {
  const [title, setTitle] = useState('Income Tax Notice 2024');
  const [issuer, setIssuer] = useState('Income Tax Department');
  const [watermark, setWatermark] = useState('');
  const [metadata, setMetadata] = useState('');
  const [text, setText] = useState('Your tax return has been flagged. Verify now to avoid penalty.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Fake Document Verifier</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check if a document is legitimate</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Enter document details to detect watermarks, suspicious language, and metadata inconsistencies.</p>
      </div>
      <CyberFeatureCard eyebrow="Doc Check" title="Verify document authenticity" description="Input the document title, issuer, and content to assess its legitimacy.">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Document title" />
        <input value={issuer} onChange={(e) => setIssuer(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Issuer" />
        <input value={watermark} onChange={(e) => setWatermark(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Watermark (if any)" />
        <input value={metadata} onChange={(e) => setMetadata(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Metadata (if any)" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Document text" />
        <button onClick={() => setResult(analyzeFakeDocument({ title, issuer, watermark, metadata, text }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Verify document</button>
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

