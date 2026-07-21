import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeEmotionalManipulation } from '../cyberFeatures/emotionalManipulationDetector';

export default function EmotionalManipulationDetectorView() {
  const [message, setMessage] = useState('Please, I need your help urgently. Only you can save my family. Send money now.');
  const [empathy, setEmpathy] = useState(true);
  const [guilt, setGuilt] = useState(true);
  const [fear, setFear] = useState(true);
  const [flattery, setFlattery] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Emotional Manipulation Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Detect emotional manipulation in messages</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers exploit empathy, guilt, fear, and flattery. This tool flags those patterns.</p>
      </div>
      <CyberFeatureCard eyebrow="Emotion Check" title="Emotional manipulation analysis" description="Toggle what emotional tactics the message uses.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fear} onChange={(e) => setFear(e.target.checked)} className="accent-[var(--saffron)]" /> Fear</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guilt} onChange={(e) => setGuilt(e.target.checked)} className="accent-[var(--saffron)]" /> Guilt</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={empathy} onChange={(e) => setEmpathy(e.target.checked)} className="accent-[var(--saffron)]" /> Empathy</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flattery} onChange={(e) => setFlattery(e.target.checked)} className="accent-[var(--saffron)]" /> Flattery</label>
        </div>
        <button onClick={() => setResult(analyzeEmotionalManipulation({ message, empathy, guilt, fear, flattery }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Detect manipulation</button>
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

