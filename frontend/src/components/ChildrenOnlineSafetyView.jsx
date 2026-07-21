import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Search,
  Baby,
  Clock,
  Filter,
  MapPinned,
  History,
  Eye,
  MessageCircleWarning,
  UserRound,
  Lock,
} from "lucide-react";

import CyberFeatureCard from "./CyberFeatureCard";
import { analyzeChildrenOnlineRisk } from "../cyberFeatures/childrenOnlineSafety";

export default function ChildrenOnlineSafetyView() {
  const [childAge, setChildAge] = useState(8);
  const [hasParentalControls, setHasParentalControls] = useState(false);
  const [hasScreenTimeLimits, setHasScreenTimeLimits] = useState(false);
  const [hasContentFilters, setHasContentFilters] = useState(false);
  const [hasLocationTracking, setHasLocationTracking] = useState(false);
  const [hasOnlineActivityLogs, setHasOnlineActivityLogs] = useState(false);
  const [hasSafeSearch, setHasSafeSearch] = useState(false);

  const [message, setMessage] = useState(
    "Hi! I saw your profile. Want to play a game together? Click here to download."
  );

  const [result, setResult] = useState(null);

  const protections = [
    {
      label: "Parental Controls",
      value: hasParentalControls,
      setter: setHasParentalControls,
      icon: Shield,
    },
    {
      label: "Screen Time Limits",
      value: hasScreenTimeLimits,
      setter: setHasScreenTimeLimits,
      icon: Clock,
    },
    {
      label: "Content Filters",
      value: hasContentFilters,
      setter: setHasContentFilters,
      icon: Filter,
    },
    {
      label: "Location Tracking",
      value: hasLocationTracking,
      setter: setHasLocationTracking,
      icon: MapPinned,
    },
    {
      label: "Activity Logs",
      value: hasOnlineActivityLogs,
      setter: setHasOnlineActivityLogs,
      icon: History,
    },
    {
      label: "Safe Search",
      value: hasSafeSearch,
      setter: setHasSafeSearch,
      icon: Eye,
    },
  ];

  const enabledProtections = protections.filter((p) => p.value).length;

  const runAnalysis = () => {
    setResult(
      analyzeChildrenOnlineRisk({
        childAge,
        hasParentalControls,
        hasScreenTimeLimits,
        hasContentFilters,
        hasLocationTracking,
        hasOnlineActivityLogs,
        hasSafeSearch,
        message,
      })
    );
  };

  const riskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "critical":
        return "text-red-400 bg-red-500/15 border-red-500/30";

      case "high":
        return "text-orange-400 bg-orange-500/15 border-orange-500/30";

      case "medium":
        return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";

      default:
        return "text-emerald-400 bg-emerald-500/15 border-emerald-500/30";
    }
  };

  const RiskIcon = () => {
    if (!result) return Shield;

    switch (result.risk_band?.toLowerCase()) {
      case "critical":
      case "high":
        return ShieldAlert;

      case "medium":
        return AlertTriangle;

      default:
        return ShieldCheck;
    }
  };

  const Icon = RiskIcon();

  return (
    <CyberFeatureCard
      title="Children's Online Safety"
      icon={<Baby className="h-6 w-6 text-cyan-400" />}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="flex items-center gap-4">
            <Lock className="h-8 w-8 text-cyan-400" />

            <div>
              <h2 className="text-2xl font-bold text-white">
                Children's Online Safety Assessment
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Evaluate how well a child is protected online using parental
                controls, filters, monitoring, and security best practices.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Child Age
            </p>

            <h2 className="mt-2 text-4xl font-bold text-cyan-400">
              {childAge}
            </h2>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Enabled Protections
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              {enabledProtections}/6
            </h2>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Protection Score
            </p>

            <h2 className="mt-2 text-4xl font-bold text-emerald-400">
              {Math.round((enabledProtections / 6) * 100)}%
            </h2>
          </div>

        </div>

        {/* Age */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <label className="mb-3 flex items-center gap-2 font-semibold text-white">
            <UserRound className="h-5 w-5 text-cyan-400" />
            Child's Age
          </label>

          <input
            type="number"
            min="1"
            max="17"
            value={childAge}
            onChange={(e) =>
              setChildAge(parseInt(e.target.value) || 1)
            }
            className="w-32 rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-cyan-500"
          />
        </div>

        {/* Protection Grid */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Security Protections
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {protections.map((item) => {
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`rounded-xl border p-5 transition ${
                    item.value
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-slate-700 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ItemIcon
                        className={`h-6 w-6 ${
                          item.value
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      />

                      <span className="font-medium text-white">
                        {item.label}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) =>
                        item.setter(e.target.checked)
                      }
                      className="h-5 w-5 accent-cyan-500"
                    />
                  </div>

                  <div className="mt-4 text-xs">
                    <span
                      className={`font-semibold ${
                        item.value
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.value ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suspicious Message */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <label className="mb-3 flex items-center gap-2 font-semibold text-white">
            <MessageCircleWarning className="h-5 w-5 text-cyan-400" />
            Suspicious Message Received
          </label>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-cyan-500"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={runAnalysis}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 font-semibold text-white transition hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <Search className="h-5 w-5" />
          Assess Child Safety
        </button>

        {/* Result */}
        {result && (
          <div className="space-y-5 rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-cyan-400" />

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Safety Assessment
                  </h2>

                  <p className="text-sm text-slate-400">
                    Online safety evaluation completed
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full border px-4 py-2 text-sm font-bold uppercase ${riskColor(
                  result.risk_band
                )}`}
              >
                {result.risk_band} Risk
              </span>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-slate-800/60 p-5">
              <h3 className="mb-2 font-semibold text-cyan-400">
                Recommendation
              </h3>

              <p className="text-slate-300">
                {result.recommendation}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">
                Risk Indicators
              </h3>

              <div className="space-y-3">
                {result.signals.map((signal, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                  >
                    <AlertTriangle className="mt-1 h-5 w-5 text-yellow-400" />

                    <p className="text-sm text-slate-300">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </CyberFeatureCard>
  );
}