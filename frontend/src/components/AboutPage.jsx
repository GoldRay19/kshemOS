export default function AboutPage({ setActiveView }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[var(--paper-line)] rounded-2xl p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--saffron)] mb-2">About KshemOS</p>
        <h1 className="font-display text-3xl font-semibold leading-tight">A public-safety operating system for the digital age.</h1>
        <p className="text-[var(--ink-text)]/70 mt-2">
          KshemOS brings together awareness, detection, and guidance in one simple experience. It is built to help citizens spot suspicious calls and support officers in tracing fraud patterns faster.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold mb-2">What it does</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--ink-text)]/80">
            <li>Flags suspicious call language using clear rule-based checks</li>
            <li>Guides people to verify before acting</li>
            <li>Shows how fraud rings might be connected</li>
            <li>Supports quick report drafting for officers and citizens</li>
          </ul>
        </div>
        <div className="bg-[var(--paper)] border border-[var(--paper-line)] rounded-2xl p-5">
          <h2 className="font-display text-xl font-semibold mb-2">Why it exists</h2>
          <p className="text-sm text-[var(--ink-text)]/80">
            The goal is not only to detect scams, but to make digital safety understandable and actionable for everyday people.
          </p>
        </div>
      </div>

      <div className="bg-[var(--navy)] text-white rounded-2xl p-6">
        <h2 className="font-display text-2xl font-semibold mb-2">Built for public trust</h2>
        <p className="text-[var(--mist)]">
          It combines practical protection with a calm, human-centered experience that anyone can use.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-4 bg-[var(--saffron)] text-white rounded-full px-5 py-2 text-sm font-semibold"
        >
          See the demo
        </button>
      </div>
    </div>
  );
}
