import {
  ArrowRight,
  Camera,
  CandlestickChart,
  Eye,
  ImagePlus,
  Layers3,
  Menu,
  MessageCircle,
  Moon,
  Music2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navItems = ['Home', 'Features', 'How It Works', 'Edge'];

const featureCards = [
  {
    icon: ImagePlus,
    title: 'Screenshot AI',
    text: 'Upload a chart and get a clean execution plan with entry, stop loss, targets, and a separate deep report.',
  },
  {
    icon: Layers3,
    title: 'SMC Structure',
    text: 'Read BOS, CHOCH, order blocks, breaker blocks, supply, demand, and support resistance with institutional logic.',
  },
  {
    icon: ScanSearch,
    title: 'Trade Validation',
    text: 'Validate setups with structure and liquidity context instead of reacting to shallow buy and sell prompts.',
  },
];

const lowerCards = [
  {
    icon: CandlestickChart,
    title: 'Fast trade plan',
    text: 'The screenshot page gives you the execution data first so you can act faster.',
  },
  {
    icon: Eye,
    title: 'Separate explanation',
    text: 'Full trade reasoning opens on its own page so the dashboard flow stays clean and lightweight.',
  },
  {
    icon: Sparkles,
    title: 'Institutional AI',
    text: 'The platform still reasons with structure, support resistance, liquidity, and SMC logic underneath.',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Drop a chart',
    text: 'Start with the screenshot, not a blank form. The product is built around the fastest path from image to decision.',
    icon: ImagePlus,
  },
  {
    step: '02',
    title: 'Read the structure',
    text: 'The engine maps liquidity, structure breaks, order blocks, and key zones before producing a bias.',
    icon: Layers3,
  },
  {
    step: '03',
    title: 'Execute with context',
    text: 'Receive a concise trade plan first, then open the deeper rationale when you need more detail.',
    icon: Target,
  },
];

const edgePoints = [
  'Execution-first workflow instead of bloated analytics screens',
  'Chart-aware reasoning built for structure and liquidity',
  'Fast dashboard access for repeat analysis sessions',
];

const socialLinks = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@neuraltrade.ai', icon: Music2 },
  { label: 'Instagram', href: 'https://www.instagram.com/neuraltrade.ai', icon: Camera },
  { label: 'Facebook', href: 'https://www.facebook.com/neuraltradeai', icon: Users },
  { label: 'WhatsApp', href: 'https://wa.me/1234567890', icon: MessageCircle },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';
  const heroShellBackground = isLight
    ? 'radial-gradient(circle at 50% 84%, rgba(24, 210, 107, 0.14), transparent 18%), radial-gradient(circle at 22% 92%, rgba(245, 158, 11, 0.12), transparent 16%), radial-gradient(circle at 78% 80%, rgba(96, 165, 250, 0.16), transparent 22%), radial-gradient(circle at top left, rgba(24, 210, 107, 0.08), transparent 20%), radial-gradient(circle at top right, rgba(96, 165, 250, 0.08), transparent 22%), radial-gradient(rgba(37,99,235,0.08) 1px, transparent 1px)'
    : 'radial-gradient(circle at 50% 84%, rgba(24, 210, 107, 0.28), transparent 18%), radial-gradient(circle at 22% 92%, rgba(245, 158, 11, 0.2), transparent 16%), radial-gradient(circle at 78% 80%, rgba(96, 165, 250, 0.22), transparent 22%), radial-gradient(circle at top left, rgba(24, 210, 107, 0.1), transparent 20%), radial-gradient(circle at top right, rgba(96, 165, 250, 0.1), transparent 22%), radial-gradient(rgba(96,165,250,0.34) 1px, transparent 1px)';
  const overlayBackground = isLight
    ? 'linear-gradient(180deg, rgba(245,247,251,0.72), rgba(245,247,251,0.4) 42%, rgba(245,247,251,0.88) 100%)'
    : 'linear-gradient(180deg, rgba(5,8,12,0.78), rgba(5,8,12,0.2) 42%, rgba(5,8,12,0.88) 100%)';
  const primaryPanelBackground = isLight
    ? 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,252,0.9))'
    : 'linear-gradient(180deg, rgba(7,10,12,0.9), rgba(5,7,10,0.84))';
  const secondaryPanelBackground = isLight
    ? 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246,248,252,0.92))'
    : 'linear-gradient(180deg, rgba(8,11,14,0.9), rgba(7,10,12,0.82))';
  const cardBackground = isLight ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.03)';
  const softBackground = isLight ? 'rgba(255,255,255,0.74)' : 'rgba(255,255,255,0.04)';
  const borderGlow = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.04)';
  const subtleText = isLight ? 'rgba(15,23,42,0.66)' : 'rgba(255,255,255,0.66)';
  const dimText = isLight ? 'rgba(15,23,42,0.52)' : 'rgba(255,255,255,0.62)';
  const fadedText = isLight ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.38)';
  const strongText = 'var(--foreground)';
  const heroTitleColor = isLight ? '#0f172a' : '#ffffff';
  const ghostButtonBackground = isLight ? 'rgba(15,23,42,0.04)' : 'rgba(255,255,255,0.04)';
  const ghostButtonBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)';
  const logoTileBackground = isLight ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.04)';
  const logoTileShadow = isLight
    ? 'inset 0 0 0 1px rgba(15,23,42,0.06), 0 12px 30px rgba(148,163,184,0.18)'
    : 'inset 0 0 0 1px rgba(255,255,255,0.05)';
  const logoAltTile = isLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.8)';
  const navLinkHref = (item) => `#${item.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div
        className="relative min-h-screen"
        style={{
          background: heroShellBackground,
          backgroundSize: 'auto, auto, auto, auto, auto, 26px 26px',
          backgroundPosition: 'center, center, center, left top, right top, center',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: overlayBackground,
          }}
        />

        <motion.div
          animate={{ opacity: 1 }}
          className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-4 pb-14 pt-4 sm:px-6 md:px-8"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-full px-4 py-3 md:px-6"
            initial={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-4">
                <Link to="/" className="inline-flex min-w-0 items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    className="grid h-9 w-9 shrink-0 grid-cols-3 gap-1 rounded-xl p-2"
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      backgroundColor: logoTileBackground,
                      boxShadow: logoTileShadow,
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className="rounded-[2px]"
                        style={{
                          backgroundColor: index % 3 === 1 ? 'var(--primary)' : logoAltTile,
                        }}
                      />
                    ))}
                  </motion.div>
                  <span className="truncate text-xl font-semibold tracking-[-0.03em]">NeuralTrade</span>
                </Link>

                <nav className="hidden items-center justify-center gap-6 text-sm md:flex" style={{ color: dimText }}>
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={navLinkHref(item)}
                      className="transition"
                      style={{ color: 'inherit' }}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-[1.03] md:hidden"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: ghostButtonBackground,
                    color: 'var(--foreground)',
                    boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                  }}
                  aria-expanded={isMobileMenuOpen}
                  aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition hover:scale-[1.02] sm:px-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.18), rgba(24, 210, 107, 0.14))',
                    boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.14), 0 0 28px rgba(96,165,250,0.1)',
                    color: strongText,
                  }}
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:scale-[1.03]"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: ghostButtonBackground,
                    color: 'var(--foreground)',
                    boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                  }}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>

              {isMobileMenuOpen ? (
                <div
                  className="absolute left-0 right-0 top-full z-20 mt-3 md:hidden"
                  style={{
                    background: secondaryPanelBackground,
                    boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                    borderRadius: '24px',
                  }}
                >
                  <nav className="flex flex-col gap-1 p-3 text-sm" style={{ color: strongText }}>
                    {navItems.map((item) => (
                      <a
                        key={item}
                        href={navLinkHref(item)}
                        className="rounded-2xl px-4 py-3 transition"
                        style={{
                          backgroundColor: ghostButtonBackground,
                          boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                          color: 'inherit',
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
              ) : null}
            </div>
          </motion.header>

          <main className="flex-1">
            <section
              id="home"
              className="relative overflow-hidden rounded-[34px] px-4 pb-12 pt-10 sm:px-6 md:px-10 md:pb-16 md:pt-14"
              style={{
                background: primaryPanelBackground,
                boxShadow: `inset 0 0 0 1px ${borderGlow}`,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                className="pointer-events-none absolute inset-x-[14%] bottom-[-10%] h-[320px] rounded-full blur-3xl"
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background:
                    'radial-gradient(circle, rgba(24,210,107,0.42) 0%, rgba(96,165,250,0.34) 38%, rgba(245,158,11,0.26) 58%, transparent 74%)',
                }}
              />
              <motion.div
                animate={{ x: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
                className="pointer-events-none absolute inset-x-[24%] top-[-18%] h-[240px] rounded-full blur-3xl"
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.14), transparent 68%)' }}
              />

              <motion.div
                className="relative z-10 mx-auto max-w-[860px] text-center"
                initial="hidden"
                animate="show"
                variants={stagger}
              >
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: 'rgba(96, 165, 250, 0.08)',
                    color: 'var(--chart-blue)',
                    boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.16)',
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI market intelligence
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  transition={{ duration: 0.55 }}
                  className="mt-6 text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.06em] sm:text-[4rem] lg:text-[5.1rem]"
                  style={{ color: heroTitleColor }}
                >
                 Precision
                  <br />
                  Trading 
                  <br />
                   starts here.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mt-5 max-w-[620px] text-sm leading-7 sm:text-base"
                  style={{ color: subtleText }}
                >
                  NeuralTrade helps you move from chart screenshot to a clean trade plan fast. Get the execution first, then scroll for more or open the deeper explanation when you need it.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                  <Link
                    to="/chat-analyzer"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Explore Screenshot AI
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                    style={{
                      backgroundColor: ghostButtonBackground,
                      boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                      color: strongText,
                    }}
                  >
                    Open Dashboard
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mt-14 min-h-[280px] sm:min-h-[360px]"
              >
                <div
                  className="absolute bottom-[-3%] left-1/2 h-[220px] w-[88%] -translate-x-1/2 rounded-t-[999px]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(24,210,107,0.14), rgba(96,165,250,0.2) 48%, rgba(4,6,8,0) 100%)',
                    boxShadow: isLight ? '0 0 100px rgba(24,210,107,0.1)' : '0 0 120px rgba(24,210,107,0.16)',
                  }}
                />

                <motion.div
                  whileHover={{ y: -8 }}
                  className="mx-auto w-full max-w-[760px] rounded-[34px] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-6"
                  style={{
                    background: secondaryPanelBackground,
                    boxShadow: isLight
                      ? 'inset 0 0 0 1px rgba(24,210,107,0.08), 0 30px 80px rgba(148,163,184,0.18)'
                      : 'inset 0 0 0 1px rgba(24,210,107,0.06), 0 30px 120px rgba(0,0,0,0.45)',
                  }}
                >
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold" style={{ color: strongText }}>Chart Screenshot Intelligence</p>
                      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: fadedText }}>Fast execution output</p>
                    </div>
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        backgroundColor: 'rgba(24,210,107,0.08)',
                        color: 'var(--chart-green)',
                        boxShadow: 'inset 0 0 0 1px rgba(24,210,107,0.14)',
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Trade validated
                    </div>
                  </div>

                  <div
                    className="rounded-[26px] p-4"
                    style={{
                      backgroundColor: isLight ? 'rgba(248,250,252,0.96)' : 'rgba(13,17,20,0.78)',
                      boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: fadedText }}>
                      <span>Execution chart</span>
                      <span>NeuralTrade</span>
                    </div>

                    <div
                      className="relative h-[240px] overflow-hidden rounded-[22px]"
                      style={{
                        background: isLight
                          ? 'linear-gradient(180deg, rgba(96,165,250,0.08), rgba(24,210,107,0.05)), repeating-linear-gradient(to right, transparent 0, transparent 52px, rgba(15,23,42,0.05) 53px), repeating-linear-gradient(to bottom, transparent 0, transparent 46px, rgba(15,23,42,0.05) 47px)'
                          : 'linear-gradient(180deg, rgba(96,165,250,0.06), rgba(24,210,107,0.04)), repeating-linear-gradient(to right, transparent 0, transparent 52px, rgba(255,255,255,0.03) 53px), repeating-linear-gradient(to bottom, transparent 0, transparent 46px, rgba(255,255,255,0.03) 47px)',
                      }}
                    >
                      <div className="absolute left-[9%] right-[8%] top-[28%] border-t border-dashed" style={{ borderColor: isLight ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.22)' }} />
                      <div className="absolute bottom-[19%] left-[8%] right-[12%] border-t" style={{ borderColor: 'rgba(24,210,107,0.38)' }} />
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-[8%] bottom-[15%] top-[18%]"
                      >
                        <svg viewBox="0 0 100 60" className="h-full w-full">
                          <path
                            d="M2 51 C12 46, 16 42, 24 40 S34 36, 42 32 S54 25, 64 23 S80 18, 98 10"
                            fill="none"
                            stroke="var(--chart-green)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>

                      <motion.div
                        animate={{ opacity: [0.55, 0.85, 0.55] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-[58%] top-[43%] h-[44px] w-[20%] bg-white/18"
                      />
                      <div className="absolute left-[56%] top-[38%] h-[92px] w-[30%]" style={{ backgroundColor: 'rgba(245,158,11,0.18)' }} />
                      <div
                        className="absolute right-[7%] top-[14%] rounded-2xl px-3 py-2 text-[11px] font-semibold"
                        style={{
                          backgroundColor: 'rgba(96,165,250,0.12)',
                          color: 'var(--chart-blue)',
                          boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.18)',
                        }}
                      >
                        TP zone
                      </div>
                      <div
                        className="absolute left-[8%] bottom-[8%] rounded-2xl px-3 py-2 text-[11px] font-semibold"
                        style={{
                          backgroundColor: 'rgba(24,210,107,0.12)',
                          color: 'var(--chart-green)',
                          boxShadow: 'inset 0 0 0 1px rgba(24,210,107,0.18)',
                        }}
                      >
                        Entry zone
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        ['Entry', '64,280'],
                        ['SL', '63,780'],
                        ['TP 1', '64,980'],
                      ].map(([label, value]) => (
                        <motion.div
                          key={label}
                          whileHover={{ y: -4 }}
                          className="rounded-2xl px-4 py-3"
                          style={{ backgroundColor: softBackground }}
                        >
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: fadedText }}>{label}</p>
                          <p className="text-sm font-semibold" style={{ color: strongText }}>{value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            <motion.section
              id="features"
              className="container mx-auto mt-20 grid gap-4 md:grid-cols-3"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {featureCards.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    className="rounded-[28px] p-5"
                    style={{
                      backgroundColor: cardBackground,
                      boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                    }}
                  >
                    <div
                      className="inline-flex rounded-2xl p-3"
                      style={{
                        backgroundColor: 'rgba(24,210,107,0.08)',
                        color: 'var(--primary)',
                        boxShadow: 'inset 0 0 0 1px rgba(24,210,107,0.12)',
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold" style={{ color: strongText }}>{item.title}</h2>
                    <p className="mt-3 text-sm leading-6" style={{ color: subtleText }}>{item.text}</p>
                  </motion.div>
                );
              })}
            </motion.section>

            <motion.section
              id="how-it-works"
              className="container mx-auto mt-8 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="rounded-[32px] p-6 md:p-8"
                style={{
                  background: secondaryPanelBackground,
                  boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: 'rgba(24,210,107,0.08)',
                    color: 'var(--chart-green)',
                    boxShadow: 'inset 0 0 0 1px rgba(24,210,107,0.16)',
                  }}
                >
                  <Zap className="h-3.5 w-3.5" />
                  How it works
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]" style={{ color: strongText }}>
                  Built to reduce delay between chart analysis and action.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7" style={{ color: subtleText }}>
                  Most trading tools overload the first screen. NeuralTrade pushes the highest-value action to the front, then reveals the extra reasoning underneath.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4">
                {workflowSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.step}
                      whileHover={{ x: 6 }}
                      className="rounded-[28px] p-5"
                      style={{
                        backgroundColor: cardBackground,
                        boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                      }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex items-center gap-3">
                          <div
                            className="inline-flex rounded-2xl p-3"
                            style={{
                              backgroundColor: 'rgba(96,165,250,0.08)',
                              color: 'var(--chart-blue)',
                              boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.14)',
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: fadedText }}>
                            Step {item.step}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: strongText }}>{item.title}</h3>
                          <p className="mt-2 text-sm leading-6" style={{ color: subtleText }}>{item.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.section>

            <motion.section
              id="edge"
              className="container mx-auto mt-8 grid gap-4 md:grid-cols-3"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {lowerCards.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    className="rounded-[28px] p-5"
                    style={{
                      backgroundColor: cardBackground,
                      boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                    <h2 className="mt-4 text-lg font-semibold" style={{ color: strongText }}>{item.title}</h2>
                    <p className="mt-3 text-sm leading-6" style={{ color: subtleText }}>{item.text}</p>
                  </motion.div>
                );
              })}
            </motion.section>

            <motion.section
              className="container mx-auto mt-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
            >
              <div
                className="rounded-[32px] px-6 py-7 md:px-8"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(24,210,107,0.08), rgba(245,158,11,0.08))',
                  boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                }}
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                  <div>
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'var(--chart-blue)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                      }}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      NeuralTrade edge
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]" style={{ color: strongText }}>
                      A sharper first screen for traders who want clarity fast.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: subtleText }}>
                      The product flow is designed to remove hesitation, shorten analysis time, and keep the deeper logic available without slowing down the first decision.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {edgePoints.map((point) => (
                      <motion.div
                        key={point}
                        whileHover={{ x: 4 }}
                        className="rounded-[22px] px-4 py-4"
                        style={{
                          backgroundColor: isLight ? 'rgba(255,255,255,0.68)' : 'rgba(6,9,12,0.52)',
                          boxShadow: `inset 0 0 0 1px ${borderGlow}`,
                        }}
                      >
                        <p className="text-sm" style={{ color: isLight ? 'rgba(15,23,42,0.78)' : 'rgba(255,255,255,0.76)' }}>{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </main>

          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container mx-auto mt-10"
          >
            <div
              className="grid gap-8 rounded-[32px] px-6 py-8 md:grid-cols-[1.1fr_0.9fr_0.8fr] md:px-8"
              style={{
                backgroundColor: cardBackground,
                boxShadow: `inset 0 0 0 1px ${borderGlow}`,
              }}
            >
              <div>
                <div className="inline-flex items-center gap-3">
                  <div
                    className="grid h-9 w-9 grid-cols-3 gap-1 rounded-xl p-2"
                    style={{
                      backgroundColor: logoTileBackground,
                      boxShadow: logoTileShadow,
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className="rounded-[2px]"
                        style={{
                          backgroundColor: index % 3 === 1 ? 'var(--primary)' : logoAltTile,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold tracking-[-0.03em]" style={{ color: strongText }}>NeuralTrade</span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7" style={{ color: dimText }}>
                  Screenshot-first market intelligence for traders who want clean execution planning without dashboard clutter.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: fadedText }}>Navigate</p>
                <div className="mt-4 flex flex-col gap-3 text-sm" style={{ color: dimText }}>
                  <a href="#home" className="transition" style={{ color: 'inherit' }}>Home</a>
                  <a href="#features" className="transition" style={{ color: 'inherit' }}>Features</a>
                  <a href="#how-it-works" className="transition" style={{ color: 'inherit' }}>How It Works</a>
                  <a href="#edge" className="transition" style={{ color: 'inherit' }}>Edge</a>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: fadedText }}>Actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition"
                    style={{
                      backgroundColor: ghostButtonBackground,
                      boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                      color: strongText,
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/chat-analyzer"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Start Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: fadedText }}>Developer</p>
                <div className="mt-4 space-y-3 text-sm" style={{ color: dimText }}>
                  <p className="font-semibold" style={{ color: strongText }}>CloudForge</p>
                  <p>Developer contact: cloudforge.dev@example.com</p>
                  <p>Available for product builds, UI systems, and trading tools.</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:scale-[1.03]"
                        style={{
                          backgroundColor: ghostButtonBackground,
                          boxShadow: `inset 0 0 0 1px ${ghostButtonBorder}`,
                          color: strongText,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
