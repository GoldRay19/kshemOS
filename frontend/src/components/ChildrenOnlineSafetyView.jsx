import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeChildrenOnlineRisk } from '../cyberFeatures/childrenOnlineSafety';

export default function ChildrenOnlineSafetyView() {
  const [childAge, setChildAge] = useState(8); const [hasParentalControls, setHasParentalControls] = useState(false);
  const [hasScreenTimeLimits, setHasScreenTimeLimits] = useState(false); const [hasContentFilters, setHasContentFilters] = useState(false);
  const [hasLocationTracking, setHasLocationTracking] = useState(false); const [hasOnlineActivityLogs, setHasOnlineActivityLogs] = useState(false);
  const [hasSafeSearch, setHasSafeSearch] = useState(false); const [message, setMessage] = useState('Hi! I saw your profile. Want to play a game together? Click here to download.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Children's Online Safety</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check children's online safety</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Assess how well children are protected online with parental controls, filters, and monitoring.</p></div>
      <CyberFeatureCard eyebrow="Child Safety Check" title="Children's online safety assessment" description="Check the protections for a child.">
        <div className="flex items-center gap-3 text-sm mb-2"><span>Child's age:</span><input type="number" min="1" max="17" value={childAge} onChange={(e) => setChildAge(parseInt(e.target.value) || 1)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <div className="grid grid-cols-2 gap-2">
          {[{label:'Parental controls installed', value:hasParentalControls, setter:setHasParentalControls},{label:'Screen time limits', value:hasScreenTimeLimits, setter:setHasScreenTimeLimits},{label:'Content/age filters', value:hasContentFilters, setter:setHasContentFilters},{label:'Location tracking', value:hasLocationTracking, setter:setHasLocationTracking},{label:'Online activity logs', value:hasOnlineActivityLogs, setter:setHasOnlineActivityLogs},{label:'Safe search enforced', value:hasSafeSearch, setter:setHasSafeSearch}].map((item) => (
            <label key={item.label} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.value} onChange={(e) => item.setter(e.target.checked)} className="accent-[var(--saffron)]" />{item.label}</label>
          ))}
        </div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Suspicious message received by child (optional)" />
        <button onClick={() => setResult(analyzeChildrenOnlineRisk({ childAge, hasParentalControls, hasScreenTimeLimits, hasContentFilters, hasLocationTracking, hasOnlineActivityLogs, hasSafeSearch, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess safety</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

