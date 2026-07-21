import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeFamilySafety } from '../cyberFeatures/familyCyberSafety';

export default function FamilyCyberSafetyView() {
  const [hasSharedPasswordPolicy, setHasSharedPasswordPolicy] = useState(false);
  const [hasCyberRules, setHasCyberRules] = useState(false);
  const [hasParentalControls, setHasParentalControls] = useState(false);
  const [hasOpenCommunication, setHasOpenCommunication] = useState(false);
  const [hasEmergencyPlan, setHasEmergencyPlan] = useState(false);
  const [familySize, setFamilySize] = useState(4);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Family Cyber Safety</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Assess your family's cyber safety</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check if your household has cyber rules, parental controls, and an emergency plan.</p>
      </div>
      <CyberFeatureCard eyebrow="Family Check" title="Family cyber safety dashboard" description="Check your family's online safety preparedness.">
        <div className="space-y-2">
          {[{label:'Shared password management policy', value:hasSharedPasswordPolicy, setter:setHasSharedPasswordPolicy},{label:'Agreed cyber safety rules', value:hasCyberRules, setter:setHasCyberRules},{label:'Parental controls for children', value:hasParentalControls, setter:setHasParentalControls},{label:'Open communication about online risks', value:hasOpenCommunication, setter:setHasOpenCommunication},{label:'Emergency plan for cyber incidents', value:hasEmergencyPlan, setter:setHasEmergencyPlan}].map((item) => (
            <label key={item.label} className="flex items-center gap-3 rounded-xl border border-[var(--paper-line)] p-3 text-sm cursor-pointer hover:border-[var(--saffron)]">
              <input type="checkbox" checked={item.value} onChange={() => item.setter((p) => !p)} className="h-4 w-4 accent-[var(--saffron)]" /><span>{item.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm"><span>Family size:</span><input type="number" min="1" value={familySize} onChange={(e) => setFamilySize(parseInt(e.target.value) || 1)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <button onClick={() => setResult(analyzeFamilySafety({ hasSharedPasswordPolicy, hasCyberRules, hasParentalControls, hasOpenCommunication, hasEmergencyPlan, familySize, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check safety</button>
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

