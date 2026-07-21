import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeScreenshotMetadata } from '../cyberFeatures/screenshotMetadataInspector';

export default function ScreenshotMetadataInspectorView() {
  const [fileName, setFileName] = useState('Screenshot_2024-01-15.png'); const [fileSize, setFileSize] = useState('2.4 MB');
  const [hasExif, setHasExif] = useState(true); const [hasGPS, setHasGPS] = useState(true);
  const [hasDeviceInfo, setHasDeviceInfo] = useState(true); const [hasTimestamp, setHasTimestamp] = useState(true);
  const [hasEdits, setHasEdits] = useState(false); const [contentText, setContentText] = useState('OTP: 483921 for transaction at ICICI Bank');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Screenshot Metadata Inspector</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Inspect screenshot metadata for risks</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check if a screenshot contains sensitive metadata like GPS location, device info, or visible credentials.</p></div>
      <CyberFeatureCard eyebrow="Metadata Check" title="Screenshot metadata analysis" description="Enter the screenshot details.">
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="File name" />
        <textarea value={contentText} onChange={(e) => setContentText(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Content text visible in screenshot" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasExif} onChange={(e) => setHasExif(e.target.checked)} className="accent-[var(--saffron)]" /> Has EXIF metadata</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasGPS} onChange={(e) => setHasGPS(e.target.checked)} className="accent-[var(--saffron)]" /> GPS location in metadata</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDeviceInfo} onChange={(e) => setHasDeviceInfo(e.target.checked)} className="accent-[var(--saffron)]" /> Device info in metadata</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasTimestamp} onChange={(e) => setHasTimestamp(e.target.checked)} className="accent-[var(--saffron)]" /> Has creation timestamp</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasEdits} onChange={(e) => setHasEdits(e.target.checked)} className="accent-[var(--saffron)]" /> Appears edited/tampered</label>
        </div>
        <button onClick={() => setResult(analyzeScreenshotMetadata({ fileName, fileSize, hasExif, hasGPS, hasDeviceInfo, hasTimestamp, hasEdits, contentText }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Inspect metadata</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

