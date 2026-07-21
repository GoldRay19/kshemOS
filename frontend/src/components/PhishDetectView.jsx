import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeEmail } from '../cyberFeatures/phishDetect';

export default function PhishDetectView() {
  const [from, setFrom] = useState('Security Team <support@outlook.com>');
  const [subject, setSubject] = useState('Urgent: Account suspended');
  const [body, setBody] = useState('Your account will be closed unless you confirm now. Click here to verify.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">PhishDetect</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Email phishing analyzer</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Review sender details, subject line, and body text for credential theft patterns.</p>
      </div>
      <CyberFeatureCard eyebrow="Email check" title="Analyze a suspicious email" description="This checks for spoofed display names, aggressive subjects, suspicious phrases, and suspicious links.">
        <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="From" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Subject" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-28 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <button onClick={() => setResult(analyzeEmail({ name: from, email: 'fake@example.com' }, subject, body, ''))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze email</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
