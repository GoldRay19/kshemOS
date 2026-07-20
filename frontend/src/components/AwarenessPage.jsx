export default function AwarenessPage({ setActiveView }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[var(--paper-line)] rounded-2xl p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--saffron)] mb-2">Digital awareness</p>
        <h1 className="font-display text-3xl font-semibold leading-tight">Stay alert before you act.</h1>
        <p className="text-[var(--ink-text)]/70 mt-2">
          Digital threats often arrive as urgency, fear, secrecy, or a request for money or OTPs. The safest habit is to pause, verify, and ask for a second opinion.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold mb-2">Red flags to remember</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--ink-text)]/80">
            <li>Calls claiming you are “under digital arrest”</li>
            <li>Pressure to act immediately or not disconnect</li>
            <li>Requests for OTPs, Aadhaar, bank details, or money</li>
            <li>Officials asking you to keep it secret from family or friends</li>
          </ul>
        </div>
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold mb-2">What you should do</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--ink-text)]/80">
            <li>End the call and verify through an official number</li>
            <li>Do not share passwords, OTPs, or Aadhaar data</li>
            <li>Report suspicious calls or messages early</li>
            <li>Use trusted tools and local verification before acting</li>
          </ul>
        </div>
      </div>

      <div className="bg-[var(--navy)] text-white rounded-2xl p-6">
        <h2 className="font-display text-2xl font-semibold mb-2">A simple habit</h2>
        <p className="text-[var(--mist)]">
          When something feels urgent, slow down. Ask: who is contacting me, what do they want, and how can I verify it safely?
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-4 bg-[var(--saffron)] text-white rounded-full px-5 py-2 text-sm font-semibold"
        >
          Try the live demo
        </button>
      </div>
    </div>
  );
}
