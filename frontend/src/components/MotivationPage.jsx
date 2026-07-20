export default function MotivationPage({ setActiveView }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[var(--paper-line)] rounded-2xl p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--saffron)] mb-2">Why this matters</p>
        <h1 className="font-display text-3xl font-semibold leading-tight">Every warning avoided protects a family, a savings account, and a future.</h1>
        <p className="text-[var(--ink-text)]/70 mt-2">
          Fraud often succeeds because people feel rushed, isolated, or embarrassed. A calm moment of verification can stop a scam before it becomes a financial or emotional loss.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold mb-2">Protect dignity</h2>
          <p className="text-sm text-[var(--ink-text)]/80">You do not need to feel ashamed to ask for help or verify a claim.</p>
        </div>
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold mb-2">Protect savings</h2>
          <p className="text-sm text-[var(--ink-text)]/80">A few seconds of verification can prevent a loss that feels impossible to recover.</p>
        </div>
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold mb-2">Protect community</h2>
          <p className="text-sm text-[var(--ink-text)]/80">When one person verifies, they help protect many others from the same pattern.</p>
        </div>
      </div>

      <div className="bg-[var(--navy)] text-white rounded-2xl p-6">
        <h2 className="font-display text-2xl font-semibold mb-2">The mission</h2>
        <p className="text-[var(--mist)]">
          KshemOS is designed to make digital safety feel practical, human, and easy to understand so more people can act with confidence.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-4 bg-[var(--saffron)] text-white rounded-full px-5 py-2 text-sm font-semibold"
        >
          Explore the portal
        </button>
      </div>
    </div>
  );
}
