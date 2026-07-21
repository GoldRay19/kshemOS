import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeScamPsychology } from '../cyberFeatures/scamPsychologyAnalyzer';

export default function ScamPsychologyAnalyzerView() {
  const [message, setMessage] = useState('You have won a free iPhone! Click now to claim your prize before the offer expires.');
  const [tone, setTone] = useState('Exciting');
  const [urgency, setUrgency] = useState(true);
  const [reward, setReward] = useState(true);
  const [authority, setAuthority] = useState(false);
  const [secrecy, setSecrecy] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Scam Psychology Analyzer</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Understand the psychology behind scams</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze how scams use urgency, rewards, authority, and secrecy to manipulate victims.</p>
      </div>
      <CyberFeatureCard eyebrow="Psychology Check" title="Scam persuasion analysis" description="Toggle the psychological tactics used in the message.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Urgency</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={reward} onChange={(e) => setReward(e.target.checked)} className="accent-[var(--saffron)]" /> Reward</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={authority} onChange={(e) => setAuthority(e.target.checked)} className="accent-[var(--saffron)]" /> Authority</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={secrecy} onChange={(e) => setSecrecy(e.target.checked)} className="accent-[var(--saffron)]" /> Secrecy</label>
        </div>
        <button onClick={() => setResult(analyzeScamPsychology({ message, tone, urgency, reward, authority, secrecy }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze</button>
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

