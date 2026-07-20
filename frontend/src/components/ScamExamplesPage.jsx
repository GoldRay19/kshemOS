export default function ScamExamplesPage({ setActiveView }) {
  const examples = [
    {
      title: 'Digital arrest',
      description: 'The caller says you are under arrest, cannot disconnect, and must make a payment immediately.',
    },
    {
      title: 'Fake courier notice',
      description: 'A message claims a parcel contains illegal items and asks for urgent payment to prevent legal trouble.',
    },
    {
      title: 'OTP recovery scam',
      description: 'The caller asks for a one-time password to “verify your account” or avoid a suspension.',
    },
    {
      title: 'Benign check',
      description: 'A normal appointment reminder or routine banking notice without urgency or payment pressure.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--saffron)]">Scam examples</p>
        <h1 className="font-display text-3xl font-semibold mt-2">Recognise the patterns that appear most often.</h1>
        <p className="mt-3 text-[var(--ink-text)]/70 max-w-2xl">
          These examples are designed to help users compare suspicious scripts with normal, non-threatening conversations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {examples.map((example) => (
          <div key={example.title} className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-5">
            <h2 className="font-display text-xl font-semibold">{example.title}</h2>
            <p className="mt-2 text-sm text-[var(--ink-text)]/80">{example.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-[var(--navy)] p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Use the demo to compare</h2>
        <p className="mt-2 text-[var(--mist)]">
          Try the sample cases and watch how the system changes its assessment as the wording changes.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-5 rounded-full bg-[var(--saffron)] px-5 py-2 text-sm font-semibold text-white"
        >
          Open the verification portal
        </button>
      </div>
    </div>
  );
}
