import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  ImagePlus,
  ScanSearch,
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { getDashboardStats, getLearningPerformance } from '../lib/api';

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [learningPerformance, setLearningPerformance] = useState(null);
  const [statsError, setStatsError] = useState('');
  const { openSearch } = useSearch();

  useEffect(() => {
    let ignore = false;

    getDashboardStats()
      .then((data) => {
        if (!ignore) {
          setDashboardStats(data);
          setStatsError('');
        }
      })
      .catch((error) => {
        if (!ignore) {
          setStatsError(error instanceof Error ? error.message : 'Unable to load dashboard stats');
        }
      });

    getLearningPerformance()
      .then((data) => {
        if (!ignore) {
          setLearningPerformance(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLearningPerformance(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'TOTAL ANALYSES', value: String(dashboardStats?.totalAnalyses || 0), icon: Activity, iconColor: 'var(--chart-green)' },
      { label: 'BULLISH CALLS', value: String(dashboardStats?.bullishCount || 0), icon: ArrowUpRight, iconColor: 'var(--chart-green)' },
      { label: 'BEARISH CALLS', value: String(dashboardStats?.bearishCount || 0), icon: ArrowDownRight, iconColor: 'var(--chart-red)' },
      { label: 'WIN RATE', value: dashboardStats?.winRate == null ? 'N/A' : `${Math.round(dashboardStats.winRate)}%`, icon: TrendingUp, iconColor: 'var(--chart-purple)' },
    ];
  }, [dashboardStats]);

  const learningStats = useMemo(() => {
    const recentAnalyses = dashboardStats?.recentAnalyses || [];
    const tagStats = new Map();
    const pairStats = new Map();
    const timeframeStats = new Map();

    recentAnalyses.forEach((analysis) => {
      const result = analysis.tradeResult?.result;

      if (!result) {
        return;
      }

      const addStat = (map, key) => {
        if (!key) {
          return;
        }

        const current = map.get(key) || { wins: 0, total: 0 };
        current.total += 1;
        current.wins += result === 'win' ? 1 : 0;
        map.set(key, current);
      };

      (analysis.strategyTags || []).forEach((tag) => addStat(tagStats, tag));
      addStat(pairStats, analysis.asset);
      addStat(timeframeStats, analysis.timeframe);
    });

    const ranked = (map) =>
      [...map.entries()]
        .map(([label, value]) => ({
          label,
          total: value.total,
          winRate: value.total ? Math.round((value.wins / value.total) * 100) : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate || b.total - a.total);

    const tags = ranked(tagStats);

    return {
      bestTags: tags.filter((item) => item.winRate >= 50).slice(0, 3),
      weakTags: tags.filter((item) => item.winRate < 50).reverse().slice(0, 3),
      pairPerformance: ranked(pairStats).slice(0, 3),
      timeframePerformance: ranked(timeframeStats).slice(0, 3),
    };
  }, [dashboardStats]);

  const recentActivity = (dashboardStats?.recentAnalyses || []).map((analysis) => ({
    asset: analysis.asset || 'Unknown',
    time: analysis.createdAt ? new Date(analysis.createdAt).toLocaleString() : '',
    signal: analysis.bias?.toUpperCase() || 'NEUTRAL',
    percentage: `${Math.round(analysis.confidence || 0)}%`,
    color: analysis.bias === 'Bullish' ? 'green' : 'red',
  }));

  return (
    <Motion.div
      className="pb-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motion.div className="mb-7" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        <h1 className="mb-1 text-2xl font-semibold tracking-[-0.03em]" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Quick overview of your AI-powered trading activity.</p>
        {statsError && <p className="mt-2 text-sm text-red-400">{statsError}</p>}
      </Motion.div>

      <Motion.div
        className="mb-6 overflow-hidden rounded-[24px] border p-5 md:rounded-[28px] md:p-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        whileHover={{ y: -4 }}
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
              Upload a chart screenshot let the AI read the image before anything else.
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
                 <Link
                to="/chat-analyzer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                {/* <ImagePlus className="h-4 w-4" /> */}
                Risk management
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
      </Motion.div>

      <Motion.div
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.12,
            },
          },
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Motion.div
              key={stat.label}
              className="rounded-2xl border px-5 py-4 transition"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            >
              <div className="mb-4 flex items-start justify-between">
                <p className="text-xs font-semibold tracking-[0.08em]" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                <Icon className="h-4 w-4" style={{ color: stat.iconColor }} />
              </div>
              <p className="text-3xl font-semibold leading-none tracking-[-0.04em]" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            </Motion.div>
          );
        })}
      </Motion.div>

      <Motion.div
        className="mb-6 grid gap-4 lg:grid-cols-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        {[
          {
            title: 'Best tags',
            value: learningPerformance?.bestTags?.length ? learningPerformance.bestTags.join(', ') : learningStats.bestTags.length ? learningStats.bestTags.map((item) => item.label).join(', ') : 'Not enough outcomes',
          },
          {
            title: 'Weak tags',
            value: learningPerformance?.weakTags?.length ? learningPerformance.weakTags.join(', ') : learningStats.weakTags.length ? learningStats.weakTags.map((item) => item.label).join(', ') : 'Not enough outcomes',
          },
          {
            title: 'Pair performance',
            value: learningStats.pairPerformance.length
              ? learningStats.pairPerformance.map((item) => `${item.label} ${item.winRate}%`).join(', ')
              : 'Not enough outcomes',
          },
          {
            title: 'Timeframe performance',
            value: learningStats.timeframePerformance.length
              ? learningStats.timeframePerformance.map((item) => `${item.label} ${item.winRate}%`).join(', ')
              : 'Not enough outcomes',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border p-4"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>{item.title}</p>
            <p className="mt-3 text-sm font-semibold leading-6" style={{ color: 'var(--foreground)' }}>{item.value}</p>
          </div>
        ))}
      </Motion.div>

      <Motion.div
        className="overflow-hidden rounded-2xl border"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
          <Clock3 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recent activity</h2>
        </div>

        <div>
          {recentActivity.length === 0 && (
            <div className="px-5 py-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              No recent analyses yet.
            </div>
          )}

          {recentActivity.map((activity, index) => (
            <Motion.div
              key={`${activity.asset}-${index}`}
              className="flex items-center justify-between gap-4 border-b px-5 py-4 last:border-b-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: 0.24 + index * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
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
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    </Motion.div>
  );
}
