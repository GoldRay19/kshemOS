import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { generatePreparednessReport } from '../cyberFeatures/cyberPreparednessReport';

export default function CyberPreparednessReportView() {
  const [hasIncidentResponsePlan, setHasIncidentResponsePlan] = useState(false); const [hasDataBackup, setHasDataBackup] = useState(false);
  const [hasCyberInsurance, setHasCyberInsurance] = useState(false); const [knowsReportingProcess, setKnowsReportingProcess] = useState(false);
  const [hasSecuritySoftware, setHasSecuritySoftware] = useState(false); const [hasContactList, setHasContactList] = useState(false);
  const [regularlyUpdatesSoftware, setRegularlyUpdatesSoftware] = useState(false); const [hasPasswordManager, setHasPasswordManager] = useState(false);
  const [result, setResult] = useState(null);

  const areas = [
    {label:'Incident response plan in place', value:hasIncidentResponsePlan, setter:setHasIncidentResponsePlan},
    {label:'Regular data backup system', value:hasDataBackup, setter:setHasDataBackup},
    {label:'Cyber insurance or coverage', value:hasCyberInsurance, setter:setHasCyberInsurance},
    {label:'Know how to report cyber incidents', value:knowsReportingProcess, setter:setKnowsReportingProcess},
    {label:'Security software installed', value:hasSecuritySoftware, setter:setHasSecuritySoftware},
    {label:'Emergency contact list for incidents', value:hasContactList, setter:setHasContactList},
    {label:'Regularly updates software', value:regularlyUpdatesSoftware, setter:setRegularlyUpdatesSoftware},
    {label:'Uses a password manager', value:hasPasswordManager, setter:setHasPasswordManager},
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Cyber Preparedness Report</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Generate your cyber preparedness report</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Evaluate how prepared you are to handle a cyber incident.</p></div>
      <CyberFeatureCard eyebrow="Preparedness Check" title="Cyber incident preparedness" description="Mark which preparedness measures you have in place.">
        <div className="space-y-1">{areas.map((a) => (<label key={a.label} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={a.value} onChange={(e) => a.setter(e.target.checked)} className="accent-[var(--saffron)]" />{a.label}</label>))}</div>
        <button onClick={() => setResult(generatePreparednessReport({ hasIncidentResponsePlan, hasDataBackup, hasCyberInsurance, knowsReportingProcess, hasSecuritySoftware, hasContactList, regularlyUpdatesSoftware, hasPasswordManager }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Generate report</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

