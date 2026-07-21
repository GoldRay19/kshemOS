import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeIncidentImpact } from '../cyberFeatures/cyberIncidentImpact';

export default function CyberIncidentImpactView() {
  const [incidentType, setIncidentType] = useState('Phishing / data leak');
  const [dataLoss, setDataLoss] = useState(true);
  const [moneyAtRisk, setMoneyAtRisk] = useState(true);
  const [devicesAffected, setDevicesAffected] = useState(2);
  const [accountsAffected, setAccountsAffected] = useState(3);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Cyber Incident Impact Calculator</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Calculate the impact of a security incident</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Assess how severe a cyber incident is based on data loss, financial risk, and scope.</p>
      </div>
      <CyberFeatureCard eyebrow="Impact Calc" title="Cyber incident impact assessment" description="Enter the details of the incident.">
        <input value={incidentType} onChange={(e) => setIncidentType(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Type of incident" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dataLoss} onChange={(e) => setDataLoss(e.target.checked)} className="accent-[var(--saffron)]" /> Data loss involved</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={moneyAtRisk} onChange={(e) => setMoneyAtRisk(e.target.checked)} className="accent-[var(--saffron)]" /> Money or banking at risk</label>
        <div className="flex items-center gap-3 text-sm"><span>Devices affected:</span><input type="number" min="0" value={devicesAffected} onChange={(e) => setDevicesAffected(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <div className="flex items-center gap-3 text-sm"><span>Accounts affected:</span><input type="number" min="0" value={accountsAffected} onChange={(e) => setAccountsAffected(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <button onClick={() => setResult(analyzeIncidentImpact({ incidentType, dataLoss, moneyAtRisk, devicesAffected, accountsAffected }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Calculate impact</button>
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

