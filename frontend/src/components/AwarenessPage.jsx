import {
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Lock,
  CreditCard,
  Eye,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AwarenessPage({ setActiveView }) {
  const redFlags = [
    "Calls claiming you are under 'Digital Arrest'",
    "Pressure to act immediately",
    "Requests for OTP, Aadhaar or banking details",
    "Threats of arrest, account suspension or legal action",
    "Demands for payment through UPI, gift cards or crypto",
    "Told not to tell family or friends",
  ];

  const safetyTips = [
    "Verify through the official website or helpline",
    "Never share OTPs or passwords",
    "Block suspicious numbers immediately",
    "Report fraud to cybercrime authorities",
    "Enable Multi-Factor Authentication",
    "Keep software and antivirus updated",
  ];

  const scamTypes = [
    {
      icon: <PhoneCall size={30} />,
      title: "Digital Arrest",
      desc: "Fake police or CBI officers threaten victims with arrest."
    },
    {
      icon: <CreditCard size={30} />,
      title: "Banking Fraud",
      desc: "Scammers ask for OTPs or banking credentials."
    },
    {
      icon: <Eye size={30} />,
      title: "Phishing",
      desc: "Fake emails and websites steal sensitive information."
    },
    {
      icon: <Lock size={30} />,
      title: "Account Takeover",
      desc: "Hackers gain access using leaked passwords."
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">

      {/* HERO */}

      <section className="rounded-3xl bg-gradient-to-r from-[var(--navy)] to-[var(--ink)] text-white p-10">

        <div className="flex items-center gap-3 text-[var(--saffron)]">

          <ShieldCheck size={34} />

          <span className="uppercase tracking-[0.3em] text-sm font-semibold">

            Digital Awareness

          </span>

        </div>

        <h1 className="mt-5 text-5xl font-bold max-w-3xl leading-tight">

          Stay Alert.
          <br />
          Think Before You Trust.

        </h1>

        <p className="mt-6 text-lg max-w-2xl text-gray-300">

          Most cyber fraud succeeds because victims are pressured into making
          quick decisions. Learn to recognize scams before they become costly.

        </p>

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={() => setActiveView("portal")}
            className="rounded-full bg-[var(--saffron)] px-6 py-3 font-semibold hover:scale-105 transition"
          >
            Try Live Demo
          </button>

          <button className="rounded-full border border-white px-6 py-3 hover:bg-white hover:text-black transition">
            Learn More
          </button>

        </div>

      </section>

      {/* STATS */}

      <section className="grid md:grid-cols-3 gap-6">

        <div className="rounded-2xl border p-6 text-center">
          <h2 className="text-4xl font-bold text-red-500">90%</h2>
          <p className="mt-2">Cyber scams exploit human psychology.</p>
        </div>

        <div className="rounded-2xl border p-6 text-center">
          <h2 className="text-4xl font-bold text-green-600">30 sec</h2>
          <p className="mt-2">Pause before sharing sensitive information.</p>
        </div>

        <div className="rounded-2xl border p-6 text-center">
          <h2 className="text-4xl font-bold text-blue-600">100%</h2>
          <p className="mt-2">Verify every unexpected request.</p>
        </div>

      </section>

      {/* COMMON SCAMS */}

      <section>

        <h2 className="text-3xl font-bold mb-6">

          Common Cyber Threats

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          {scamTypes.map((item) => (

            <div
              key={item.title}
              className="rounded-2xl border p-6 hover:shadow-lg transition"
            >

              <div className="text-red-500">

                {item.icon}

              </div>

              <h3 className="mt-4 text-xl font-semibold">

                {item.title}

              </h3>

              <p className="mt-2 text-sm text-gray-600">

                {item.desc}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* RED FLAGS & SAFETY */}

      <section className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl border p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold">

            <AlertTriangle className="text-red-500" />

            Red Flags

          </h2>

          <div className="mt-5 space-y-3">

            {redFlags.map((item) => (

              <div
                key={item}
                className="flex gap-3 rounded-xl bg-red-50 p-3"
              >

                <AlertTriangle
                  className="text-red-500 mt-1"
                  size={18}
                />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

        <div className="rounded-2xl border p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold">

            <ShieldCheck className="text-green-600" />

            Stay Safe

          </h2>

          <div className="mt-5 space-y-3">

            {safetyTips.map((item) => (

              <div
                key={item}
                className="flex gap-3 rounded-xl bg-green-50 p-3"
              >

                <CheckCircle2
                  className="text-green-600 mt-1"
                  size={18}
                />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CHECKLIST */}

      <section className="rounded-3xl bg-[var(--paper)] border p-8">

        <h2 className="text-3xl font-bold">

          Before You Respond...

        </h2>

        <div className="mt-6 grid md:grid-cols-2 gap-5">

          {[
            "Did they ask for money?",
            "Did they ask for OTP?",
            "Are they creating urgency?",
            "Can you verify independently?",
          ].map((q) => (

            <label
              key={q}
              className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gray-50 cursor-pointer"
            >

              <input
                type="checkbox"
                className="accent-[var(--saffron)]"
              />

              {q}

            </label>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="rounded-3xl bg-[var(--navy)] text-white p-10 text-center">

        <ShieldCheck
          className="mx-auto text-[var(--saffron)]"
          size={50}
        />

        <h2 className="mt-5 text-4xl font-bold">

          Pause. Verify. Protect.

        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-gray-300">

          Cyber criminals rely on fear and urgency.
          Take a moment to verify every request before sharing information.

        </p>

        <button
          onClick={() => setActiveView("portal")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--saffron)] px-8 py-3 font-semibold hover:scale-105 transition"
        >
          Start Security Analysis
          <ArrowRight size={18} />
        </button>

      </section>

    </div>
  );
}