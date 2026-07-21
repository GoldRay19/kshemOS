import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeConversationPressure } from '../cyberFeatures/conversationPressureMeter';

export default function ConversationPressureMeterView() {
  const [message, setMessage] = useState("You need to do this now! Why are you hesitating? Don't you trust me?");
  const [repeatedRequests, setRepeatedRequests] = useState(true);
  const [interruptions, setInterruptions] = useState(true);
  const [blame, setBlame] = useState(true);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Conversation Pressure Meter</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Measure pressure tactics in conversations</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers apply repeated pressure, interruptions, and blame to coerce victims.</p>
      </div>
      <CyberFeatureCard eyebrow="Pressure Check" title="Conversation pressure analysis" description="Toggle the pressure tactics observed.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={repeatedRequests} onChange={(e) => setRepeatedRequests(e.target.checked)} className="accent-[var(--saffron)]" /> Repeated requests</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={interruptions} onChange={(e) => setInterruptions(e.target.checked)} className="accent-[var(--saffron)]" /> Interruptions</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={blame} onChange={(e) => setBlame(e.target.checked)} className="accent-[var(--saffron)]" /> Blame / guilt</label>
        </div>
        <button onClick={() => setResult(analyzeConversationPressure({ message, repeatedRequests, interruptions, blame }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Measure pressure</button>
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

