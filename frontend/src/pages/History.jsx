import {
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useState } from 'react';

const historyData = [
  { id: 1, asset: 'BTC/USDT', signal: 'BULLISH', confidence: 85, entry: 45200, exit: 46800, profitLoss: 1600, profitLossPercent: 3.54, date: '2026-04-25', time: '14:32:00' },
  { id: 2, asset: 'ETH/USDT', signal: 'BEARISH', confidence: 72, entry: 2480, exit: 2420, profitLoss: -60, profitLossPercent: -2.42, date: '2026-04-25', time: '13:15:22' },
  { id: 3, asset: 'SOL/USDT', signal: 'BULLISH', confidence: 78, entry: 142.5, exit: 148.3, profitLoss: 5.8, profitLossPercent: 4.07, date: '2026-04-24', time: '22:45:00' },
  { id: 4, asset: 'EUR/USD', signal: 'BULLISH', confidence: 65, entry: 1.085, exit: 1.092, profitLoss: 0.007, profitLossPercent: 0.64, date: '2026-04-24', time: '18:30:15' },
  { id: 5, asset: 'AAPL', signal: 'BEARISH', confidence: 81, entry: 175.4, exit: 171.2, profitLoss: -4.2, profitLossPercent: -2.39, date: '2026-04-23', time: '15:20:00' },
];

const filters = [
  { key: 'all', label: 'All Signals', icon: Filter },
  { key: 'bullish', label: 'Bullish', icon: TrendingUp },
  { key: 'bearish', label: 'Bearish', icon: TrendingDown },
];

const formatValue = (value) => {
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString();
  }

  return value;
};

