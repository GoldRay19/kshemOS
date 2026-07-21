import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeDocumentConsistency } from '../cyberFeatures/digitalDocumentConsistency';

export default function DigitalDocumentConsistencyView() {
  const [fileName, setFileName] = useState('Invoice_2024.pdf'); const [fileType, setFileType] = useState('PDF');
  const [claimedContent, setClaimedContent] = useState('Invoice for services rendered - ₹12,500');
  const [actualContent, setActualContent] = useState('Payment confirmation - ₹45,000 - UPI transfer');
  const [hasDigitalSignature, setHasDigitalSignature] = useState(false); const [createdDate, setCreatedDate] = useState('2024-01-15');
  const [modifiedDate, setModifiedDate] = useState('2024-01-20'); const [authorName, setAuthorName] = useState('');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Digital Document Consistency Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check digital documents for tampering</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Compare claimed content vs actual content, check signatures, and detect metadata inconsistencies.</p></div>
      <CyberFeatureCard eyebrow="Doc Check" title="Document consistency analysis" description="Enter the document details to detect tampering.">
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="File name" />
        <input value={fileType} onChange={(e) => setFileType(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="File type" />
        <input value={claimedContent} onChange={(e) => setClaimedContent(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Claimed document content" />
        <input value={actualContent} onChange={(e) => setActualContent(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Actual document content" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasDigitalSignature} onChange={(e) => setHasDigitalSignature(e.target.checked)} className="accent-[var(--saffron)]" /> Has digital signature</label>
        </div>
        <button onClick={() => setResult(analyzeDocumentConsistency({ fileName, fileType, claimedContent, actualContent, hasDigitalSignature, createdDate, modifiedDate, authorName }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check consistency</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

