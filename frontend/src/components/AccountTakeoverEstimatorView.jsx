import { useState } from "react";
import CyberFeatureCard from "./CyberFeatureCard";
import { analyzeAccountTakeoverRisk } from "../cyberFeatures/accountTakeoverEstimator";

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 rounded-xl border border-[var(--paper-line)] p-3 hover:bg-[var(--paper)] cursor-pointer transition">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-[var(--saffron)]"
    />
    <span className="text-sm text-[var(--ink)]">{label}</span>
  </label>
);

export default function AccountTakeoverEstimatorView() {
  const [form, setForm] = useState({
    hasMFA: false,
    hasStrongPassword: false,
    hasRecentBreach: true,
    hasSuspiciousLogin: false,
    sharedPasswordElsewhere: true,
    hasRecoveryEmail: false,
    accountAge: 24,
  });

  const [result, setResult] = useState(null);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEstimate = () => {
    setResult(analyzeAccountTakeoverRisk(form));
  };

  const badgeColor = {
    LOW: "bg-green-500/10 text-green-600 border-green-500/30",
    MEDIUM: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    HIGH: "bg-red-500/10 text-red-600 border-red-500/30",
    CRITICAL: "bg-red-700/10 text-red-700 border-red-700/30",
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">
          Account Takeover Estimator
        </div>

        <h2 className="font-display text-4xl font-bold text-[var(--ink)] mt-2">
          Estimate Account Takeover Risk
        </h2>

        <p className="mt-3 max-w-2xl text-[15px] text-[var(--ink-text)]/70">
          Evaluate how vulnerable your online account is based on password
          hygiene, MFA, breach exposure, and login behavior.
        </p>
      </div>

      <CyberFeatureCard
        eyebrow="ATO Check"
        title="Security Assessment"
        description="Answer a few questions to estimate your account takeover risk."
      >
        <div className="grid gap-4 md:grid-cols-2">

          <Checkbox
            label="Multi-Factor Authentication Enabled"
            checked={form.hasMFA}
            onChange={(v) => update("hasMFA", v)}
          />

          <Checkbox
            label="Strong & Unique Password"
            checked={form.hasStrongPassword}
            onChange={(v) => update("hasStrongPassword", v)}
          />

          <Checkbox
            label="Appeared in Recent Data Breach"
            checked={form.hasRecentBreach}
            onChange={(v) => update("hasRecentBreach", v)}
          />

          <Checkbox
            label="Suspicious Login Activity"
            checked={form.hasSuspiciousLogin}
            onChange={(v) => update("hasSuspiciousLogin", v)}
          />

          <Checkbox
            label="Password Reused on Other Sites"
            checked={form.sharedPasswordElsewhere}
            onChange={(v) => update("sharedPasswordElsewhere", v)}
          />

          <Checkbox
            label="Recovery Email / Phone Configured"
            checked={form.hasRecoveryEmail}
            onChange={(v) => update("hasRecoveryEmail", v)}
          />
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">
            Account Age
          </label>

          <input
            type="range"
            min={1}
            max={120}
            value={form.accountAge}
            onChange={(e) => update("accountAge", Number(e.target.value))}
            className="w-full accent-[var(--saffron)]"
          />

          <p className="mt-2 text-sm text-[var(--ink-text)]">
            {form.accountAge} months
          </p>
        </div>

        <button
          onClick={handleEstimate}
          className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-black"
        >
          Estimate Risk
        </button>

        {result && (
          <div className="mt-8 rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-6">

            <div
              className={`inline-flex rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-widest ${
                badgeColor[result.risk_band] ||
                "bg-gray-100 border-gray-300"
              }`}
            >
              {result.risk_band} Risk
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              {result.recommendation}
            </h3>

            <div className="mt-5">
              <h4 className="font-medium mb-2">Detected Signals</h4>

              <ul className="space-y-2">
                {result.signals.map((signal) => (
                  <li
                    key={signal.type}
                    className="rounded-lg bg-white p-3 border border-[var(--paper-line)]"
                  >
                    • {signal.detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CyberFeatureCard>
    </div>
  );
}