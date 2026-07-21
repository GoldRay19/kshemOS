import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { buildCyberCase } from '../cyberFeatures/caseBuilder';

export default function CyberCaseBuilderView() {
  const [title, setTitle] = useState('Suspicious OTP request');
  const [summary, setSummary] = useState('Victim received an urgent message asking for OTP and SIM swap confirmation.');
  const [evidence, setEvidence] = useState('Screenshot, call log, message');
  const [urgency, setUrgency] = useState('high');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">CyberCase Builder</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Emergency response and evidence organizer</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Build a simple incident summary and gather an evidence checklist for fast reporting.</p>
      </div>
      <CyberFeatureCard eyebrow="Incident builder" title="Create a cyber incident summary" description="This helps structure a quick summary and evidence list for the next step.">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Case title" />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-28 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <input value={evidence} onChange={(e) => setEvidence(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Evidence items" />
        <input value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Urgency" />
        <button onClick={() => setResult(buildCyberCase({ title, summary, evidence: evidence.split(','), urgency }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Build case summary</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} priority</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
