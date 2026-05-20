import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  Crosshair,
  Eye,
  Layers3,
  ShieldCheck,
  Target,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { chartUploadAnalysis } from '../data/smcMockData';

const cardStyle = {
  borderColor: 'var(--border)',
  backgroundColor: 'var(--card)',
};

const insetStyle = {
  borderColor: 'var(--border)',
  backgroundColor: 'var(--secondary)',
};

export default function ScreenshotTradeReport() {
  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="mx-auto min-h-screen w-full max-w-[1120px] px-4 py-6 sm:px-5 md:px-7 md:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
              Standalone trade report
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-[2rem]">
              Screenshot Trade Explanation
            </h1>
            <p className="mt-2 max-w-[680px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
              This page is separate from the dashboard flow. It contains the full explanation for why the screenshot trade was analyzed this way.
            </p>
          </div>

          <Link
            to="/chat-analyzer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Screenshot AI
          </Link>
        </div>

        <section className="mb-4 rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={cardStyle}>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Asset', chartUploadAnalysis.asset],
              ['Bias', chartUploadAnalysis.marketStructure.bias],
              ['Entry', chartUploadAnalysis.execution.entryPrice],
              ['R:R', chartUploadAnalysis.execution.riskRewardRatio],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border p-4" style={insetStyle}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  {label}
                </p>
                <p className="text-base font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <Layers3 className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Market Structure</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(chartUploadAnalysis.marketStructure).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm leading-6">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Zone Analysis</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(chartUploadAnalysis.zoneAnalysis).map(([key, values]) => (
                  <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <div className="space-y-2">
                      {values.map((value) => (
                        <p key={value} className="text-sm leading-6">
                          {value}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <Waves className="h-4 w-4" style={{ color: 'var(--chart-yellow)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Liquidity Analysis</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(chartUploadAnalysis.liquidityAnalysis).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    {Array.isArray(value) ? (
                      <div className="space-y-2">
                        {value.map((item) => (
                          <p key={item} className="text-sm leading-6">
                            {item}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-6">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Trade Execution</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(chartUploadAnalysis.execution).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
            <div className="mb-4 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Why the Trade Was Analyzed This Way</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(chartUploadAnalysis.explanation).map(([key, value]) => (
                <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="text-sm leading-6">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={{ color: 'var(--chart-green)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Confidence Engine</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(chartUploadAnalysis.confidenceEngine).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border p-4" style={insetStyle}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={cardStyle}>
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" style={{ color: 'var(--chart-red)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Rejected Entries</h2>
              </div>
              <div className="space-y-3">
                {chartUploadAnalysis.rejectedEntries.map((entry) => (
                  <div key={entry.label} className="rounded-2xl border p-4" style={insetStyle}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{entry.label}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        {entry.price}
                      </span>
                    </div>
                    {Object.entries(entry)
                      .filter(([key]) => key !== 'label' && key !== 'price')
                      .map(([key, value]) => (
                        <div key={key} className="mt-3 rounded-xl border px-3 py-2" style={cardStyle}>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-sm leading-6">{value}</p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
