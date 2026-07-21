import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeCrowdfunding } from '../cyberFeatures/crowdfundingLegitimacyChecker';

export default function CrowdfundingLegitimacyCheckerView() {
  const [campaignName, setCampaignName] = useState('Emergency Medical Fund for Ravi'); const [creatorName, setCreatorName] = useState('Ravi Kumar');
  const [goal, setGoal] = useState('₹10,00,000'); const [raised, setRaised] = useState('₹2,50,000'); const [platform, setPlatform] = useState('Personal website');
  const [hasVerification, setHasVerification] = useState(false); const [hasUpdates, setHasUpdates] = useState(false);
  const [message, setMessage] = useState('Please donate urgently. Share with everyone. Direct transfer to my account.'); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Crowdfunding Legitimacy Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check if a crowdfunding campaign is real</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze campaign verification, updates, and off-platform payment requests.</p></div>
      <CyberFeatureCard eyebrow="Campaign Check" title="Crowdfunding legitimacy analysis" description="Enter the campaign details.">
        <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Campaign name" />
        <input value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Platform" />
        <input value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Goal amount" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Campaign message" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasVerification} onChange={(e) => setHasVerification(e.target.checked)} className="accent-[var(--saffron)]" /> Creator is verified by platform</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasUpdates} onChange={(e) => setHasUpdates(e.target.checked)} className="accent-[var(--saffron)]" /> Regular updates posted</label>
        <button onClick={() => setResult(analyzeCrowdfunding({ campaignName, creatorName, goal, raised, platform, hasVerification, hasUpdates, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check legitimacy</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

