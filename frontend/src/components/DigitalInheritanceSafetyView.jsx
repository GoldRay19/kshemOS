import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeDigitalInheritance } from '../cyberFeatures/digitalInheritanceSafety';

export default function DigitalInheritanceSafetyView() {
  const [hasWill, setHasWill] = useState(false); const [hasExecutor, setHasExecutor] = useState(false);
  const [hasPasswordManager, setHasPasswordManager] = useState(false); const [hasDigitalAssetList, setHasDigitalAssetList] = useState(false);
  const [hasBeneficiaryInfo, setHasBeneficiaryInfo] = useState(false); const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Digital Inheritance Safety</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Plan your digital inheritance</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Ensure your digital assets, accounts, and passwords are transferable to your loved ones.</p></div>
      <CyberFeatureCard eyebrow="Inheritance Check" title="Digital inheritance readiness" description="Check your digital legacy preparedness.">
        <div className="space-y-2">
          {[{label:'Digital will exists', value:hasWill, setter:setHasWill},{label:'Executor assigned for digital assets', value:hasExecutor, setter:setHasExecutor},{label:'Password manager with sharing plan', value:hasPasswordManager, setter:setHasPasswordManager},{label:'Inventory of digital assets documented', value:hasDigitalAssetList, setter:setHasDigitalAssetList},{label:'Beneficiary info for accounts', value:hasBeneficiaryInfo, setter:setHasBeneficiaryInfo}].map((item) => (
            <label key={item.label} className="flex items-center gap-3 rounded-xl border border-[var(--paper-line)] p-3 text-sm cursor-pointer hover:border-[var(--saffron)]">
              <input type="checkbox" checked={item.value} onChange={() => item.setter((p) => !p)} className="h-4 w-4 accent-[var(--saffron)]" /><span>{item.label}</span>
            </label>
          ))}
        </div>
        <button onClick={() => setResult(analyzeDigitalInheritance({ hasWill, hasExecutor, hasPasswordManager, hasDigitalAssetList, hasBeneficiaryInfo, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess readiness</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

