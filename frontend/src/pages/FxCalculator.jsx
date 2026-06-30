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

const instrumentProfiles = [
  {
    symbol: "EURUSD",
    group: "Major FX",
    volatility: "Low",
    pipSize: "0.0001",
    pipValue: "10",
    defaultEntry: "1.08500",
    suggestedStopPips: 20,
    typicalRange: "50-90 pips/day",
    recommendedRisk: 2,
    note: "Cleaner spread and lower average movement than crosses or metals.",
  },
  {
    symbol: "GBPUSD",
    group: "Major FX",
    volatility: "Medium",
    pipSize: "0.0001",
    pipValue: "10",
    defaultEntry: "1.27000",
    suggestedStopPips: 30,
    typicalRange: "80-130 pips/day",
    recommendedRisk: 1.5,
    note: "Moves faster than EURUSD, so stops usually need more breathing room.",
  },
  {
    symbol: "USDJPY",
    group: "JPY FX",
    volatility: "Medium",
    pipSize: "0.01",
    pipValue: "9.1",
    defaultEntry: "157.80",
    suggestedStopPips: 28,
    typicalRange: "70-120 pips/day",
    recommendedRisk: 1.5,
    note: "JPY pairs use 0.01 pip size and can accelerate around news.",
  },
  {
    symbol: "GBPJPY",
    group: "JPY Cross",
    volatility: "High",
    pipSize: "0.01",
    pipValue: "9.1",
    defaultEntry: "201.50",
    suggestedStopPips: 55,
    typicalRange: "130-220 pips/day",
    recommendedRisk: 1,
    note: "A fast cross pair. Smaller risk and wider stops are usually safer.",
  },
  {
    symbol: "EURJPY",
    group: "JPY Cross",
    volatility: "Medium-high",
    pipSize: "0.01",
    pipValue: "9.1",
    defaultEntry: "170.30",
    suggestedStopPips: 42,
    typicalRange: "100-170 pips/day",
    recommendedRisk: 1.25,
    note: "More volatile than EURUSD because both EUR and JPY flows matter.",
  },
  {
    symbol: "GBPCHF",
    group: "FX Cross",
    volatility: "Medium-high",
    pipSize: "0.0001",
    pipValue: "11.2",
    defaultEntry: "1.13500",
    suggestedStopPips: 38,
    typicalRange: "80-150 pips/day",
    recommendedRisk: 1.25,
    note: "Cross-pair movement and pip value can make risk climb quickly.",
  },
  {
    symbol: "XAUUSD",
    group: "Metal",
    volatility: "Very high",
    pipSize: "0.1",
    pipValue: "10",
    defaultEntry: "2330.0",
    suggestedStopPips: 80,
    typicalRange: "150-350 points/day",
    recommendedRisk: 1,
    note: "Gold is sharp and wick-heavy. Smaller lot size is usually needed.",
  },
  {
    symbol: "XAGUSD",
    group: "Metal",
    volatility: "High",
    pipSize: "0.01",
    pipValue: "50",
    defaultEntry: "29.50",
    suggestedStopPips: 45,
    typicalRange: "60-160 points/day",
    recommendedRisk: 1,
    note: "Silver has a large pip value, so lots can become dangerous fast.",
  },
  {
    symbol: "NAS100",
    group: "Index",
    volatility: "Very high",
    pipSize: "1",
    pipValue: "1",
    defaultEntry: "18420",
    suggestedStopPips: 120,
    typicalRange: "200-600 points/day",
    recommendedRisk: 0.75,
    note: "Index volatility expands hard during US sessions and news.",
  },
  {
    symbol: "US30",
    group: "Index",
    volatility: "Very high",
    pipSize: "1",
    pipValue: "1",
    defaultEntry: "39120",
    suggestedStopPips: 180,
    typicalRange: "300-800 points/day",
    recommendedRisk: 0.75,
    note: "Large point moves mean smaller size is usually healthier.",
  },
  {
    symbol: "USOIL",
    group: "Commodity",
    volatility: "High",
    pipSize: "0.01",
    pipValue: "10",
    defaultEntry: "81.20",
    suggestedStopPips: 70,
    typicalRange: "120-300 points/day",
    recommendedRisk: 1,
    note: "Oil reacts sharply to inventory data and geopolitical headlines.",
  },
  {
    symbol: "BTCUSD",
    group: "Crypto",
    volatility: "Extreme",
    pipSize: "1",
    pipValue: "1",
    defaultEntry: "64180",
    suggestedStopPips: 900,
    typicalRange: "1,500-5,000 points/day",
    recommendedRisk: 0.5,
    note: "Crypto trades continuously and can gap through tight stops.",
  },
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

function buildStopLoss(entry, stopPips, pipSize, direction) {
  const price = direction === "sell" ? entry + stopPips * pipSize : entry - stopPips * pipSize;
  const digits = pipSize >= 1 ? 0 : pipSize >= 0.1 ? 1 : pipSize >= 0.01 ? 2 : 5;
  return price.toFixed(digits);
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
    direction: "buy",
    entryPrice: "2330.0",
    stopLoss: "2322.0",
    pipSize: "0.1",
    pipValue: "10",
  });

  const selectedProfile =
    instrumentProfiles.find((profile) => profile.symbol === values.pair) || instrumentProfiles[0];

  const results = useMemo(() => {
    const accountBalance = toNumber(values.accountBalance);
    const riskPercent = toNumber(values.riskPercent);
    const entryPrice = toNumber(values.entryPrice);
    const stopLoss = toNumber(values.stopLoss);
    const pipSize = toNumber(values.pipSize);
    const pipValue = toNumber(values.pipValue);
    const recommendedRisk = selectedProfile.recommendedRisk;

    const riskAmount = accountBalance * (riskPercent / 100);
    const priceDistance = Math.abs(entryPrice - stopLoss);
    const stopPips = pipSize > 0 ? priceDistance / pipSize : 0;
    const lotSize = stopPips > 0 && pipValue > 0 ? riskAmount / (stopPips * pipValue) : 0;
    const microLots = lotSize * 100;
    const recommendedRiskAmount = accountBalance * (recommendedRisk / 100);
    const recommendedLotSize =
      selectedProfile.suggestedStopPips > 0 && pipValue > 0
        ? recommendedRiskAmount / (selectedProfile.suggestedStopPips * pipValue)
        : 0;
    const stopVsProfile =
      selectedProfile.suggestedStopPips > 0 ? stopPips / selectedProfile.suggestedStopPips : 0;

    return {
      accountBalance,
      riskPercent,
      riskAmount,
      stopPips,
      lotSize,
      microLots,
      recommendedRisk,
      recommendedRiskAmount,
      recommendedLotSize,
      stopVsProfile,
      isHighRisk: riskPercent > recommendedRisk,
      isStopTight: stopPips > 0 && stopPips < selectedProfile.suggestedStopPips * 0.6,
      isTooSmall: accountBalance > 0 && riskAmount < 0.1,
    };
  }, [selectedProfile, values]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handlePairChange = (symbol) => {
    const selectedPair = instrumentProfiles.find((pair) => pair.symbol === symbol);
    const entry = toNumber(selectedPair?.defaultEntry);
    const pipSize = toNumber(selectedPair?.pipSize);
    const stopLoss = buildStopLoss(entry, selectedPair?.suggestedStopPips || 0, pipSize, values.direction);

    setValues((current) => ({
      ...current,
      pair: symbol,
      pipSize: selectedPair?.pipSize || current.pipSize,
      pipValue: selectedPair?.pipValue || current.pipValue,
      entryPrice: selectedPair?.defaultEntry || current.entryPrice,
      stopLoss: stopLoss || current.stopLoss,
    }));
  };

  const handleDirectionChange = (direction) => {
    const entry = toNumber(values.entryPrice);
    const pipSize = toNumber(values.pipSize);
    const stopLoss = buildStopLoss(entry, selectedProfile.suggestedStopPips, pipSize, direction);

    setValues((current) => ({
      ...current,
      direction,
      stopLoss,
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
                  {instrumentProfiles.map((pair) => (
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold">Risk guide</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--primary)" }}>
                  {selectedProfile.group} / {selectedProfile.volatility} volatility
                </p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "var(--card)", color: "var(--muted-foreground)" }}>
                {selectedProfile.typicalRange}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
              For {values.pair}, with a {formatMoney(results.accountBalance)} account at{" "}
              {formatNumber(results.riskPercent)}% risk, you should risk{" "}
              {formatMoney(results.riskAmount)} on one trade. {selectedProfile.note}
            </p>
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-sm font-bold">Optional Chart Sizing</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              Add entry and stop loss if you also want a suggested lot size.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                  Direction
                </span>
                <div className="grid h-12 grid-cols-2 gap-2 rounded-2xl border p-1" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
                  {[
                    ["buy", "Buy"],
                    ["sell", "Sell"],
                  ].map(([value, label]) => {
                    const isActive = values.direction === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleDirectionChange(value)}
                        className="rounded-xl text-sm font-bold transition"
                        style={{
                          backgroundColor: isActive ? "var(--primary)" : "transparent",
                          color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </label>
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
              label="Pair Risk Cap"
              value={`Max ${formatNumber(results.recommendedRisk)}%`}
              helper={`${formatMoney(results.recommendedRiskAmount)} suggested cap for ${values.pair}`}
              tone="primary"
            />
            <MetricCard
              icon={Gauge}
              label="Stop Distance"
              value={`${formatNumber(results.stopPips, 1)} pips`}
              helper={`Profile stop: about ${formatNumber(selectedProfile.suggestedStopPips, 0)} pips`}
              tone={results.isStopTight ? "warning" : "default"}
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
              value={results.isHighRisk || results.isStopTight ? "Needs caution" : "Controlled"}
              helper={
                results.isHighRisk
                  ? `${values.pair} is better capped near ${formatNumber(results.recommendedRisk)}% risk.`
                  : results.isStopTight
                    ? "Your stop is tight compared with this pair's volatility profile."
                    : "This fits the pair's volatility profile."
              }
              tone={results.isHighRisk || results.isStopTight ? "warning" : "default"}
            />
            <MetricCard
              icon={Calculator}
              label="Profile Lot Guide"
              value={formatNumber(results.recommendedLotSize, 4)}
              helper={`Uses ${formatNumber(results.recommendedRisk)}% risk and ${formatNumber(selectedProfile.suggestedStopPips, 0)} pips`}
            />
          </div>

          {(results.isHighRisk || results.isStopTight || results.isTooSmall) && (
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
                  ? `${values.pair} is ${selectedProfile.volatility.toLowerCase()} volatility, so ${formatNumber(results.riskPercent)}% risk may be too aggressive. Consider ${formatNumber(results.recommendedRisk)}% or lower.`
                  : results.isStopTight
                    ? `The stop is much tighter than the ${values.pair} profile stop. A normal wick can hit it before the setup has room to work.`
                    : "The account is very small, so the calculated risk may be below the minimum your broker allows."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
