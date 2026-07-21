import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeSocialProfile } from '../cyberFeatures/fakeSocialProfileInspector';

export default function FakeSocialProfileInspectorView() {
  const [username, setUsername] = useState('FreeCash_Winner');
  const [bio, setBio] = useState('Click link to claim your free ₹50,000 cash prize today!');
  const [followers, setFollowers] = useState(45);
  const [verified, setVerified] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Fake Social Profile Inspector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Spot fake social media profiles</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers create fake profiles to build trust. This tool analyzes profile signals for authenticity.</p>
      </div>
      <CyberFeatureCard eyebrow="Profile Check" title="Social profile analysis" description="Enter the profile details to check for scam signals.">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Username" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Bio" />
        <div className="flex items-center gap-3 text-sm"><span>Followers:</span><input type="number" min="0" value={followers} onChange={(e) => setFollowers(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-[var(--saffron)]" /> Verified account</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profilePhoto} onChange={(e) => setProfilePhoto(e.target.checked)} className="accent-[var(--saffron)]" /> Has profile photo</label>
        <button onClick={() => setResult(analyzeSocialProfile({ username, bio, followers, verified, profilePhoto }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Inspect profile</button>
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

