import { Clock, TrendingUp, TrendingDown, Download, Filter } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const [filterType, setFilterType] = useState('all');

  const historyData = [
    { id: 1, asset: 'BTC/USDT', signal: 'BULLISH', confidence: 85, entry: 45200, exit: 46800, profitLoss: 1600, profitLossPercent: 3.54, date: '2026-04-25', time: '14:32:00' },
    { id: 2, asset: 'ETH/USDT', signal: 'BEARISH', confidence: 72, entry: 2480, exit: 2420, profitLoss: -60, profitLossPercent: -2.42, date: '2026-04-25', time: '13:15:22' },
    { id: 3, asset: 'SOL/USDT', signal: 'BULLISH', confidence: 78, entry: 142.5, exit: 148.3, profitLoss: 5.8, profitLossPercent: 4.07, date: '2026-04-24', time: '22:45:00' },
    { id: 4, asset: 'EUR/USD', signal: 'BULLISH', confidence: 65, entry: 1.085, exit: 1.092, profitLoss: 0.007, profitLossPercent: 0.64, date: '2026-04-24', time: '18:30:15' },
    { id: 5, asset: 'AAPL', signal: 'BEARISH', confidence: 81, entry: 175.4, exit: 171.2, profitLoss: -4.2, profitLossPercent: -2.39, date: '2026-04-23', time: '15:20:00' },
  ];

  const filteredData =
    filterType === 'all'
      ? historyData
      : historyData.filter((item) => item.signal.toLowerCase() === filterType);

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className="p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-8 w-8" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-bold">Analysis History</h1>
        </div>
        <p style={{ color: 'var(--muted-foreground)' }}>
          View all past AI analysis signals and their outcomes
        </p>
      </div>

      <div
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        className="mb-8 rounded-lg border p-6"
      >
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5" />
          <button
            onClick={() => setFilterType('all')}
            className="rounded px-4 py-2 font-semibold transition"
            style={{
              backgroundColor: filterType === 'all' ? 'var(--primary)' : 'var(--secondary)',
              color: filterType === 'all' ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            All Signals
          </button>
          <button
            onClick={() => setFilterType('bullish')}
            className="rounded px-4 py-2 font-semibold transition"
            style={{
              backgroundColor: filterType === 'bullish' ? 'var(--primary)' : 'var(--secondary)',
              color: filterType === 'bullish' ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            <TrendingUp className="mr-2 inline h-4 w-4" />
            Bullish
          </button>
          <button
            onClick={() => setFilterType('bearish')}
            className="rounded px-4 py-2 font-semibold transition"
            style={{
              backgroundColor: filterType === 'bearish' ? 'var(--primary)' : 'var(--secondary)',
              color: filterType === 'bearish' ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            <TrendingDown className="mr-2 inline h-4 w-4" />
            Bearish
          </button>
          <button
            className="ml-auto flex items-center gap-2 rounded px-4 py-2 font-semibold transition"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        className="overflow-x-auto rounded-lg border"
      >
        <table className="w-full">
          <thead className="border-b" style={{ borderBottomColor: 'var(--border)' }}>
            <tr>
              {['Asset', 'Signal', 'Confidence', 'Entry', 'Exit', 'P/L', 'Date'].map((heading) => (
                <th
                  key={heading}
                  className={`px-6 py-4 font-bold ${['Entry', 'Exit', 'P/L'].includes(heading) ? 'text-right' : 'text-left'}`}
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b transition"
                style={{ borderBottomColor: 'var(--secondary)' }}
              >
                <td className="px-6 py-4 font-mono font-semibold">{item.asset}</td>
                <td className="px-6 py-4">
                  <div
                    className="flex w-fit items-center gap-1 rounded px-3 py-1 text-sm font-bold"
                    style={{
                      backgroundColor: item.signal === 'BULLISH' ? 'var(--chart-green)' : 'var(--chart-red)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {item.signal === 'BULLISH' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {item.signal}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-16 overflow-hidden rounded-full"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <div
                        className="h-full"
                        style={{ backgroundColor: 'var(--chart-green)', width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="font-semibold">{item.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono">{item.entry}</td>
                <td className="px-6 py-4 text-right font-mono">{item.exit}</td>
                <td
                  className="px-6 py-4 text-right font-mono font-bold"
                  style={{ color: item.profitLoss >= 0 ? 'var(--chart-green)' : 'var(--chart-red)' }}
                >
                  {item.profitLoss >= 0 ? '+' : ''}
                  {item.profitLoss} ({item.profitLossPercent.toFixed(2)}%)
                </td>
                <td className="px-6 py-4" style={{ color: 'var(--muted-foreground)' }}>
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
