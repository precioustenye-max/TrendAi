import {
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AnalysisDetail from '../components/analysis/AnalysisDetail';
import TradeAlertPanel from '../components/analysis/TradeAlertPanel';
import TradeOutcomeForm from '../components/analysis/TradeOutcomeForm';
import { deleteAnalysis, getAnalysisById, getHistory } from '../lib/api';

const filters = [
  { key: 'all', label: 'All Signals', icon: Filter },
  { key: 'bullish', label: 'Bullish', icon: TrendingUp },
  { key: 'bearish', label: 'Bearish', icon: TrendingDown },
  { key: 'neutral', label: 'Neutral', icon: BarChart3 },
];

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue) && Math.abs(numericValue) >= 1000) {
    return numericValue.toLocaleString();
  }

  return value;
};

const formatDateParts = (value) => {
  const date = value ? new Date(value) : new Date();

  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
};

export default function History() {
  const [filterType, setFilterType] = useState('all');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [message, setMessage] = useState('');

  const loadHistory = () => {
    let ignore = false;

    setLoading(true);
    setError('');
    setMessage('');

    getHistory({
      page: 1,
      limit: 50,
      bias: filterType === 'all' ? undefined : filterType,
    })
      .then((result) => {
        if (!ignore) {
          setHistoryData(Array.isArray(result?.analyses) ? result.analyses : []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Unable to load history');
          setHistoryData([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  };

  useEffect(() => {
    return loadHistory();
  }, [filterType]);

  const summary = useMemo(() => {
    const bullishCount = historyData.filter((item) => item.bias === 'Bullish').length;
    const bearishCount = historyData.filter((item) => item.bias === 'Bearish').length;
    const completedResults = historyData.filter((item) => item.tradeResult?.result);
    const wins = completedResults.filter((item) => item.tradeResult.result === 'win').length;
    const winRate = completedResults.length ? Math.round((wins / completedResults.length) * 100) : null;
    const totalProfitLoss = historyData.reduce(
      (sum, item) => sum + Number(item.tradeResult?.profitLoss || 0),
      0
    );

    const tagStats = new Map();

    historyData.forEach((item) => {
      const result = item.tradeResult?.result;

      if (!result || !Array.isArray(item.strategyTags)) {
        return;
      }

      item.strategyTags.forEach((tag) => {
        const current = tagStats.get(tag) || { wins: 0, total: 0 };
        current.total += 1;
        current.wins += result === 'win' ? 1 : 0;
        tagStats.set(tag, current);
      });
    });

    const rankedTags = [...tagStats.entries()]
      .filter(([, value]) => value.total > 0)
      .map(([tag, value]) => ({ tag, winRate: value.wins / value.total, total: value.total }));

    const bestTags = rankedTags
      .filter((item) => item.winRate >= 0.5)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3)
      .map((item) => item.tag);
    const weakTags = rankedTags
      .filter((item) => item.winRate < 0.5)
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 3)
      .map((item) => item.tag);

    return { bullishCount, bearishCount, winRate, totalProfitLoss, bestTags, weakTags };
  }, [historyData]);

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
  };

  const mutedText = { color: 'var(--muted-foreground)' };

  const openDetail = async (analysis) => {
    setSelectedAnalysis(analysis);
    setDetailLoading(true);
    setDetailError('');
    setMessage('');

    try {
      const detail = await getAnalysisById(analysis.id);
      setSelectedAnalysis(detail);
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Unable to load analysis detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedAnalysis(null);
    setDetailError('');
    setMessage('');
  };

  const handleDelete = async (analysis) => {
    const confirmed = window.confirm(`Delete analysis for ${analysis.asset || 'Unknown'}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteAnalysis(analysis.id);
      setHistoryData((current) => current.filter((item) => item.id !== analysis.id));
      if (selectedAnalysis?.id === analysis.id) {
        setSelectedAnalysis(null);
      }
      setMessage('Analysis deleted.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to delete analysis');
    }
  };

  const handleOutcomeSaved = (tradeResult) => {
    setSelectedAnalysis((current) => (current ? { ...current, tradeResult } : current));
    setHistoryData((current) =>
      current.map((item) =>
        item.id === selectedAnalysis?.id ? { ...item, tradeResult } : item,
      ),
    );
    setMessage('Outcome saved. TrendAi will use this feedback to adjust future analysis.');
  };

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
                Review previous AI trade analyses, filter by signal direction, and monitor historical performance from one place.
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
          { label: 'Bullish Signals', value: summary.bullishCount, icon: TrendingUp, tone: 'var(--chart-green)' },
          { label: 'Bearish Signals', value: summary.bearishCount, icon: TrendingDown, tone: 'var(--chart-red)' },
          {
            label: 'Net P/L',
            value: `${summary.totalProfitLoss >= 0 ? '+' : ''}${formatValue(summary.totalProfitLoss)}`,
            icon: summary.totalProfitLoss >= 0 ? ArrowUpRight : ArrowDownRight,
            tone: summary.totalProfitLoss >= 0 ? 'var(--chart-green)' : 'var(--chart-red)',
            meta: summary.winRate === null ? 'No marked outcomes yet' : `${summary.winRate}% win rate`,
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

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border p-5" style={cardStyle}>
          <p className="text-sm font-medium" style={mutedText}>Overall Win Rate</p>
          <p className="mt-3 text-2xl font-bold">{summary.winRate === null ? 'Not enough data' : `${summary.winRate}%`}</p>
        </div>
        <div className="rounded-3xl border p-5" style={cardStyle}>
          <p className="text-sm font-medium" style={mutedText}>Best Strategy Tags</p>
          <p className="mt-3 text-sm font-semibold">{summary.bestTags.length ? summary.bestTags.join(', ') : 'Not enough outcomes yet'}</p>
        </div>
        <div className="rounded-3xl border p-5" style={cardStyle}>
          <p className="text-sm font-medium" style={mutedText}>Weak Strategy Tags</p>
          <p className="mt-3 text-sm font-semibold">{summary.weakTags.length ? summary.weakTags.join(', ') : 'Not enough outcomes yet'}</p>
        </div>
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
          <p className="mt-1 text-sm" style={mutedText}>
            {loading ? 'Loading records...' : `${historyData.length} records shown`}
          </p>
          {message && <p className="mt-2 text-sm" style={{ color: message.includes('Unable') ? 'var(--chart-red)' : 'var(--chart-green)' }}>{message}</p>}
        </div>

        {error && <div className="px-5 py-6 text-sm text-red-400">{error}</div>}
        {!loading && !error && historyData.length === 0 && (
          <div className="px-5 py-10 text-sm" style={mutedText}>
            No analyses yet. Upload a chart screenshot to start building history.
          </div>
        )}

        {!error && historyData.length > 0 && (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px]">
                <thead className="border-b" style={{ borderBottomColor: 'var(--border)' }}>
                  <tr>
                    {['Asset', 'Signal', 'Confidence', 'Entry', 'Stop Loss', 'TP', 'Date', 'Actions'].map((heading) => (
                      <th
                        key={heading}
                        className={`px-6 py-4 text-sm font-semibold ${['Entry', 'Stop Loss', 'TP'].includes(heading) ? 'text-right' : 'text-left'}`}
                        style={mutedText}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item) => {
                    const dateParts = formatDateParts(item.createdAt);
                    const isBullish = item.bias === 'Bullish';

                    return (
                      <tr key={item.id} className="border-b last:border-b-0" style={{ borderBottomColor: 'var(--border)' }}>
                        <td className="px-6 py-5 font-mono font-semibold">{item.asset || 'Unknown'}</td>
                        <td className="px-6 py-5">
                          <div
                            className="flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-[0.08em]"
                            style={{
                              backgroundColor: isBullish ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                              color: isBullish ? 'var(--chart-green)' : 'var(--chart-red)',
                            }}
                          >
                            {isBullish ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {item.bias?.toUpperCase() || 'NEUTRAL'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-20 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--secondary)' }}>
                              <div className="h-full rounded-full" style={{ backgroundColor: 'var(--chart-green)', width: `${item.confidence || 0}%` }} />
                            </div>
                            <span className="font-semibold">{Math.round(item.confidence || 0)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-mono">{formatValue(item.entry)}</td>
                        <td className="px-6 py-5 text-right font-mono">{formatValue(item.stopLoss)}</td>
                        <td className="px-6 py-5 text-right font-mono">{formatValue(item.takeProfits?.[0])}</td>
                        <td className="px-6 py-5" style={mutedText}>
                          <div>{dateParts.date}</div>
                          <div className="text-xs">{dateParts.time}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openDetail(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                              style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
                              aria-label="View analysis"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--chart-red)' }}
                              aria-label="Delete analysis"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {historyData.map((item) => {
                const dateParts = formatDateParts(item.createdAt);
                const isBullish = item.bias === 'Bullish';

                return (
                  <article key={item.id} className="rounded-2xl border p-4" style={{ ...cardStyle, backgroundColor: 'var(--background)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-base font-semibold">{item.asset || 'Unknown'}</p>
                        <p className="mt-1 text-sm" style={mutedText}>{dateParts.date} at {dateParts.time}</p>
                      </div>
                      <div
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: isBullish ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: isBullish ? 'var(--chart-green)' : 'var(--chart-red)',
                        }}
                      >
                        {isBullish ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {item.bias || 'Neutral'}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p style={mutedText}>Confidence</p>
                        <p className="mt-1 font-semibold">{Math.round(item.confidence || 0)}%</p>
                      </div>
                      <div>
                        <p style={mutedText}>RR</p>
                        <p className="mt-1 font-semibold">{item.riskReward || '-'}</p>
                      </div>
                      <div>
                        <p style={mutedText}>Entry</p>
                        <p className="mt-1 font-mono">{formatValue(item.entry)}</p>
                      </div>
                      <div>
                        <p style={mutedText}>Stop Loss</p>
                        <p className="mt-1 font-mono">{formatValue(item.stopLoss)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(item)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center justify-center rounded-2xl px-3 py-2.5"
                        style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--chart-red)' }}
                        aria-label="Delete analysis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[28px] border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <div>
                  <h2 className="text-lg font-bold">Analysis Detail</h2>
                  <p className="mt-1 text-sm" style={mutedText}>{selectedAnalysis.asset || 'Unknown'} / {selectedAnalysis.timeframe || 'Not detected'}</p>
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
                  aria-label="Close detail"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-4 sm:p-5">
                {detailLoading && (
                  <div className="rounded-2xl border p-5 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    Loading analysis detail...
                  </div>
                )}
                {detailError && (
                  <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: 'rgba(239,68,68,0.45)', color: 'var(--chart-red)' }}>
                    {detailError}
                  </div>
                )}
                <AnalysisDetail analysis={selectedAnalysis} compact />
                <TradeAlertPanel analysis={selectedAnalysis} />
                <TradeOutcomeForm
                  analysisId={selectedAnalysis.id}
                  tradeResult={selectedAnalysis.tradeResult}
                  onSaved={handleOutcomeSaved}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedAnalysis)}
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--chart-red)' }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
