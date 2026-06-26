import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BadgeDollarSign,
  BarChart3,
  Check,
  Clock3,
  Copy,
  Gauge,
  Lightbulb,
  Shield,
  Target,
  TrendingDown,
} from "lucide-react";

const fallbackAnalysis = {
  trend: "Bearish",
  tradeIdea: "Sell",
  entry: "1202.00",
  stopLoss: "1220.00",
  takeProfit: "1162.00",
  riskReward: "1:2",
  strength: "Strong",
  duration: "3h 30m",
};

const resultCards = [
  {
    key: "trend",
    label: "Trend",
    icon: TrendingDown,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  {
    key: "tradeIdea",
    label: "Trade Idea",
    icon: Lightbulb,
    className: "border-sky-200 bg-sky-50 text-sky-950",
  },
  {
    key: "entry",
    label: "Entry",
    icon: Target,
    className: "col-span-2 lg:col-span-2 border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    key: "stopLoss",
    label: "SL",
    icon: Shield,
    className: "border-rose-200 bg-rose-50 text-rose-950",
  },
  {
    key: "takeProfit",
    label: "TP",
    icon: BadgeDollarSign,
    className: "border-purple-200 bg-purple-50 text-purple-950",
  },
  {
    key: "riskReward",
    label: "RR Ratio",
    icon: Gauge,
    className: "col-span-2 lg:col-span-2 border-yellow-200 bg-yellow-50 text-yellow-950",
  },
  {
    key: "strength",
    label: "Strength",
    icon: BarChart3,
    className: "border-slate-200 bg-white text-slate-950",
  },
  {
    key: "duration",
    label: "Duration",
    icon: Clock3,
    className: "border-slate-200 bg-white text-slate-950",
  },
];

function formatTradeFocus(focus) {
  if (!focus) {
    return "Scalp";
  }

  return focus === "scalping" ? "Scalp" : focus.charAt(0).toUpperCase() + focus.slice(1);
}

function formatAnalysisDate(date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatAnalysisTime(date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function TradeAnalysisResult() {
  const location = useLocation();
  const [copiedKey, setCopiedKey] = useState("");

  const setup = location.state || {};
  const analyzedAt = useMemo(
    () => (setup.analyzedAt ? new Date(setup.analyzedAt) : new Date()),
    [setup.analyzedAt]
  );

  const copyValue = async (key, value) => {
    try {
      await navigator.clipboard?.writeText(String(value));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1200);
    } catch {
      setCopiedKey("");
    }
  };

  return (
    <div className="mx-auto max-w-[1040px] pb-8">
      <section className="overflow-hidden rounded-[28px] border bg-white text-slate-950 shadow-xl shadow-black/10">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <Link
              to="/chat-analyzer"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
              aria-label="Back to analyzer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-center text-base font-bold sm:text-lg">Trade Analysis</h1>
            <span className="h-10 w-10" />
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
            >
              Mark Analysis Outcome
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-semibold text-slate-600 lg:grid-cols-4">
            <p>
              Pair: <span className="text-slate-950">{setup.instrument || "volatility100"}</span>
            </p>
            <p>
              Time: <span className="text-slate-950">{formatAnalysisTime(analyzedAt)}</span>
            </p>
            <p>
              Bias: <span className="text-slate-950">{formatTradeFocus(setup.tradeFocus)}</span>
            </p>
            <p>
              Date: <span className="text-slate-950">{formatAnalysisDate(analyzedAt)}</span>
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {resultCards.map((card) => {
              const Icon = card.icon;
              const value = fallbackAnalysis[card.key];
              const isCopied = copiedKey === card.key;

              return (
                <div
                  key={card.key}
                  className={`min-h-[94px] rounded-xl border p-3 sm:p-4 ${card.className}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <p className="truncate text-xs font-semibold uppercase text-slate-500">
                        {card.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyValue(card.key, value)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/70 hover:text-slate-950"
                      aria-label={`Copy ${card.label}`}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-3 text-lg font-extrabold sm:text-xl">{value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-950">Copy/Paste Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {fallbackAnalysis.tradeIdea} {setup.instrument || "volatility100"} from{" "}
              {fallbackAnalysis.entry}, SL {fallbackAnalysis.stopLoss}, TP{" "}
              {fallbackAnalysis.takeProfit}. RR {fallbackAnalysis.riskReward}. Strength{" "}
              {fallbackAnalysis.strength}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