export default function History() {
  const [filterType, setFilterType] = useState('all');

  const filteredData =
    filterType === 'all'
      ? historyData
      : historyData.filter((item) => item.signal.toLowerCase() === filterType);

  const bullishCount = historyData.filter((item) => item.signal === 'BULLISH').length;
  const bearishCount = historyData.filter((item) => item.signal === 'BEARISH').length;
  const winRate = Math.round((historyData.filter((item) => item.profitLoss > 0).length / historyData.length) * 100);
  const totalProfitLoss = historyData.reduce((sum, item) => sum + item.profitLoss, 0);

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
  };

  const mutedText = { color: 'var(--muted-foreground)' };

  return (
    <div
      className="space-y-6 p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <section
        className="rounded-3xl border p-5 sm:p-6 lg:p-8"
        style={{
          ...cardStyle,
          backgroundImage:
            'linear-gradient(135deg, rgba(96,165,250,0.08), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ backgroundColor: 'rgba(96,165,250,0.1)', color: 'var(--primary)' }}>
              <Clock className="h-4 w-4" />
              Analysis archive
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Analysis History</h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base" style={mutedText}>
                Review previous AI trade analysis, filter by signal direction, and monitor historical performance from one place.
              </p>
            </div>
          </div>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:w-auto"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            <Download className="h-4 w-4" />
            Export History
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Analyses', value: historyData.length, icon: BarChart3, tone: 'var(--primary)' },
          { label: 'Bullish Signals', value: bullishCount, icon: TrendingUp, tone: 'var(--chart-green)' },
          { label: 'Bearish Signals', value: bearishCount, icon: TrendingDown, tone: 'var(--chart-red)' },
          {
            label: 'Net P/L',
            value: `${totalProfitLoss >= 0 ? '+' : ''}${formatValue(totalProfitLoss)}`,
            icon: totalProfitLoss >= 0 ? ArrowUpRight : ArrowDownRight,
            tone: totalProfitLoss >= 0 ? 'var(--chart-green)' : 'var(--chart-red)',
            meta: `${winRate}% win rate`,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-3xl border p-5" style={cardStyle}>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium" style={mutedText}>{item.label}</span>
                <div className="rounded-2xl p-2" style={{ backgroundColor: 'rgba(96,165,250,0.08)', color: item.tone }}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold tracking-[-0.03em]">{item.value}</div>
              <p className="mt-2 text-sm" style={mutedText}>{item.meta || 'Rolling performance snapshot'}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border p-4 sm:p-5" style={cardStyle}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Filter Signals</h2>
            <p className="mt-1 text-sm" style={mutedText}>Switch views without losing the broader performance context.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = filterType === filter.key;

              return (
                <button
                  key={filter.key}
                  onClick={() => setFilterType(filter.key)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition"
                  style={{
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--secondary)',
                    color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border" style={cardStyle}>
        <div className="border-b px-5 py-4" style={{ borderBottomColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold">Signal Log</h2>
          <p className="mt-1 text-sm" style={mutedText}>{filteredData.length} records shown</p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px]">
            <thead className="border-b" style={{ borderBottomColor: 'var(--border)' }}>
              <tr>
                {['Asset', 'Signal', 'Confidence', 'Entry', 'Exit', 'P/L', 'Date'].map((heading) => (
                  <th
                    key={heading}
                    className={`px-6 py-4 text-sm font-semibold ${['Entry', 'Exit', 'P/L'].includes(heading) ? 'text-right' : 'text-left'}`}
                    style={mutedText}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0" style={{ borderBottomColor: 'var(--border)' }}>
                  <td className="px-6 py-5 font-mono font-semibold">{item.asset}</td>
                  <td className="px-6 py-5">
                    <div
                      className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-[0.08em]"
                      style={{
                        backgroundColor: item.signal === 'BULLISH' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                        color: item.signal === 'BULLISH' ? 'var(--chart-green)' : 'var(--chart-red)',
                      }}
                    >
                      {item.signal === 'BULLISH' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {item.signal}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--secondary)' }}>
                        <div className="h-full rounded-full" style={{ backgroundColor: 'var(--chart-green)', width: `${item.confidence}%` }} />
                      </div>
                      <span className="font-semibold">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono">{formatValue(item.entry)}</td>
                  <td className="px-6 py-5 text-right font-mono">{formatValue(item.exit)}</td>
                  <td
                    className="px-6 py-5 text-right font-mono font-bold"
                    style={{ color: item.profitLoss >= 0 ? 'var(--chart-green)' : 'var(--chart-red)' }}
                  >
                    {item.profitLoss >= 0 ? '+' : ''}
                    {formatValue(item.profitLoss)} ({item.profitLossPercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-5" style={mutedText}>
                    <div>{item.date}</div>
                    <div className="text-xs">{item.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 p-4 lg:hidden">
          {filteredData.map((item) => (
            <article key={item.id} className="rounded-2xl border p-4" style={{ ...cardStyle, backgroundColor: 'var(--background)' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-base font-semibold">{item.asset}</p>
                  <p className="mt-1 text-sm" style={mutedText}>{item.date} at {item.time}</p>
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: item.signal === 'BULLISH' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                    color: item.signal === 'BULLISH' ? 'var(--chart-green)' : 'var(--chart-red)',
                  }}
                >
                  {item.signal === 'BULLISH' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {item.signal}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p style={mutedText}>Confidence</p>
                  <p className="mt-1 font-semibold">{item.confidence}%</p>
                </div>
                <div>
                  <p style={mutedText}>P/L</p>
                  <p className="mt-1 font-semibold" style={{ color: item.profitLoss >= 0 ? 'var(--chart-green)' : 'var(--chart-red)' }}>
                    {item.profitLoss >= 0 ? '+' : ''}
                    {formatValue(item.profitLoss)} ({item.profitLossPercent.toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p style={mutedText}>Entry</p>
                  <p className="mt-1 font-mono">{formatValue(item.entry)}</p>
                </div>
                <div>
                  <p style={mutedText}>Exit</p>
                  <p className="mt-1 font-mono">{formatValue(item.exit)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
