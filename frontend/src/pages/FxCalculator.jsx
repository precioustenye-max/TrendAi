import { createElement, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calculator,
  ChevronDown,
  DollarSign,
  Gauge,
  Percent,
  ShieldCheck,
  Target,
} from "lucide-react";

const presets = [
  { label: "Conservative", value: 1 },
  { label: "Balanced", value: 2 },
  { label: "Aggressive", value: 5 },
];

const volatilePairs = [
  { symbol: "BTCUSD", pipSize: "1", pipValue: "1" },
  { symbol: "XAUUSD", pipSize: "0.1", pipValue: "10" },
  { symbol: "XAGUSD", pipSize: "0.01", pipValue: "50" },
  { symbol: "GBPUSD", pipSize: "0.0001", pipValue: "10" },
  { symbol: "GBPJPY", pipSize: "0.01", pipValue: "9.1" },
  { symbol: "EURJPY", pipSize: "0.01", pipValue: "9.1" },
  { symbol: "GBPCHF", pipSize: "0.0001", pipValue: "11.2" },
  { symbol: "NAS100", pipSize: "1", pipValue: "1" },
  { symbol: "US30", pipSize: "1", pipValue: "1" },
  { symbol: "USOIL", pipSize: "0.01", pipValue: "10" },
];

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: digits,
  }).format(value);
}

function MetricCard({ icon, label, value, helper, tone = "default" }) {
  const toneStyles = {
    default: {
      borderColor: "var(--border)",
      backgroundColor: "var(--secondary)",
      color: "var(--foreground)",
    },
    primary: {
      borderColor: "color-mix(in srgb, var(--primary) 34%, var(--border))",
      backgroundColor: "color-mix(in srgb, var(--primary) 12%, var(--secondary))",
      color: "var(--foreground)",
    },
    warning: {
      borderColor: "color-mix(in srgb, var(--chart-yellow) 42%, var(--border))",
      backgroundColor: "color-mix(in srgb, var(--chart-yellow) 12%, var(--secondary))",
      color: "var(--foreground)",
    },
  };

  return (
    <div className="rounded-3xl border p-4 sm:p-5" style={toneStyles[tone]}>
      <div className="flex items-center gap-2">
        {createElement(icon, {
          className: "h-5 w-5",
          style: { color: "var(--primary)" },
        })}
        <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-[-0.04em]">{value}</p>
      {helper && (
        <p className="mt-2 text-sm leading-5" style={{ color: "var(--muted-foreground)" }}>
          {helper}
        </p>
      )}
    </div>
  );
}

