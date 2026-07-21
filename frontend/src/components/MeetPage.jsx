const TEAM = [
  {
    name: "Esha Jha",
    role: "Full Stack Developer & Cybersecurity Researcher",
    bio: "Building end-to-end cyber safety tools with a focus on rule-based scam detection, threat intelligence, and user protection systems. Passionate about making digital safety accessible to everyone.",
    initials: "EJ",
    color: "var(--saffron)",
    skills: ["React", "Cybersecurity", "Frontend", "Threat Detection"],
  },
  {
    name: "Eshita Jha",
    role: "ML Engineer & Cybersecurity Researcher",
    bio: "Engineering intelligent rule-based systems for phishing, impersonation, and financial fraud detection. Focused on creating scalable, explainable, and privacy-first safety solutions.",
    initials: "EJ",
    color: "var(--safe)",
    skills: ["Machine Learning", "Fraud Detection", "Python", "AI Security"],
  },
];

function ShieldMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9.5 12.5l2 2 4-4" />
    </svg>
  );
}

export default function MeetPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">

      {/* Hero */}
      <div className="text-center">

        <div className="inline-flex items-center gap-3 rounded-full border border-[var(--paper-line)] bg-white px-5 py-2 shadow-sm">
          <div className="text-[var(--safe)]">
            <ShieldMark />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--safe)]">
            Meet the Team
          </span>
        </div>

        <h1 className="mt-8 font-display text-5xl font-bold text-[var(--ink)]">
          Building Safer Digital Experiences
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ink-text)]/70">
          KshemOS is built by passionate developers and cybersecurity
          researchers dedicated to protecting users from scams,
          impersonation, phishing, and online financial fraud through
          intelligent and explainable security tools.
        </p>
      </div>

      {/* Stats */}

      <div className="mt-16 grid gap-6 md:grid-cols-3">

        {[
          ["2", "Core Members"],
          ["12+", "Security Modules"],
          ["100%", "Privacy First"],
        ].map(([number, label]) => (
          <div
            key={label}
            className="rounded-3xl border border-[var(--paper-line)] bg-white p-8 text-center shadow-sm"
          >
            <h2 className="font-display text-4xl font-bold text-[var(--safe)]">
              {number}
            </h2>

            <p className="mt-2 text-sm text-[var(--ink-text)]/60">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Team */}

      <div className="mt-20 grid gap-8 md:grid-cols-2">

        {TEAM.map((member) => (
          <div
            key={member.name}
            className="group rounded-3xl border border-[var(--paper-line)] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >

            {/* Avatar */}

            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
            </div>

            <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
              {member.name}
            </h2>

            <p
              className="mt-2 text-xs font-mono uppercase tracking-[0.25em]"
              style={{ color: member.color }}
            >
              {member.role}
            </p>

            <p className="mt-5 leading-7 text-[var(--ink-text)]/70">
              {member.bio}
            </p>

            {/* Skills */}

            <div className="mt-6 flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--paper-line)] bg-[var(--paper)] px-3 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--paper-line)] pt-5">

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--ink-text)]/50">
                <ShieldMark size={16} />
                KshemOS Core Team
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Mission */}

      <div className="mt-20 rounded-[32px] border border-[var(--paper-line)] bg-[var(--paper)] p-10 text-center">

        <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
          Our Mission
        </h2>

        <p className="mx-auto mt-5 max-w-3xl leading-8 text-[var(--ink-text)]/70">
          We believe cybersecurity should be simple, transparent, and
          accessible. KshemOS combines explainable rule-based detection,
          machine intelligence, and user-focused design to help everyone
          stay protected against evolving cyber threats.
        </p>

        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--paper-line)] bg-white px-6 py-3 shadow-sm">

          <span className="h-2.5 w-2.5 rounded-full bg-[var(--safe)]"></span>

          <span className="font-mono text-sm text-[var(--ink-text)]/70">
            Together for a Safer Digital India 🇮🇳
          </span>

        </div>

      </div>

    </div>
  );
}