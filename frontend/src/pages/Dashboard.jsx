import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  ImagePlus,
  ScanSearch,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const { openSearch } = useSearch();

  const stats = [
    { label: 'TOTAL ANALYSES', value: '5', icon: Activity, iconColor: 'var(--chart-green)' },
    { label: 'BULLISH CALLS', value: '2', icon: ArrowUpRight, iconColor: 'var(--chart-green)' },
    { label: 'BEARISH CALLS', value: '3', icon: ArrowDownRight, iconColor: 'var(--chart-red)' },
    { label: 'AVG CONFIDENCE', value: '80%', icon: TrendingUp, iconColor: 'var(--chart-purple)' },
  ];

  const assets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'EUR/USD', 'AAPL', 'TSLA'];

  const recentActivity = [
    { asset: 'BTC/USDT', time: '4/23/2026, 2:50:54 AM', signal: 'BEARISH', percentage: '80%', color: 'red' },
    { asset: 'EUR/USD', time: '4/22/2026, 6:15:11 PM', signal: 'BULLISH', percentage: '90%', color: 'green' },
    { asset: 'BTC/USDT', time: '4/22/2026, 6:14:20 PM', signal: 'BEARISH', percentage: '86%', color: 'red' },
    { asset: 'BTC/USDT', time: '4/22/2026, 6:14:11 PM', signal: 'BULLISH', percentage: '73%', color: 'green' },
    { asset: 'BTC/USDT', time: '4/19/2026, 4:59:02 PM', signal: 'BEARISH', percentage: '72%', color: 'red' },
  ];

  return (
    <div className="pb-8" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="mb-7">
        <h1 className="mb-1 text-2xl font-semibold tracking-[-0.03em]" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Quick overview of your AI-powered trading activity.</p>
      </div>

      <div
        className="mb-6 overflow-hidden rounded-[24px] border p-5 md:rounded-[28px] md:p-6"
        style={{
          borderColor: 'var(--border)',
          background:
            'radial-gradient(circle at left top, rgba(96, 165, 250, 0.14), transparent 28%), radial-gradient(circle at 85% 15%, rgba(24, 210, 107, 0.16), transparent 24%), var(--card)',
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--chart-blue)' }}>
              <ScanSearch className="h-3.5 w-3.5" />
              Main workflow
            </div>
            <h2 className="mt-4 max-w-[580px] text-2xl font-semibold tracking-[-0.04em] sm:text-[2rem]" style={{ color: 'var(--foreground)' }}>
              Upload a chart screenshot first and let the AI read the image before anything else.
            </h2>
            <p className="mt-3 max-w-[560px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
              Screenshot-based analysis is one of the app&apos;s core flows. The user should be able to jump straight into image upload, get OCR and structure detection, and receive bias, trigger, and invalidation from the chart itself.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/chat-analyzer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <ImagePlus className="h-4 w-4" />
                Upload chart screenshot
              </Link>
              <button
                type="button"
                onClick={openSearch}
                className="inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
              >
                Search asset instead
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                Input
              </p>
              <p className="text-sm font-semibold">Chart screenshot upload</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                AI output
              </p>
              <p className="text-sm font-semibold">Bias, trigger, invalidation</p>
            </div>
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                Priority
              </p>
              <p className="text-sm font-semibold">Upload-first experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border px-5 py-4 transition"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            >
              <div className="mb-4 flex items-start justify-between">
                <p className="text-xs font-semibold tracking-[0.08em]" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                <Icon className="h-4 w-4" style={{ color: stat.iconColor }} />
              </div>
              <p className="text-3xl font-semibold leading-none tracking-[-0.04em]" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Secondary flow</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Search a market directly if you are not starting from a screenshot.</p>
          </div>
          <button
            className="text-sm font-semibold transition"
            style={{ color: 'var(--chart-green)' }}
            onClick={openSearch}
          >
            Search any asset -&gt;
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {assets.map((asset) => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className="rounded-xl px-4 py-2 font-mono text-sm font-semibold transition"
              style={{
                backgroundColor: selectedAsset === asset ? 'var(--primary)' : 'var(--secondary)',
                color: selectedAsset === asset ? 'var(--primary-foreground)' : 'var(--foreground)',
              }}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
          <Clock3 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recent activity</h2>
        </div>

        <div>
          {recentActivity.map((activity, index) => (
            <div
              key={`${activity.asset}-${index}`}
              className="flex items-center justify-between gap-4 border-b px-5 py-4 last:border-b-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: 'var(--secondary)' }}>
                  {activity.color === 'green' ? (
                    <ArrowUpRight className="h-3.5 w-3.5" style={{ color: 'var(--chart-green)' }} />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" style={{ color: 'var(--chart-red)' }} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{activity.asset}</p>
                  <p className="truncate text-xs" style={{ color: 'var(--muted-foreground)' }}>{activity.time}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: activity.color === 'green' ? 'var(--chart-green)' : 'var(--chart-red)' }}
                >
                  {activity.signal}
                </span>
                <span className="w-8 text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>{activity.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
