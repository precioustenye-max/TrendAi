import {
  BadgeDollarSign,
  BarChart3,
  CircleAlert,
  Gauge,
  Layers3,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const missing = 'Not detected';

function display(value) {
  if (value === null || value === undefined || value === '') {
    return missing;
  }

  return value;
}

function biasTone(bias) {
  if (bias === 'Bullish') {
    return {
      color: 'var(--chart-green)',
      backgroundColor: 'rgba(34,197,94,0.12)',
      icon: TrendingUp,
    };
  }

  if (bias === 'Bearish') {
    return {
      color: 'var(--chart-red)',
      backgroundColor: 'rgba(239,68,68,0.12)',
      icon: TrendingDown,
    };
  }

  return {
    color: 'var(--chart-yellow)',
    backgroundColor: 'rgba(234,179,8,0.12)',
    icon: CircleAlert,
  };
}

function decisionTone(decision) {
  if (decision === 'Buy') {
    return { color: 'var(--chart-green)', backgroundColor: 'rgba(34,197,94,0.12)' };
  }

  if (decision === 'Sell') {
    return { color: 'var(--chart-red)', backgroundColor: 'rgba(239,68,68,0.12)' };
  }

  return { color: 'var(--chart-yellow)', backgroundColor: 'rgba(234,179,8,0.12)' };
}

function InfoCard({ icon: Icon, label, value, tone = 'default' }) {
  const borderColor = tone === 'primary' ? 'color-mix(in srgb, var(--primary) 36%, var(--border))' : 'var(--border)';

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor,
        backgroundColor: tone === 'primary' ? 'color-mix(in srgb, var(--primary) 9%, var(--secondary))' : 'var(--secondary)',
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: 'var(--primary)' }} />
        <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </p>
      </div>
      <p className="mt-3 break-words font-mono text-base font-bold" style={{ color: 'var(--foreground)' }}>
        {display(value)}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
      <h3 className="text-sm font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AnalysisDetail({ analysis, compact = false }) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border p-6 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        No analysis selected.
      </div>
    );
  }

  const tone = biasTone(analysis.bias);
  const BiasIcon = tone.icon;
  const takeProfits = Array.isArray(analysis.takeProfits) ? analysis.takeProfits : [];
  const tags = Array.isArray(analysis.strategyTags) ? analysis.strategyTags : [];
  const smcNotes = analysis.smcNotes || {};
  const finalDecision = analysis.finalDecision || analysis.decision || 'No Trade';
  const finalTone = decisionTone(finalDecision);
  const ensemble = analysis.ensembleResult || {};
  const learningAdjustments = analysis.learningAdjustments || ensemble.learningAdjustments || [];
  const riskWarnings = analysis.riskWarnings || ensemble.warnings || [];
  const riskNotes = ensemble.riskNotes || [];
  const smcItems = [
    ['Trend', smcNotes.trend],
    ['Support', smcNotes.support],
    ['Resistance', smcNotes.resistance],
    ['Order Block', smcNotes.orderBlock],
    ['Breaker Block', smcNotes.breakerBlock],
    ['Fair Value Gap', smcNotes.fairValueGap],
    ['Liquidity', smcNotes.liquidity],
    ['BOS/CHOCH', smcNotes.bosOrChoch],
    ['Invalidation', smcNotes.invalidation],
  ];

  return (
    <div className={compact ? 'space-y-4' : 'space-y-5'}>
      <section
        className="rounded-2xl border p-4 sm:p-5"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
              AI Chart Analysis
            </p>
            <h2 className="mt-2 font-mono text-2xl font-bold tracking-[-0.03em]" style={{ color: 'var(--foreground)' }}>
              {display(analysis.asset)}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Timeframe: {display(analysis.timeframe)}
            </p>
          </div>

          <div
            className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: tone.backgroundColor, color: tone.color }}
          >
            <BiasIcon className="h-4 w-4" />
            {display(analysis.bias)}
          </div>
        </div>

        <div
          className="mt-5 rounded-2xl border p-4"
          style={{ borderColor: finalTone.color, backgroundColor: finalTone.backgroundColor }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: finalTone.color }}>
                Final Decision
              </p>
              <p className="mt-1 text-2xl font-black" style={{ color: finalTone.color }}>
                {finalDecision}
              </p>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Final confidence: {analysis.finalConfidence ?? analysis.confidenceAdjusted ?? Math.round(Number(analysis.confidence || 0))}%
            </p>
          </div>
          {analysis.noTradeReason && (
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--foreground)' }}>
              {analysis.noTradeReason}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={BarChart3} label="Confidence" value={`${Math.round(Number(analysis.confidence || 0))}%`} tone="primary" />
          <InfoCard icon={BarChart3} label="Adjusted" value={analysis.confidenceAdjusted == null ? null : `${analysis.confidenceAdjusted}%`} tone="primary" />
          <InfoCard icon={Target} label="Entry" value={analysis.entry} />
          <InfoCard icon={Shield} label="Stop Loss" value={analysis.stopLoss} />
          <InfoCard icon={Gauge} label="Risk/Reward" value={analysis.riskReward} />
          <InfoCard icon={Gauge} label="RR Quality" value={analysis.rrQuality} />
          <InfoCard icon={Layers3} label="Quality Score" value={analysis.qualityScore == null ? null : `${analysis.qualityScore}/95`} />
          <InfoCard icon={Shield} label="Risk Score" value={analysis.riskScore == null ? null : `${analysis.riskScore}/95`} />
          <InfoCard icon={Gauge} label="Expectancy" value={analysis.expectancyScore ?? analysis.expectedValue} />
        </div>
      </section>

      <Section title="Risk / Expectancy">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={Gauge} label="Expected Value" value={analysis.expectedValue} />
          <InfoCard icon={BarChart3} label="Required Win Rate" value={analysis.requiredWinRate == null ? null : `${analysis.requiredWinRate}%`} />
          <InfoCard icon={BarChart3} label="Historical Win Rate" value={analysis.historicalWinRate == null ? null : `${analysis.historicalWinRate}%`} />
          <InfoCard icon={Shield} label="No-trade Reason" value={analysis.noTradeReason} />
        </div>
      </Section>

      <Section title="Learning Adjustments">
        {learningAdjustments.length || riskWarnings.length || riskNotes.length ? (
          <div className="space-y-3">
            {[...learningAdjustments, ...riskWarnings, ...riskNotes].map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border p-3 text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No learning adjustments yet.</p>
        )}
      </Section>

      <Section title="Take Profits">
        {takeProfits.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {takeProfits.map((target, index) => (
              <InfoCard key={`${target}-${index}`} icon={BadgeDollarSign} label={`TP ${index + 1}`} value={target} />
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{missing}</p>
        )}
      </Section>

      <Section title="SMC / ICT Notes">
        <div className="grid gap-3 md:grid-cols-2">
          {smcItems.map(([label, value]) => (
            <div key={label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
              <div className="flex items-center gap-2">
                <Layers3 className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>
                  {label}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--foreground)' }}>
                {display(value)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Explanation">
        <p className="text-sm leading-6" style={{ color: 'var(--foreground)' }}>
          {display(analysis.explanation)}
        </p>
      </Section>

      <Section title="Strategy Tags">
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary) 12%, var(--secondary))',
                  color: 'var(--primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{missing}</p>
        )}
      </Section>

      <div className="rounded-2xl border p-4 text-sm leading-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
        {analysis.disclaimer || 'This is AI-generated analysis and not financial advice.'}
      </div>
    </div>
  );
}
