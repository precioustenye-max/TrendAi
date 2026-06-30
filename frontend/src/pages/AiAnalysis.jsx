import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CandlestickChart,
  Clock3,
  Eye,
  FileText,
  Landmark,
  Layers3,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAnalysisMarkets, runChartAnalysis } from '../lib/api';

const marketOptions = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'EUR/USD', 'NASDAQ'];

const iconByName = {
  CandlestickChart,
  Landmark,
  Layers3,
  LineChart,
};

const analysisByMarket = {
  'BTC/USDT': {
    bias: 'Bullish',
    confidence: '84%',
    timeframe: '4H swing',
    currentPrice: '64,180',
    triggerPrice: '64,600',
    invalidationPrice: '63,420',
    targetPrice: '66,100',
    biasTone: 'var(--chart-green)',
    intro:
      'The AI is bullish here. The page should explain the bullish case clearly, then show the exact price level that confirms continuation.',
    headline:
      'If price accepts above 64,600, the bullish continuation setup becomes active.',
    confirmationText:
      'A strong close above 64,600 shows acceptance above resistance. That is the point where the model stops treating the move as potential and starts treating it as active continuation.',
    invalidationText:
      'If price loses 63,420, the bullish structure is damaged. At that point the model should stop adding bullish arguments and switch to a bearish reassessment.',
    summary:
      'Right now the AI is not neutral. It is bullish, but only conditionally. The explanation should stay aligned with that bias: more facts for the bullish case, one clean trigger level, and one clear failure level.',
    bullishFacts: [
      'SMC remains constructive because higher lows are still being defended and price has not broken the key demand shelf.',
      'CRT still favors upward delivery because the range looks like compression before expansion, not completed distribution.',
      'Fundamental tone is supportive enough that technical strength is not being actively contradicted.',
      'Indicators still confirm continuation because momentum is positive and participation has not collapsed.',
    ],
    thesisSections: [
      {
        title: 'SMC confirmation',
        icon: Layers3,
        accent: 'var(--chart-blue)',
        bullets: [
          'Buy-side liquidity is resting above the equal highs.',
          'The last protected higher low is still intact.',
          'Displacement upward has not been fully retraced, which supports continuation logic.',
        ],
      },
      {
        title: 'CRT confirmation',
        icon: CandlestickChart,
        accent: 'var(--chart-green)',
        bullets: [
          'The range is compressing instead of expanding downward.',
          'A push through resistance followed by acceptance would complete the cleaner bullish delivery path.',
          'A wick alone is not enough. The close is what matters.',
        ],
      },
      {
        title: 'Fundamental filter',
        icon: Landmark,
        accent: 'var(--chart-yellow)',
        bullets: [
          'There is no obvious macro contradiction in this mock setup.',
          'Narrative flow still allows continuation if technical confirmation appears.',
          'Any sudden risk-off catalyst would weaken the current bullish read immediately.',
        ],
      },
      {
        title: 'Indicator filter',
        icon: LineChart,
        accent: 'var(--chart-purple)',
        bullets: [
          'Momentum remains constructive rather than exhausted.',
          'Trend alignment still supports directional continuation.',
          'Volume expansion is still required on breakout for the move to remain high quality.',
        ],
      },
    ],
  },
  'ETH/USDT': {
    bias: 'Bullish',
    confidence: '79%',
    timeframe: '4H swing',
    currentPrice: '3,140',
    triggerPrice: '3,185',
    invalidationPrice: '3,060',
    targetPrice: '3,280',
    biasTone: 'var(--chart-green)',
    intro:
      'The AI is leaning bullish on ETH as well, but it still needs a clean acceptance through resistance to validate the trade.',
    headline:
      'If price closes above 3,185, continuation becomes the preferred path.',
    confirmationText:
      'Acceptance above 3,185 confirms that the range is resolving higher instead of failing at supply.',
    invalidationText:
      'Below 3,060, the defended structure is no longer clean and the bullish case should be downgraded.',
    summary:
      'The explanation should stay bullish until invalidation happens. It should not keep mixing bullish and bearish arguments at the same weight.',
    bullishFacts: [
      'Structure still prints defended higher lows.',
      'Liquidity remains above local highs and can pull price upward.',
      'The range still looks like preparation, not breakdown.',
      'Indicators support the idea, but only as confirmation.',
    ],
    thesisSections: [
      {
        title: 'SMC confirmation',
        icon: Layers3,
        accent: 'var(--chart-blue)',
        bullets: [
          'Demand is still being respected under current price.',
          'The latest pullback did not break internal bullish structure.',
          'The next liquidity pool remains above the highs.',
        ],
      },
      {
        title: 'CRT confirmation',
        icon: CandlestickChart,
        accent: 'var(--chart-green)',
        bullets: [
          'Compression remains valid.',
          'A clean break and hold is required for delivery confirmation.',
          'A failed breakout would cancel the current bullish read.',
        ],
      },
      {
        title: 'Fundamental filter',
        icon: Landmark,
        accent: 'var(--chart-yellow)',
        bullets: [
          'Narrative alignment is neutral-to-supportive.',
          'No major contradiction is assumed in this mock screen.',
          'Macro stress would weaken this setup fast.',
        ],
      },
      {
        title: 'Indicator filter',
        icon: LineChart,
        accent: 'var(--chart-purple)',
        bullets: [
          'Momentum remains supportive.',
          'Trend-following signals still lean upward.',
          'Breakout volume remains the main confirmation requirement.',
        ],
      },
    ],
  },
  'SOL/USDT': {
    bias: 'Bearish',
    confidence: '76%',
    timeframe: '4H swing',
    currentPrice: '148.20',
    triggerPrice: '145.80',
    invalidationPrice: '151.40',
    targetPrice: '139.50',
    biasTone: 'var(--chart-red)',
    intro:
      'This setup is bearish. The page should stop sounding undecided and focus on why downside continuation is favored.',
    headline:
      'If price breaks and accepts below 145.80, the bearish continuation setup becomes active.',
    confirmationText:
      'A close below 145.80 confirms that support has failed and that sellers are controlling the next delivery leg.',
    invalidationText:
      'If price reclaims 151.40, the bearish idea weakens and the model should stop pushing bearish evidence as the main case.',
    summary:
      'When the AI says bearish, the page should give more bearish facts, a clean breakdown trigger, and a clear invalidation level above price.',
    bullishFacts: [
      'SMC is weak because the last defended support is close to failure.',
      'CRT favors downside delivery because the range has started to resolve lower.',
      'Fundamentals are not strong enough in this mock view to rescue the chart on their own.',
      'Indicators support weakness because momentum has rolled over instead of improving.',
    ],
    thesisSections: [
      {
        title: 'SMC confirmation',
        icon: Layers3,
        accent: 'var(--chart-blue)',
        bullets: [
          'Sell-side liquidity is resting below current price.',
          'The latest bounce did not recover meaningful bullish structure.',
          'Supply has capped price repeatedly near the same zone.',
        ],
      },
      {
        title: 'CRT confirmation',
        icon: CandlestickChart,
        accent: 'var(--chart-red)',
        bullets: [
          'The market is no longer compressing upward cleanly.',
          'A decisive break below support would complete the better bearish delivery path.',
          'Any quick reclaim back into range weakens the short thesis.',
        ],
      },
      {
        title: 'Fundamental filter',
        icon: Landmark,
        accent: 'var(--chart-yellow)',
        bullets: [
          'No strong positive catalyst is assumed here.',
          'The technical picture is doing more of the work than the narrative.',
          'A sudden positive headline could force a reassessment.',
        ],
      },
      {
        title: 'Indicator filter',
        icon: LineChart,
        accent: 'var(--chart-purple)',
        bullets: [
          'Momentum is softer rather than expanding upward.',
          'Trend alignment is weakening.',
          'Breakdown quality improves only if volume expands with the move.',
        ],
      },
    ],
  },
  'EUR/USD': {
    bias: 'Bullish',
    confidence: '72%',
    timeframe: '1D swing',
    currentPrice: '1.0842',
    triggerPrice: '1.0860',
    invalidationPrice: '1.0798',
    targetPrice: '1.0915',
    biasTone: 'var(--chart-green)',
    intro:
      'The model is bullish here, but the move still needs acceptance above a defined trigger before the thesis upgrades.',
    headline:
      'If price holds above 1.0860, the bullish path stays favored.',
    confirmationText:
      'A daily acceptance above 1.0860 would show that buyers are taking control above resistance.',
    invalidationText:
      'Below 1.0798, the current bullish structure is no longer reliable.',
    summary:
      'The page should read like a clear conditional bullish thesis, not a mixed argument list.',
    bullishFacts: [
      'Higher lows remain respected.',
      'Liquidity above price still offers a directional magnet.',
      'The range remains more constructive than distributive.',
      'Indicators are supportive but secondary.',
    ],
    thesisSections: [
      {
        title: 'SMC confirmation',
        icon: Layers3,
        accent: 'var(--chart-blue)',
        bullets: [
          'Demand remains defended below price.',
          'The structure has not broken bearish yet.',
          'Upside liquidity remains open.',
        ],
      },
      {
        title: 'CRT confirmation',
        icon: CandlestickChart,
        accent: 'var(--chart-green)',
        bullets: [
          'The move is still setting up for continuation.',
          'Acceptance matters more than a single spike.',
          'A failure back into range weakens the thesis fast.',
        ],
      },
      {
        title: 'Fundamental filter',
        icon: Landmark,
        accent: 'var(--chart-yellow)',
        bullets: [
          'The mock macro context is not hostile to the current move.',
          'Narrative support is modest rather than explosive.',
          'Unexpected central-bank risk would matter immediately.',
        ],
      },
      {
        title: 'Indicator filter',
        icon: LineChart,
        accent: 'var(--chart-purple)',
        bullets: [
          'Momentum is steady.',
          'Trend bias still leans upward.',
          'Volume and follow-through remain key confirmation factors.',
        ],
      },
    ],
  },
  NASDAQ: {
    bias: 'Bullish',
    confidence: '81%',
    timeframe: '1D swing',
    currentPrice: '18,420',
    triggerPrice: '18,560',
    invalidationPrice: '18,140',
    targetPrice: '18,980',
    biasTone: 'var(--chart-green)',
    intro:
      'The AI stays bullish while the index holds structure and reclaims higher ground cleanly.',
    headline:
      'A hold above 18,560 keeps the bullish continuation case in control.',
    confirmationText:
      'That level confirms strength through resistance and supports continuation toward the next upside objective.',
    invalidationText:
      'A break below 18,140 damages the long thesis and forces a new read.',
    summary:
      'The point is clarity: bullish bias, bullish reasons, clear trigger, clear invalidation.',
    bullishFacts: [
      'Market structure still favors continuation.',
      'Liquidity is positioned above current price.',
      'The range is not showing clean distribution yet.',
      'Indicators still align with the trend direction.',
    ],
    thesisSections: [
      {
        title: 'SMC confirmation',
        icon: Layers3,
        accent: 'var(--chart-blue)',
        bullets: [
          'Demand remains respected.',
          'The last higher low has not failed.',
          'Liquidity remains available above the highs.',
        ],
      },
      {
        title: 'CRT confirmation',
        icon: CandlestickChart,
        accent: 'var(--chart-green)',
        bullets: [
          'Compression remains constructive.',
          'A strong hold above the trigger confirms delivery.',
          'Failed acceptance would weaken conviction.',
        ],
      },
      {
        title: 'Fundamental filter',
        icon: Landmark,
        accent: 'var(--chart-yellow)',
        bullets: [
          'The mock macro backdrop is supportive enough.',
          'No direct contradiction is assumed.',
          'Risk-off headlines would still matter a lot.',
        ],
      },
      {
        title: 'Indicator filter',
        icon: LineChart,
        accent: 'var(--chart-purple)',
        bullets: [
          'Momentum remains constructive.',
          'Trend tools still support continuation.',
          'Participation must stay healthy on the move higher.',
        ],
      },
    ],
  },
};

