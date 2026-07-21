import { useState } from "react";
import {
  ShieldAlert,
  Building2,
  MessageSquare,
  BadgeAlert,
  Search,
  ClipboardCopy,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import CyberFeatureCard from "./CyberFeatureCard";
import { analyzeAuthorityImpersonation } from "../cyberFeatures/authorityImpersonationDetector";

const EXAMPLES = [
  {
    title: "Income Tax Scam",
    message:
      "This is the Income Tax Department. Your PAN has been linked to illegal activity. Pay ₹25,000 immediately through UPI to avoid arrest.",
    org: "Income Tax Department",
    action: "Pay via UPI",
  },
  {
    title: "Bank KYC Scam",
    message:
      "Your SBI account will be blocked today. Complete KYC immediately.",
    org: "State Bank of India",
    action: "Click suspicious link",
  },
  {
    title: "Police Scam",
    message:
      "Cyber Crime Police has issued an arrest warrant against you.",
    org: "Cyber Crime Police",
    action: "Transfer security deposit",
  },
];

export default function AuthorityImpersonationDetectorView() {
  const [message, setMessage] = useState(EXAMPLES[0].message);
  const [claimedOrg, setClaimedOrg] = useState(EXAMPLES[0].org);
  const [requestedAction, setRequestedAction] = useState(EXAMPLES[0].action);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = () => {
    setLoading(true);

    setTimeout(() => {
      const res = analyzeAuthorityImpersonation({
        message,
        claimedOrg,
        requestedAction,
      });

      setResult({
        ...res,
        score: res.score ?? 85,
      });

      setLoading(false);
    }, 1200);
  };

  const loadExample = (sample) => {
    setMessage(sample.message);
    setClaimedOrg(sample.org);
    setRequestedAction(sample.action);
    setResult(null);
  };

  const clearForm = () => {
    setMessage("");
    setClaimedOrg("");
    setRequestedAction("");
    setResult(null);
  };

  const badge = {
    LOW: "bg-green-100 text-green-700 border-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
    HIGH: "bg-orange-100 text-orange-700 border-orange-300",
    CRITICAL: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      {/* Heading */}

      <div className="mb-8">

        <div className="flex items-center gap-2 text-[var(--saffron)]">

          <ShieldAlert size={18} />

          <span className="text-xs font-mono uppercase tracking-[0.3em]">
            Authority Impersonation Detector
          </span>

        </div>

        <h2 className="mt-3 text-4xl font-bold text-[var(--ink)]">

          Fake Authority Detection

        </h2>

        <p className="mt-2 max-w-3xl text-[15px] text-[var(--ink-text)]/70">

          Detect scam messages pretending to be government departments,
          police, banks or trusted organisations.

        </p>

      </div>

      <CyberFeatureCard
        eyebrow="Threat Scanner"
        title="Analyze Suspicious Message"
        description="Paste a suspicious SMS, WhatsApp message or Email."
      >

        {/* Examples */}

        <div className="mb-6 flex flex-wrap gap-2">

          {EXAMPLES.map((item) => (

            <button
              key={item.title}
              onClick={() => loadExample(item)}
              className="rounded-full border px-3 py-1 text-xs hover:bg-gray-100"
            >
              {item.title}
            </button>

          ))}

        </div>

        {/* Message */}

        <label className="mb-2 flex items-center gap-2 font-medium">

          <MessageSquare size={18} />

          Message

        </label>

        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border p-4"
        />

        <p className="mt-2 text-xs text-gray-500">

          {message.length} characters

        </p>

        {/* Organization */}

        <div className="mt-6">

          <label className="mb-2 flex items-center gap-2 font-medium">

            <Building2 size={18} />

            Claimed Organization

          </label>

          <input
            value={claimedOrg}
            onChange={(e) => setClaimedOrg(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

        </div>

        {/* Action */}

        <div className="mt-6">

          <label className="mb-2 flex items-center gap-2 font-medium">

            <BadgeAlert size={18} />

            Requested Action

          </label>

          <input
            value={requestedAction}
            onChange={(e) => setRequestedAction(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-wrap gap-3">

          <button
            onClick={analyze}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-white hover:opacity-90 disabled:opacity-60"
          >
            <Search size={18} />

            {loading ? "Analyzing..." : "Analyze Message"}

          </button>

          <button
            onClick={clearForm}
            className="flex items-center gap-2 rounded-full border px-5 py-3"
          >
            <RotateCcw size={18} />
            Reset
          </button>

        </div>

        {/* Result */}

        {result && (

          <div className="mt-8 rounded-2xl border bg-[var(--paper)] p-6 shadow-sm">

            <div
              className={`inline-flex rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                badge[result.risk_band]
              }`}
            >
              {result.risk_band} Risk
            </div>

            {/* Score */}

            <div className="mt-6">

              <div className="mb-2 flex justify-between text-sm">

                <span>Threat Score</span>

                <span>{result.score}%</span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-700"
                  style={{ width: `${result.score}%` }}
                />

              </div>

            </div>

            <h3 className="mt-6 text-xl font-bold">

              {result.recommendation}

            </h3>

            <div className="mt-6">

              <h4 className="mb-3 font-semibold">

                Threat Indicators

              </h4>

              <div className="space-y-3">

                {result.signals.map((signal) => (

                  <div
                    key={signal.type}
                    className="flex gap-3 rounded-xl border p-4"
                  >

                    <BadgeAlert className="text-red-500" />

                    <div>

                      <h5 className="font-semibold">

                        {signal.type}

                      </h5>

                      <p className="text-sm text-gray-600">

                        {signal.detail}

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="mt-8 rounded-xl bg-green-50 p-5">

              <h4 className="mb-3 font-semibold">

                Recommended Actions

              </h4>

              <div className="space-y-2 text-sm">

                <div className="flex gap-2">

                  <CheckCircle2 className="text-green-600" size={18} />

                  Never send money immediately.

                </div>

                <div className="flex gap-2">

                  <CheckCircle2 className="text-green-600" size={18} />

                  Verify using the official website.

                </div>

                <div className="flex gap-2">

                  <CheckCircle2 className="text-green-600" size={18} />

                  Contact the organization directly.

                </div>

                <div className="flex gap-2">

                  <CheckCircle2 className="text-green-600" size={18} />

                  Report suspicious messages to cybercrime authorities.

                </div>

              </div>

            </div>

            <button
              className="mt-6 flex items-center gap-2 rounded-full border px-4 py-2"
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(result, null, 2))
              }
            >
              <ClipboardCopy size={18} />
              Copy Report
            </button>

          </div>

        )}

      </CyberFeatureCard>

    </div>
  );
}