export default function FxCalculator() {
  const [values, setValues] = useState({
    pair: "XAUUSD",
    accountBalance: "10",
    riskPercent: "1",
    entryPrice: "1.08500",
    stopLoss: "1.08300",
    pipSize: "0.0001",
    pipValue: "10",
  });

  const results = useMemo(() => {
    const accountBalance = toNumber(values.accountBalance);
    const riskPercent = toNumber(values.riskPercent);
    const entryPrice = toNumber(values.entryPrice);
    const stopLoss = toNumber(values.stopLoss);
    const pipSize = toNumber(values.pipSize);
    const pipValue = toNumber(values.pipValue);

    const riskAmount = accountBalance * (riskPercent / 100);
    const priceDistance = Math.abs(entryPrice - stopLoss);
    const stopPips = pipSize > 0 ? priceDistance / pipSize : 0;
    const lotSize = stopPips > 0 && pipValue > 0 ? riskAmount / (stopPips * pipValue) : 0;
    const microLots = lotSize * 100;

    return {
      accountBalance,
      riskPercent,
      riskAmount,
      stopPips,
      lotSize,
      microLots,
      isHighRisk: riskPercent > 2,
      isTooSmall: accountBalance > 0 && riskAmount < 0.1,
    };
  }, [values]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handlePairChange = (symbol) => {
    const selectedPair = volatilePairs.find((pair) => pair.symbol === symbol);

    setValues((current) => ({
      ...current,
      pair: symbol,
      pipSize: selectedPair?.pipSize || current.pipSize,
      pipValue: selectedPair?.pipValue || current.pipValue,
    }));
  };

  return (
    <div className="space-y-5 pb-8">
      <section
        className="overflow-hidden rounded-[28px] border p-5 sm:p-6 lg:p-8"
        style={{
          borderColor: "var(--border)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), transparent 38%), var(--card)",
          color: "var(--foreground)",
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
                color: "var(--primary)",
              }}
            >
              <Calculator className="h-4 w-4" />
              FX Calculator
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Risk management before every trade
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
              Select the pair, enter the amount you have to trade, and TrendAI shows how much
              you should risk before opening a position.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border p-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
            {presets.map((preset) => {
              const isActive = Number(values.riskPercent) === preset.value;

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleChange("riskPercent", String(preset.value))}
                  className="rounded-xl px-3 py-2 text-xs font-bold transition sm:text-sm"
                  style={{
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
          <h2 className="text-lg font-bold">Account Setup</h2>

          <div className="mt-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                Select Pair
              </span>
              <div className="relative">
                <select
                  value={values.pair}
                  onChange={(event) => handlePairChange(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border px-4 pr-11 text-sm font-semibold outline-none transition"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--secondary)",
                    color: "var(--foreground)",
                  }}
                >
                  {volatilePairs.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["accountBalance", "Amount You Have To Trade", "10"],
              ["riskPercent", "Risk Per Trade (%)", "1"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  {label}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={values[key]}
                  placeholder={placeholder}
                  onChange={(event) => handleChange(key, event.target.value)}
                  className="h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none transition"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--secondary)",
                    color: "var(--foreground)",
                  }}
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
            <p className="text-sm font-bold">Risk guide</p>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
              For {values.pair}, with a {formatMoney(results.accountBalance)} account at{" "}
              {formatNumber(results.riskPercent)}% risk, you should risk{" "}
              {formatMoney(results.riskAmount)} on one trade.
            </p>
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-bold">Optional Chart Sizing</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Add entry and stop loss if you also want a suggested lot size.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["entryPrice", "Entry Price", "1.08500"],
                ["stopLoss", "Stop Loss", "1.08300"],
                ["pipSize", "Pip Size", "0.0001"],
                ["pipValue", "Pip Value / Standard Lot", "10"],
              ].map(([key, label, placeholder]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                    {label}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={values[key]}
                    placeholder={placeholder}
                    onChange={(event) => handleChange(key, event.target.value)}
                    className="h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none transition"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--secondary)",
                      color: "var(--foreground)",
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              icon={DollarSign}
              label="You Should Risk"
              value={formatMoney(results.riskAmount)}
              helper={`${formatNumber(results.riskPercent)}% of ${formatMoney(results.accountBalance)}`}
              tone="primary"
            />
            <MetricCard
              icon={Percent}
              label="Recommended Range"
              value={`1% - 2%`}
              helper={`${formatMoney(results.accountBalance * 0.01)} to ${formatMoney(results.accountBalance * 0.02)} per trade`}
              tone="primary"
            />
            <MetricCard
              icon={Gauge}
              label="Stop Distance"
              value={`${formatNumber(results.stopPips, 1)} pips`}
              helper="Based on entry minus stop loss"
            />
            <MetricCard
              icon={Target}
              label="Suggested Lot Size"
              value={formatNumber(results.lotSize, 4)}
              helper={`${formatNumber(results.microLots, 2)} micro lots`}
              tone="primary"
            />
            <MetricCard
              icon={ShieldCheck}
              label="Risk Status"
              value={results.isHighRisk ? "Too high" : "Controlled"}
              helper={results.isHighRisk ? "Try 1% to 2% for better survival." : "This is within a safer risk range."}
              tone={results.isHighRisk ? "warning" : "default"}
            />
          </div>

          {(results.isHighRisk || results.isTooSmall) && (
            <div
              className="flex items-start gap-3 rounded-3xl border p-4"
              style={{
                borderColor: "color-mix(in srgb, var(--chart-yellow) 42%, var(--border))",
                backgroundColor: "color-mix(in srgb, var(--chart-yellow) 10%, var(--card))",
              }}
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--chart-yellow)" }} />
              <p className="text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
                {results.isHighRisk
                  ? "This risk percent can damage a small account quickly. Consider dropping it to 1% or 2%."
                  : "The account is very small, so the calculated risk may be below the minimum your broker allows."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
