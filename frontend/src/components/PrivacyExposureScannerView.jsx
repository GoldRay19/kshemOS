import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzePrivacyExposure } from '../cyberFeatures/privacyExposureScanner';

export default function PrivacyExposureScannerView() {
  const [publicPosts, setPublicPosts] = useState(12);
  const [sharedLocation, setSharedLocation] = useState(true);
  const [sharedContacts, setSharedContacts] = useState(true);
  const [publicEmail, setPublicEmail] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Privacy Exposure Scanner</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Scan your privacy exposure online</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check how much of your personal information is exposed through public profiles and settings.</p>
      </div>
      <CyberFeatureCard eyebrow="Privacy Scan" title="Privacy exposure assessment" description="Enter details about your online privacy settings.">
        <div className="flex items-center gap-3 text-sm"><span>Public posts:</span><input type="number" min="0" value={publicPosts} onChange={(e) => setPublicPosts(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sharedLocation} onChange={(e) => setSharedLocation(e.target.checked)} className="accent-[var(--saffron)]" /> Location is publicly shared</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sharedContacts} onChange={(e) => setSharedContacts(e.target.checked)} className="accent-[var(--saffron)]" /> Contacts / address exposed</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={publicEmail} onChange={(e) => setPublicEmail(e.target.checked)} className="accent-[var(--saffron)]" /> Email is publicly visible</label>
        <div className="flex items-center gap-3 text-sm"><span>Profile visibility:</span><select value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)} className="rounded-xl border border-[var(--paper-line)] p-2 text-sm"><option value="public">Public</option><option value="private">Private</option><option value="friends">Friends only</option></select></div>
        <button onClick={() => setResult(analyzePrivacyExposure({ publicPosts, sharedLocation, sharedContacts, publicEmail, profileVisibility }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Scan exposure</button>
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

