import {
  Activity,
  ArrowRight,
  CandlestickChart,
  Eye,
  ImagePlus,
  Layers3,
  MessageSquareText,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

const chartViews = ['1H', '4H', '1D'];

const extractionSignals = [
  { label: 'Detected asset', value: 'BTC/USDT', tone: 'var(--chart-blue)' },
  { label: 'Detected pattern', value: 'Ascending triangle', tone: 'var(--chart-green)' },
  { label: 'AI bias', value: 'Bullish', tone: 'var(--chart-green)' },
  { label: 'Confidence', value: '82%', tone: 'var(--chart-yellow)' },
];

const uploadSteps = [
  'Upload a screenshot from TradingView or any charting app.',
  'The AI reads visible structure, levels, labels, and candles from the image.',
  'It returns a directional bias, trigger point, invalidation, and explanation.',
];

const aiFindings = [
  'The screenshot shows repeated higher lows pressing into horizontal resistance.',
  'The visible volume behavior suggests acceptance near support rather than panic selling.',
  'The AI sees compression, not completed reversal, so the preferred path remains upside continuation on confirmation.',
];

const imageChecks = [
  { title: 'Structure', text: 'The screenshot still preserves a sequence of defended higher lows.' },
  { title: 'Trigger', text: 'A close above the visible resistance shelf is needed before the AI upgrades from watchlist to active long.' },
  { title: 'Invalidation', text: 'If price loses the most recent defended low on the screenshot, the bullish read is no longer clean.' },
];

const questionPrompts = [
  'Explain this screenshot like I am a beginner.',
  'Give me entry, stop loss, and invalidation from this chart image.',
  'Is this screenshot bullish or bearish and why?',
];

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
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--chart-blue)' }}>
              <ScanSearch className="h-3.5 w-3.5" />
              Screenshot analyzer
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
                Core product flow
              </div>
              <h1 className="max-w-[560px] text-2xl font-semibold tracking-[-0.05em] sm:text-[2rem]">
                Upload a chart screenshot and let the AI read the image for you.
              </h1>
              <p className="mt-3 max-w-[520px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                This is one of the app&apos;s main functions. The page should feel upload-first: the user drops a screenshot, the AI reads what is visible on the chart, and then returns a trade explanation with bias, trigger, and invalidation.
              </p>

              <div className="mt-5 space-y-3">
                {uploadSteps.map((step) => (
                  <div key={step} className="flex items-start gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                    <p className="text-sm leading-6">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {extractionSignals.map((item) => (
                <div key={item.label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
                    {item.label}
                  </p>
                  <p className="text-base font-semibold" style={{ color: item.tone }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
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
                  Upload a screenshot from TradingView, MetaTrader, Binance, or any chart platform.
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
              <div className="mb-5 flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Detected screenshot preview</span>
                <span>{activeView} visible chart</span>
              </div>

              <div className="relative h-[240px] sm:h-[320px]">
                <div className="absolute left-[7%] top-[68%] h-10 w-10 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />
                <div className="absolute left-[24%] top-[53%] h-11 w-11 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />
                <div className="absolute left-[44%] top-[40%] h-12 w-12 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />
                <div className="absolute left-[67%] top-[30%] h-12 w-12 rounded-full border" style={{ borderColor: 'rgba(24, 210, 107, 0.45)', backgroundColor: 'rgba(24, 210, 107, 0.14)' }} />

                <div className="absolute left-[9%] right-[8%] top-[28%] border-t border-dashed" style={{ borderColor: 'rgba(255,255,255,0.38)' }} />
                <div className="absolute bottom-[20%] left-[8%] right-[12%] border-t" style={{ borderColor: 'rgba(24, 210, 107, 0.4)' }} />

                <div className="absolute inset-x-[8%] bottom-[17%] top-[20%]">
                  <svg viewBox="0 0 100 60" className="h-full w-full">
                    <path
                      d="M2 52 C12 48, 18 44, 26 42 S39 35, 47 31 S60 25, 69 21 S83 18, 98 10"
                      fill="none"
                      stroke="var(--chart-green)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="absolute right-[8%] top-[17%] max-w-[48%] rounded-2xl border px-3 py-2 text-[11px] font-semibold sm:max-w-none sm:text-xs" style={{ borderColor: 'rgba(24, 210, 107, 0.3)', backgroundColor: 'rgba(24, 210, 107, 0.12)', color: 'var(--chart-green)' }}>
                  AI trigger zone
                </div>

                <div className="absolute left-[8%] bottom-[8%] max-w-[58%] rounded-2xl border px-3 py-2 text-[11px] font-semibold sm:max-w-none sm:text-xs" style={{ borderColor: 'rgba(96, 165, 250, 0.3)', backgroundColor: 'rgba(96, 165, 250, 0.12)', color: 'var(--chart-blue)' }}>
                  OCR: BTCUSDT 4H
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">What AI extracts</h2>
            </div>
            <div className="space-y-3">
              {aiFindings.map((item) => (
                <div key={item} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Suggested questions</h2>
            </div>
            <div className="space-y-3">
              {questionPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="w-full rounded-2xl border p-4 text-left text-sm leading-6 transition"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" style={{ color: 'var(--chart-red)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Image-based checks</h2>
          </div>
          <div className="space-y-3">
            {imageChecks.map((item) => (
              <div key={item.title} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="mb-1 text-sm font-semibold">{item.title}</p>
                <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">AI image analysis</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border px-4 py-3 text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(96, 165, 250, 0.08)', color: 'var(--foreground)' }}>
              User uploaded: BTC screenshot from TradingView and asked for bullish or bearish analysis.
            </div>

            <div className="rounded-[24px] border p-5" style={{ borderColor: 'rgba(24, 210, 107, 0.28)', backgroundColor: 'rgba(24, 210, 107, 0.07)' }}>
              <p className="text-sm leading-7" style={{ color: 'var(--foreground)' }}>
                From the screenshot alone, the AI reads this as bullish-watchlist structure. Price is pressing into visible resistance with repeated higher lows underneath, which usually means compression before a decision move. The better long trigger is a confirmed close above the resistance shelf shown in the image. If that break fails and price drops below the last defended swing low visible on the screenshot, the bullish thesis is invalid.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  Bias
                </p>
                <p className="text-sm leading-6">Bullish if the screenshot resistance breaks with acceptance.</p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  Trigger
                </p>
                <p className="text-sm leading-6">Wait for a strong close above the marked resistance level from the image.</p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  Failure
                </p>
                <p className="text-sm leading-6">If the last visible higher low breaks, the screenshot turns bearish instead.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Structure read</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]">Compression</p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            The AI mainly reads the shape and pressure in the screenshot before giving the bias.
          </p>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-4 w-4" style={{ color: 'var(--chart-yellow)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Image context</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]">OCR + levels</p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            The workflow assumes the AI extracts visible labels, timeframe, trend lines, and key levels from the screenshot.
          </p>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">User action</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]">Upload first</p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            The page now makes it clear that the flow starts with a chart image, not with typing a long prompt first.
          </p>
        </div>
      </section>

      <section className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[500px]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
              Workflow note
            </p>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Make the screenshot the input, then let the AI explain what it sees on the chart.</h2>
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition md:w-auto" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Analyze uploaded screenshot
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 rounded-[24px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
            <p className="text-sm font-semibold">Expected output</p>
          </div>
          <p className="text-sm leading-7" style={{ color: 'var(--muted-foreground)' }}>
            After upload, the AI should tell the user what asset it detected, what structure it sees, whether the screenshot looks bullish or bearish, and what exact visible level changes the bias.
          </p>
        </div>
      </section>
    </div>
  );
}
