import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CandlestickChart,
  CircleDollarSign,
  Crosshair,
  Landmark,
  Layers3,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Split,
  Target,
  TrendingUp,
  Waves,
} from 'lucide-react';
import { useState } from 'react';
import { analysesByMarket, marketOptions } from '../data/smcMockData';

const sectionStyles = {
  card: {
    borderColor: 'var(--border)',
    backgroundColor: 'var(--card)',
  },
  inset: {
    borderColor: 'var(--border)',
    backgroundColor: 'var(--secondary)',
  },
};

function ZoneList({ title, items }) {
  return (
    <div className="rounded-[24px] border p-4" style={sectionStyles.inset}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
        {title}
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${title}-${item.label}`} className="rounded-2xl border p-4" style={sectionStyles.card}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{item.label}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                {item.range}
              </span>
            </div>
            {'strength' in item && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--chart-blue)' }}>
                Strength: {item.strength}
              </p>
            )}
            <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AiAnalysis() {
  const [selectedMarket, setSelectedMarket] = useState('BTC/USDT');
  const analysis = analysesByMarket[selectedMarket];
  const isBullish = analysis.bias === 'Bullish';

  const structureCards = [
    { label: 'Trend', value: analysis.structure.trend, tone: analysis.biasTone },
    { label: 'BOS', value: analysis.structure.bos, tone: 'var(--chart-blue)' },
    { label: 'CHOCH', value: analysis.structure.choch, tone: 'var(--chart-yellow)' },
    { label: 'Bias', value: analysis.structure.bias, tone: analysis.biasTone },
  ];

  const confidenceCards = [
    { label: 'Probability score', value: analysis.confidence.probabilityScore },
    { label: 'Risk level', value: analysis.confidence.riskLevel },
    { label: 'Setup strength', value: analysis.confidence.setupStrength },
    { label: 'SMC alignment', value: analysis.confidence.smcAlignment },
    { label: 'Liquidity quality', value: analysis.confidence.liquidityQuality },
    { label: 'Structure quality', value: analysis.confidence.structureQuality },
  ];

  return (
    <div className="space-y-5 pb-8 md:space-y-6">
      <section
        className="overflow-hidden rounded-[24px] border md:rounded-[28px]"
        style={{
          borderColor: 'var(--border)',
          background:
            'radial-gradient(circle at top left, rgba(24, 210, 107, 0.18), transparent 30%), radial-gradient(circle at 82% 12%, rgba(96, 165, 250, 0.16), transparent 24%), var(--card)',
        }}
      >
        <div className="grid gap-6 p-4 sm:p-5 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
              <BrainCircuit className="h-3.5 w-3.5" />
              Institutional SMC engine
            </div>
            <div
              className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: isBullish ? 'rgba(24, 210, 107, 0.26)' : 'rgba(255, 77, 79, 0.26)',
                backgroundColor: isBullish ? 'rgba(24, 210, 107, 0.08)' : 'rgba(255, 77, 79, 0.08)',
                color: analysis.biasTone,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {analysis.bias} institutional bias
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <h1 className="max-w-[720px] text-2xl font-semibold tracking-[-0.05em] sm:text-[2rem]">
                {analysis.headline}
              </h1>
              <p className="mt-3 max-w-[620px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                {analysis.deskNote}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {marketOptions.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => setSelectedMarket(market)}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{
                      backgroundColor: selectedMarket === market ? 'var(--primary)' : 'var(--secondary)',
                      color: selectedMarket === market ? 'var(--primary-foreground)' : 'var(--foreground)',
                    }}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {structureCards.map((item) => (
                <div key={item.label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold leading-6" style={{ color: item.tone }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={sectionStyles.card}>
          <div className="mb-5 flex items-center gap-2">
            <Layers3 className="h-4 w-4" style={{ color: analysis.biasTone }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Market Structure</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border p-4" style={sectionStyles.inset}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                Trend direction
              </p>
              <p className="text-lg font-semibold" style={{ color: analysis.biasTone }}>
                {analysis.structure.trend}
              </p>
              <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                {analysis.structure.bias}
              </p>
            </div>
            <div className="rounded-[24px] border p-4" style={sectionStyles.inset}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                Probability split
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span>Continuation</span>
                  <span className="font-semibold" style={{ color: 'var(--chart-green)' }}>
                    {analysis.structure.continuationProbability}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span>Reversal</span>
                  <span className="font-semibold" style={{ color: 'var(--chart-red)' }}>
                    {analysis.structure.reversalProbability}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border p-4 md:col-span-2" style={sectionStyles.inset}>
              <div className="space-y-3">
                <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    BOS status
                  </p>
                  <p className="text-sm leading-6">{analysis.structure.bos}</p>
                </div>
                <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    CHOCH status
                  </p>
                  <p className="text-sm leading-6">{analysis.structure.choch}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: analysis.biasTone }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Confidence Engine</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {confidenceCards.map((item) => (
              <div key={item.label} className="rounded-2xl border p-4" style={sectionStyles.inset}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  {item.label}
                </p>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Zone Analysis</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ZoneList title="Support zones" items={analysis.zones.supports} />
              <ZoneList title="Resistance zones" items={analysis.zones.resistances} />
              <ZoneList title="Order blocks" items={analysis.zones.orderBlocks} />
              <ZoneList title="Mitigation blocks" items={analysis.zones.mitigationBlocks} />
              <ZoneList title="Supply zones" items={analysis.zones.supply} />
              <ZoneList title="Demand zones" items={analysis.zones.demand} />
            </div>
            <div className="mt-4 rounded-[24px] border p-4" style={sectionStyles.inset}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                Fair value gaps
              </p>
              <div className="space-y-3">
                {analysis.zones.fvgs.map((item) => (
                  <div key={item.label} className="rounded-2xl border p-4" style={sectionStyles.card}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        {item.range}
                      </span>
                    </div>
                    <p className="text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border p-4" style={sectionStyles.card}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  Premium / discount logic
                </p>
                <p className="text-sm leading-6">{analysis.zones.premiumDiscount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
            <div className="mb-4 flex items-center gap-2">
              <Split className="h-4 w-4" style={{ color: analysis.biasTone }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Breaker Block Intelligence</h2>
            </div>
            <div className="space-y-4">
              {analysis.zones.breakerBlocks.map((breaker) => (
                <div key={breaker.label} className="rounded-[24px] border p-4" style={sectionStyles.inset}>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold">{breaker.label}</p>
                      <p className="text-sm" style={{ color: analysis.biasTone }}>
                        {breaker.classification} {breaker.type}
                      </p>
                    </div>
                    <span className="inline-flex self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ borderColor: 'var(--border)', color: 'var(--chart-blue)' }}>
                      {breaker.probabilityScore}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Previous structure invalidated
                      </p>
                      <p className="text-sm leading-6">{breaker.invalidatedStructure}</p>
                    </div>
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Liquidity sweep before formation
                      </p>
                      <p className="text-sm leading-6">{breaker.preSweep}</p>
                    </div>
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Entry strength
                      </p>
                      <p className="text-sm leading-6">{breaker.entryStrength}</p>
                    </div>
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Confirmation level
                      </p>
                      <p className="text-sm leading-6">{breaker.confirmationLevel}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Aggressive entry option
                      </p>
                      <p className="text-sm leading-6">{breaker.aggressiveEntry}</p>
                    </div>
                    <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        Conservative entry option
                      </p>
                      <p className="text-sm leading-6">{breaker.conservativeEntry}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                    {breaker.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
            <div className="mb-4 flex items-center gap-2">
              <Waves className="h-4 w-4" style={{ color: 'var(--chart-yellow)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Liquidity Analysis</h2>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Equal highs', text: analysis.liquidity.equalHighs },
                { title: 'Equal lows', text: analysis.liquidity.equalLows },
                { title: 'Stop hunts', text: analysis.liquidity.stopHunts.join(' ') },
                { title: 'Liquidity sweeps', text: analysis.liquidity.sweeps.join(' ') },
                { title: 'Trap zones', text: analysis.liquidity.traps.join(' ') },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border p-4" style={sectionStyles.inset}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    {item.title}
                  </p>
                  <p className="text-sm leading-6">{item.text}</p>
                </div>
              ))}
              <div className="rounded-2xl border p-4" style={sectionStyles.inset}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                  Liquidity pools
                </p>
                <div className="space-y-2">
                  {analysis.liquidity.pools.map((item) => (
                    <p key={item} className="text-sm leading-6">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" style={{ color: analysis.biasTone }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Trade Execution</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Entry price', analysis.execution.entryPrice],
                ['Stop loss', analysis.execution.stopLoss],
                ['Take profit 1', analysis.execution.takeProfits[0]],
                ['Take profit 2', analysis.execution.takeProfits[1]],
                ['Take profit 3', analysis.execution.takeProfits[2]],
                ['Risk-to-reward', analysis.execution.riskReward],
                ['Trade type', analysis.execution.tradeType],
                ['Entry style', analysis.execution.entryStyle],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border p-4" style={sectionStyles.inset}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                    {label}
                  </p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border p-4" style={sectionStyles.inset}>
              <div className="mb-3 flex items-center gap-2">
                <Crosshair className="h-4 w-4" style={{ color: analysis.biasTone }} />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
                  {analysis.execution.selectedEntry.title}
                </h3>
              </div>
              <div className="rounded-2xl border p-4" style={sectionStyles.card}>
                <p className="text-base font-semibold">{analysis.execution.selectedEntry.label}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: analysis.biasTone }}>
                  Entry: {analysis.execution.selectedEntry.price}
                </p>
                <p className="mt-3 text-sm leading-6">{analysis.execution.selectedEntry.structureReasoning}</p>
                <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                  {analysis.execution.selectedEntry.zoneJustification}
                </p>
                <div className="mt-3 space-y-2">
                  {analysis.execution.selectedEntry.confirmations.map((item) => (
                    <div key={item} className="rounded-xl border px-3 py-2 text-sm" style={sectionStyles.inset}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border p-4" style={sectionStyles.inset}>
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" style={{ color: 'var(--chart-red)' }} />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">Rejected Entries</h3>
              </div>
              <div className="space-y-3">
                {analysis.execution.rejectedEntries.map((entry) => (
                  <div key={entry.label} className="rounded-2xl border p-4" style={sectionStyles.card}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{entry.label}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                        {entry.price}
                      </span>
                    </div>
                    <p className="text-sm leading-6">{entry.reason}</p>
                    <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                      Missing confirmations: {entry.missingConfirmations}
                    </p>
                    <p className="mt-2 text-sm leading-6" style={{ color: 'var(--chart-red)' }}>
                      Risk: {entry.risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px] md:p-6" style={sectionStyles.card}>
        <div className="mb-4 flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" style={{ color: analysis.biasTone }} />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">AI Explanation</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Why this entry was selected', analysis.explanation.entryWhy],
            ['Why other entries were rejected', analysis.explanation.rejectedWhy],
            ['Institutional reasoning', analysis.explanation.institutionalReasoning],
            ['SMC confirmations', analysis.explanation.smcConfirmations],
            ['Liquidity logic', analysis.explanation.liquidityLogic],
            ['Structure validation', analysis.explanation.structureValidation],
          ].map(([label, text]) => (
            <div key={label} className="rounded-2xl border p-4" style={sectionStyles.inset}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                {label}
              </p>
              <p className="text-sm leading-6">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-[24px] border p-4 md:flex-row md:items-center md:justify-between" style={sectionStyles.inset}>
          <div className="max-w-[720px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
              Final behavior
            </p>
            <p className="text-sm leading-6">
              This assistant is designed to behave like an institutional market analyst, SMC mentor, liquidity analyst, and trade validation engine. It explains the structure first, validates the zone second, and only then allows execution.
            </p>
          </div>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition md:w-auto" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Open full SMC report
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: analysis.biasTone }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Support priority</h2>
          </div>
          <p className="text-sm leading-6">
            Support and resistance are treated as top-level decision filters, not background context. Entries only remain valid when price behavior around the key zone confirms the intended narrative.
          </p>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
          <div className="mb-4 flex items-center gap-2">
            <CandlestickChart className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">No blind entries</h2>
          </div>
          <p className="text-sm leading-6">
            The model rejects trades that are early, extended, or unsupported by liquidity and structure. It must explain why Point A is accepted and Point B is rejected.
          </p>
        </div>

        <div className="rounded-[24px] border p-4 sm:p-5 md:rounded-[28px]" style={sectionStyles.card}>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: 'var(--chart-yellow)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Early-entry risk</h2>
          </div>
          <p className="text-sm leading-6">
            If confirmation has not happened yet, the assistant highlights the risk of entering before CHOCH, before the liquidity sweep, or before the zone actually proves itself.
          </p>
        </div>
      </section>
    </div>
  );
}