export default function AiAnalysis() {
  const [selectedMarket, setSelectedMarket] = useState('BTC/USDT');
  const [availableMarkets, setAvailableMarkets] = useState(marketOptions);
  const [remoteAnalysis, setRemoteAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const [analysisError, setAnalysisError] = useState('');

  const fallbackAnalysis = analysisByMarket[selectedMarket] || analysisByMarket['BTC/USDT'];
  const analysis = remoteAnalysis || fallbackAnalysis;
  const isBullish = analysis.bias === 'Bullish';
  const facts = analysis.biasFacts || analysis.bullishFacts || [];
  const thesisSections = (analysis.thesisSections || []).map((section) => ({
    ...section,
    icon: typeof section.icon === 'string' ? iconByName[section.icon] || FileText : section.icon,
  }));

  useEffect(() => {
    let ignore = false;

    getAnalysisMarkets()
      .then((markets) => {
        if (!ignore && Array.isArray(markets) && markets.length > 0) {
          setAvailableMarkets(markets.filter((market) => analysisByMarket[market]));
        }
      })
      .catch(() => {
        if (!ignore) {
          setAvailableMarkets(marketOptions);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    runChartAnalysis({ market: selectedMarket })
      .then((analysisResult) => {
        if (!ignore) {
          setRemoteAnalysis(analysisResult);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setRemoteAnalysis(null);
          setAnalysisError(error instanceof Error ? error.message : 'Unable to load backend analysis');
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingAnalysis(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedMarket]);

  const selectMarket = (market) => {
    setSelectedMarket(market);
    setRemoteAnalysis(null);
    setIsLoadingAnalysis(true);
    setAnalysisError('');
  };

  const signalCards = [
    { label: 'AI bias', value: analysis.bias, tone: analysis.biasTone },
    { label: 'Confidence', value: analysis.confidence, tone: 'var(--chart-blue)' },
    { label: 'Timeframe', value: analysis.timeframe, tone: 'var(--chart-yellow)' },
    {
      label: isBullish ? 'Bullish trigger' : 'Bearish trigger',
      value: analysis.triggerPrice,
      tone: analysis.biasTone,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <section
        className="overflow-hidden rounded-[30px] border"
        style={{
          borderColor: 'var(--border)',
          background:
            'radial-gradient(circle at top left, rgba(24, 210, 107, 0.18), transparent 28%), radial-gradient(circle at 85% 10%, rgba(96, 165, 250, 0.16), transparent 22%), var(--card)',
        }}
      >
        <div className="grid gap-6 p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
              <Sparkles className="h-3.5 w-3.5" />
              Deep AI analysis
            </div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                borderColor: isBullish ? 'rgba(24, 210, 107, 0.25)' : 'rgba(255, 77, 79, 0.24)',
                backgroundColor: isBullish ? 'rgba(24, 210, 107, 0.08)' : 'rgba(255, 77, 79, 0.08)',
                color: analysis.biasTone,
              }}
            >
              <Clock3 className="h-3.5 w-3.5" />
              {isLoadingAnalysis ? 'Loading backend read' : `${analysis.bias} setup active`}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <h1 className="max-w-[620px] text-3xl font-semibold tracking-[-0.05em]">
                {analysis.headline}
              </h1>
              <p className="mt-3 max-w-[560px] text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
                {analysis.intro}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {availableMarkets.map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => selectMarket(market)}
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

              {analysisError ? (
                <p className="mt-3 text-sm font-medium" style={{ color: 'var(--chart-red)' }}>
                  {analysisError}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {signalCards.map((item) => (
                <div key={item.label} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
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
        <div className="rounded-[30px] border p-5 md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
                Price map
              </p>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{selectedMarket} trigger and invalidation zones</h2>
            </div>
            <Eye className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>

          <div
            className="relative overflow-hidden rounded-[26px] border p-5"
            style={{
              borderColor: 'var(--border)',
              background:
                'linear-gradient(180deg, rgba(11, 15, 23, 0.12), rgba(11, 15, 23, 0.5)), repeating-linear-gradient(to right, transparent 0, transparent 47px, rgba(255,255,255,0.04) 48px), repeating-linear-gradient(to bottom, transparent 0, transparent 47px, rgba(255,255,255,0.04) 48px), linear-gradient(180deg, rgba(96, 165, 250, 0.08), rgba(24, 210, 107, 0.06))',
            }}
          >
            <div className="mb-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
              <span>{selectedMarket}</span>
              <span>{analysis.timeframe}</span>
            </div>

            <div className="relative h-[300px]">
              <div
                className="absolute left-[8%] right-[9%] top-[20%] rounded-xl border px-3 py-2 text-xs font-semibold"
                style={{
                  borderColor: isBullish ? 'rgba(24, 210, 107, 0.3)' : 'rgba(255, 77, 79, 0.3)',
                  backgroundColor: isBullish ? 'rgba(24, 210, 107, 0.12)' : 'rgba(255, 77, 79, 0.12)',
                  color: analysis.biasTone,
                }}
              >
                Trigger zone: {analysis.triggerPrice}
              </div>

              <div
                className="absolute left-[8%] right-[9%] top-[49%] rounded-xl border px-3 py-2 text-xs font-semibold"
                style={{
                  borderColor: 'rgba(96, 165, 250, 0.3)',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  color: 'var(--chart-blue)',
                }}
              >
                Current price: {analysis.currentPrice}
              </div>

              <div
                className="absolute left-[8%] right-[9%] top-[76%] rounded-xl border px-3 py-2 text-xs font-semibold"
                style={{
                  borderColor: isBullish ? 'rgba(255, 77, 79, 0.3)' : 'rgba(24, 210, 107, 0.3)',
                  backgroundColor: isBullish ? 'rgba(255, 77, 79, 0.1)' : 'rgba(24, 210, 107, 0.1)',
                  color: isBullish ? 'var(--chart-red)' : 'var(--chart-green)',
                }}
              >
                Invalidation: {analysis.invalidationPrice}
              </div>

              <div className="absolute inset-x-[10%] bottom-[18%] top-[18%]">
                <svg viewBox="0 0 100 60" className="h-full w-full">
                  <path
                    d={
                      isBullish
                        ? 'M2 48 C10 49, 17 46, 24 44 S38 40, 46 36 S58 29, 66 24 S82 17, 98 11'
                        : 'M2 12 C11 14, 18 18, 25 23 S39 29, 48 33 S59 38, 68 42 S82 47, 98 51'
                    }
                    fill="none"
                    stroke={isBullish ? 'var(--chart-green)' : 'var(--chart-red)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div
                className="absolute right-[9%] top-[7%] rounded-2xl border px-3 py-2 text-xs font-semibold"
                style={{
                  borderColor: isBullish ? 'rgba(24, 210, 107, 0.3)' : 'rgba(255, 77, 79, 0.3)',
                  backgroundColor: isBullish ? 'rgba(24, 210, 107, 0.12)' : 'rgba(255, 77, 79, 0.12)',
                  color: analysis.biasTone,
                }}
              >
                Target: {analysis.targetPrice}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: analysis.biasTone }} />
                <p className="text-sm font-semibold">Confirmation point</p>
              </div>
              <p className="text-sm leading-7" style={{ color: 'var(--muted-foreground)' }}>
                {analysis.confirmationText}
              </p>
            </div>

            <div className="rounded-[24px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
              <div className="mb-3 flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" style={{ color: isBullish ? 'var(--chart-red)' : 'var(--chart-green)' }} />
                <p className="text-sm font-semibold">Invalidation point</p>
              </div>
              <p className="text-sm leading-7" style={{ color: 'var(--muted-foreground)' }}>
                {analysis.invalidationText}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" style={{ color: analysis.biasTone }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Why the AI is {analysis.bias.toLowerCase()}</h2>
            </div>
            <div className="space-y-3">
              {facts.map((item) => (
                <div key={item} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">AI conclusion</h2>
            </div>
            <p className="text-sm leading-7" style={{ color: 'var(--muted-foreground)' }}>
              {analysis.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {thesisSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-[30px] border p-5 md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: section.accent }} />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.bullets.map((item) => (
                  <div key={item} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[30px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-4 w-4" style={{ color: 'var(--chart-blue)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Structure state</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]" style={{ color: analysis.biasTone }}>
            {isBullish ? 'Holding' : 'Weakening'}
          </p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            {isBullish
              ? 'The current structure still supports continuation while the invalidation level stays protected.'
              : 'The structure is vulnerable enough that a breakdown trigger would activate the bearish path.'}
          </p>
        </div>

        <div className="rounded-[30px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <CandlestickChart className="h-4 w-4" style={{ color: analysis.biasTone }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Delivery read</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            {isBullish ? 'Upside pending' : 'Downside pending'}
          </p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            {isBullish
              ? 'The move still needs acceptance above the trigger before continuation is treated as active.'
              : 'The move still needs acceptance below the trigger before continuation is treated as active.'}
          </p>
        </div>

        <div className="rounded-[30px] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" style={{ color: 'var(--chart-purple)' }} />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">Indicator state</h2>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em]">Confirming</p>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            Indicators are supporting the bias, but the trigger level remains the actual decision point.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border p-5 md:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[580px]">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--muted-foreground)' }}>
              Report handoff
            </p>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              Keep the page aligned with the active bias: one main direction, one trigger price, one invalidation level, then facts that support that call.
            </h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Open full trade report
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
