import { ArrowRight, ImagePlus, ScanSearch, Target, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chartUploadAnalysis } from '../data/smcMockData';

const chartViews = ['15M', '1H', '4H'];

export default function ChatAnalyzer() {
  const [activeView, setActiveView] = useState('4H');

  return (
    <div className="space-y-5 pb-8 md:space-y-6">
      <section
        className="overflow-hidden rounded-[24px] border md:rounded-[28px]"
        style={{
          borderColor: 'var(--border)',
          background:
            'linear-gradient(145deg, rgba(96, 165, 250, 0.14), transparent 38%), radial-gradient(circle at right top, rgba(24, 210, 107, 0.18), transparent 26%), var(--card)',
        }}
      >
        <div className="grid gap-5 p-4 sm:p-5 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--chart-blue)' }}>
              <ScanSearch className="h-3.5 w-3.5" />
              Screenshot AI
            </div>

            <div className="flex w-full rounded-full border p-1 sm:w-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              {chartViews.map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className="flex-1 rounded-full px-3 py-2 text-sm font-semibold transition sm:flex-none"
                  style={{
                    backgroundColor: activeView === view ? 'var(--primary)' : 'transparent',
                    color: activeView === view ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ borderColor: 'rgba(24, 210, 107, 0.24)', backgroundColor: 'rgba(24, 210, 107, 0.08)', color: 'var(--chart-green)' }}>
                <ImagePlus className="h-3.5 w-3.5" />
                Fast execution view
              </div>
              <h1 className="max-w-[620px] text-2xl font-semibold tracking-[-0.05em] sm:text-[2rem]">
                Upload the screenshot, get the entry, stop loss, and take profits fast.
              </h1>
              <p className="mt-3 max-w-[560px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                This page stays simple on purpose. The quick output shows the trade plan first. Full institutional reasoning lives on a separate explanation page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Asset', chartUploadAnalysis.asset],
                ['Bias', chartUploadAnalysis.marketStructure.bias],
                ['Trade type', chartUploadAnalysis.execution.tradeType],
                ['Style', chartUploadAnalysis.execution.entryStyle],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
                    {label}
                  </p>
                  <p className="text-base font-semibold" style={{ color: label === 'Bias' ? 'var(--chart-green)' : 'var(--foreground)' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                Upload workspace
              </p>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Chart screenshot input</h2>
            </div>
            <ImagePlus className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div
              className="rounded-[22px] border border-dashed p-4 sm:p-5 md:rounded-[24px]"
              style={{
                borderColor: 'rgba(96, 165, 250, 0.32)',
                background:
                  'linear-gradient(180deg, rgba(96, 165, 250, 0.08), rgba(24, 210, 107, 0.06))',
              }}
            >
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center sm:min-h-[320px]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <Upload className="h-7 w-7" style={{ color: 'var(--chart-blue)' }} />
                </div>
                <h3 className="text-lg font-semibold">Drop screenshot here</h3>
                <p className="mt-3 max-w-[280px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                  Upload a chart image and get the clean trade plan first. Deep reasoning is available separately.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button className="rounded-full px-4 py-2 text-sm font-semibold transition" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    Choose image
                  </button>
                  <button className="rounded-full border px-4 py-2 text-sm font-semibold transition" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                    Paste screenshot
                  </button>
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[22px] border p-4 sm:p-5 md:rounded-[24px]"
              style={{
                borderColor: 'var(--border)',
                background:
                  'linear-gradient(180deg, rgba(11, 15, 23, 0.14), rgba(11, 15, 23, 0.52)), repeating-linear-gradient(to right, transparent 0, transparent 47px, rgba(255,255,255,0.04) 48px), repeating-linear-gradient(to bottom, transparent 0, transparent 47px, rgba(255,255,255,0.04) 48px), linear-gradient(180deg, rgba(96, 165, 250, 0.08), rgba(24, 210, 107, 0.06))',
              }}
            >
              <div className="mb-5 flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:justify-between sm:text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Detected screenshot preview</span>
                <span>{activeView} visible chart</span>
              </div>

              <div className="relative h-[240px] sm:h-[320px]">
                <div className="absolute left-[6%] top-[70%] h-10 w-10 rounded-full border" style={{ borderColor: 'rgba(255, 77, 79, 0.35)', backgroundColor: 'rgba(255, 77, 79, 0.12)' }} />
                <div className="absolute left-[21%] top-[60%] h-11 w-11 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />
                <div className="absolute left-[42%] top-[45%] h-12 w-12 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />
                <div className="absolute left-[66%] top-[28%] h-12 w-12 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />

                <div className="absolute left-[9%] right-[8%] top-[32%] border-t border-dashed" style={{ borderColor: 'rgba(255,255,255,0.38)' }} />
                <div className="absolute bottom-[22%] left-[8%] right-[10%] border-t" style={{ borderColor: 'rgba(24, 210, 107, 0.4)' }} />

                <div className="absolute inset-x-[8%] bottom-[18%] top-[20%]">
                  <svg viewBox="0 0 100 60" className="h-full w-full">
                    <path
                      d="M2 54 C10 56, 15 52, 20 50 S30 48, 36 44 S44 36, 51 30 S61 27, 69 23 S84 17, 98 10"
                      fill="none"
                      stroke="var(--chart-green)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="absolute right-[8%] top-[15%] max-w-[48%] rounded-2xl border px-3 py-2 text-[11px] font-semibold sm:max-w-none sm:text-xs" style={{ borderColor: 'rgba(24, 210, 107, 0.3)', backgroundColor: 'rgba(24, 210, 107, 0.12)', color: 'var(--chart-green)' }}>
                  Entry zone confirmed
                </div>

                <div className="absolute left-[8%] bottom-[8%] max-w-[58%] rounded-2xl border px-3 py-2 text-[11px] font-semibold sm:max-w-none sm:text-xs" style={{ borderColor: 'rgba(96, 165, 250, 0.3)', backgroundColor: 'rgba(96, 165, 250, 0.12)', color: 'var(--chart-blue)' }}>
                  Risk mapped
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Trade Setup</h2>
          </div>

          <div className="space-y-3">
            {[
              ['Entry', chartUploadAnalysis.execution.entryPrice],
              ['Stop loss', chartUploadAnalysis.execution.stopLoss],
              ['Take profit 1', chartUploadAnalysis.execution.takeProfit1],
              ['Take profit 2', chartUploadAnalysis.execution.takeProfit2],
              ['Take profit 3', chartUploadAnalysis.execution.takeProfit3],
              ['Risk-to-reward', chartUploadAnalysis.execution.riskRewardRatio],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  {label}
                </p>
                <p className="text-base font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <Link
            to="/trade-report/screenshot"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
          >
            See more explanation about the trade
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
