import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeWebcamMic } from '../cyberFeatures/webcamMicAuditor';

export default function WebcamMicAuditorView() {
  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [browser, setBrowser] = useState('Chrome 120');
  const [reason, setReason] = useState('Video call with recruiter');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Webcam & Mic Auditor</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Audit camera and microphone access</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check which sites or apps have camera and microphone access and whether the context is appropriate.</p>
      </div>
      <CyberFeatureCard eyebrow="Device Audit" title="Webcam & mic permission check" description="Toggle permissions and describe the usage context.">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={camera} onChange={(e) => setCamera(e.target.checked)} className="accent-[var(--saffron)]" /> Camera access enabled</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={microphone} onChange={(e) => setMicrophone(e.target.checked)} className="accent-[var(--saffron)]" /> Microphone access enabled</label>
        <input value={browser} onChange={(e) => setBrowser(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Browser" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Reason for access" />
        <button onClick={() => setResult(analyzeWebcamMic({ camera, microphone, browser, reason }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Audit</button>
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

