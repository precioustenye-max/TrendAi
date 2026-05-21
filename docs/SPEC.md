# TrendAi — Product Specification

> A complete, exhaustive blueprint to reproduce the TrendAi application from scratch.

---

## 1. App Identity

| Field | Value |
|---|---|
| **App name** | **TrendAi** |
| **Tagline** | AI Trading Analysis Platform |
| **Description** | AI-powered trading analysis platform with real-time signals, SMC/ICT analysis, and Gemini Vision. Educational tool — not financial advice. |
| **Logo mark** | Solid green rounded square with a white chart icon |
| **Wordmark** | `NEURAL` + `TRADE` |
| **HTML title** | `TrendAi — AI Trading Analysis Platform` |
| **Meta description** | AI-powered trading analysis platform with SMC/ICT methodology |
| **Global disclaimer** | "AI insights are educational. Not financial advice." |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Language** | TypeScript | 5.x |
| **Routing** | React Router | 7.x |
| **Styling** | Tailwind CSS | 4.x |
| **Theme** | next-themes | latest |
| **Charts** | Lightweight Charts | 5.x |
| **Animations** | Framer Motion | 12.x |
| **Data Fetching** | TanStack Query | 5.x |
| **UI** | shadcn/ui | latest |
| **Icons** | Lucide React | latest |
| **Backend** | Fastify | 5.x |
| **ORM** | Prisma | 5.x |
| **Database** | PostgreSQL | - |
| **Auth** | Clerk | latest |
| **AI** | Gemini AI | - |

---

## 3. Design System

### 3.1 Theme — Dark-first Trading Terminal

The app uses Tailwind CSS v4 with OKLCH color space. Colors are defined in `src/index.css` as CSS custom properties with `@theme inline`.

```css
:root {
  /* Dark mode (default) */
  --background: oklch(0.145 0.016 285);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.488 0.243 264);
  --primary-foreground: oklch(1 0 0);
  --card: oklch(0.22 0.015 285);
  --card-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.284 0.033 285);
  --muted: oklch(0.284 0.033 285);
  --accent: oklch(0.278 0.037 260);
  --destructive: oklch(0.396 0.141 28);
  --border: oklch(0.303 0.026 285);
  --ring: oklch(0.488 0.243 264);
}

.light {
  /* Light mode */
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.545 0.223 276);
  --primary-foreground: oklch(1 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --accent: oklch(0.95 0.03 267);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --ring: oklch(0.545 0.223 276);
}
```

### 3.2 Design Tokens

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--color-bull` | oklch(0.566 0.198 156) | oklch(0.566 0.198 156) | Buy/Positive |
| `--color-bear` | oklch(0.577 0.245 27) | oklch(0.577 0.245 27) | Sell/Negative |
| `--radius` | 1rem | 1rem | Border radius |
| `--font-sans` | Plus Jakarta Sans | Plus Jakarta Sans | Body text |
| `--font-mono` | JetBrains Mono | JetBrains Mono | Numbers/tickers |

### 3.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Plus Jakarta Sans | 700 | 2.5rem |
| H2 | Plus Jakarta Sans | 600 | 1.75rem |
| H3 | Plus Jakarta Sans | 600 | 1.25rem |
| Body | Plus Jakarta Sans | 400 | 1rem |
| Mono | JetBrains Mono | 500 | 0.875rem |

---

## 4. Pages & Views

### 4.1 Route Structure

```
/ → Dashboard (default view after login)
/analyze → AI Analysis (instant ticker analysis)
/analyzer → Chart Analyzer (screenshot upload)
/history → History (past analyses)
/settings → Settings (preferences)
```

### 4.2 Dashboard View

**Path:** `/`

**Components:**
- Header with logo + theme toggle
- Stats grid: Total analyses, Bullish calls, Bearish calls, Avg confidence
- Quick analyze buttons: BTC/USDT, ETH/USDT, SOL/USDT, EUR/USD, AAPL
- Recent activity list: Last 10 analyses

### 4.3 AI Analysis View

**Path:** `/analyze`

**State:**
```typescript
interface State {
  symbol: string;
  loading: boolean;
  analysis: Analysis | null;
}
```

**Query Params:**
- `?symbol=BTC/USDT` - Auto-analyze on load

**Components:**
- Search input (autocomplete with recent)
- Analysis card (direction, confidence, reasoning)
- Timeframe plan (HTF bias → POI → Entry)
- Trading chart (Lightweight Charts)
- Suggested action (Entry, SL, TP)

### 4.4 Chart Analyzer View

**Path:** `/analyzer`

**Components:**
- Drag-and-drop upload zone
- Image preview with remove button
- Optional context input
- Analyze button
- Result card (direction, confidence, SMC observations)

### 4.5 History View

**Path:** `/history`

**Components:**
- Filter by symbol
- Filter by direction (All/Bullish/Bearish)
- List with direction icon, symbol, timestamp
- Click to re-analyze
- Delete on hover

### 4.6 Settings View

**Path:** `/settings`

**Components:**
- Theme toggle (Dark/Light/System)
- Notifications toggle
- Clear history button
- About section with disclaimer

---

## 5. Components

### 5.1 shadcn/ui Components

| Component | Purpose |
|---|---|
| Button | Primary, secondary, destructive, ghost variants |
| Card | Content containers |
| Input | Text input fields |
| Tabs | View switching |
| DropdownMenu | Action menus |
| ThemeToggle | Dark/light mode switch |

### 5.2 Trading Components

| Component | Purpose |
|---|---|
| AIAnalysisCard | Main verdict card with SMC reasoning |
| TradingChart | Lightweight Charts candlestick chart |
| MiniIndicators | RSI, MACD, Trend display |
| AssetSearch | Autocomplete ticker search |

---

## 6. API Contract

### 6.1 Frontend → Backend

**Base URL:** `http://localhost:4000` (dev)

| Method | Endpoint | Body | Response |
|-------|----------|------|----------|
| GET | `/api/analyze?symbol=BTC/USDT` | - | Analysis |
| POST | `/api/analyze-chart` | `{imageDataUrl, note?}` | ChartAnalysis |
| GET | `/api/history` | - | Analysis[] |
| DELETE | `/api/history/:id` | - | `{success}` |

### 6.2 Analysis Response

```typescript
interface Analysis {
  symbol: string;
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  reasoning: {
    technical: string[];
    indicators: string[];
    fundamental: string[];
  };
  timeframe: {
    htfBias: { tf: string; label: string };
    poi: { tf: string; label: string };
    entry: { tf: string; label: string };
    killzone: string;
    recommended: string;
  };
  trade: {
    entry: number;
    stopLoss: number;
    takeProfit: number;
  };
}
```

---

## 7. Database Schema

### 7.1 Prisma Schema

```prisma
model User {
  id        String     @id @default(cuid())
  clerkId   String     @unique
  email     String     @unique
  name      String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  analyses  Analysis[]
}

model Analysis {
  id          String   @id @default(cuid())
  userId      String
  symbol     String
  direction  String
  confidence Int
  reasoning  Json
  timeframe  Json?
  trade      Json?
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 8. Authentication

### 8.1 Clerk Integration

**Frontend:** `@clerk/react-router` for sign-in/sign-up
**Backend:** `@clerk/fastify` for route protection

**Protected Routes:**
- `/api/analyze`
- `/api/analyze-chart`
- `/api/history`

**Public Routes:**
- `/health`
- `/api/analyze` (rate limited)

---

## 9. Feature Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [x] Basic UI components
- [x] Theme system
- [x] API endpoints
- [x] Database schema

### Phase 2 (Core Features)
- [ ] AI Analysis view with mock data
- [ ] Chart Analyzer with Gemini Vision
- [ ] History with database
- [ ] Clerk authentication

### Phase 3 (Enhancements)
- [ ] Real-time market data
- [ ] Multiple chart timeframes
- [ ] Advanced indicators
- [ ] Export functionality

### Phase 4 (Monetization)
- [ ] Stripe integration
- [ ] Subscription tiers
- [ ] Pro features

---

## 10. Deployment

| Service | Platform | Notes |
|--------|----------|-------|
| Frontend | Vercel | Zero-config, auto TLS |
| Backend | Railway/Render | Node.js runtime |
| Database | Neon | Serverless PostgreSQL |
| Auth | Clerk | Managed auth |
| AI | Google AI | Gemini API |

---

## 11. Development Commands

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Backend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start production server
npm run start
```

---

## 12. Version History

| Version | Date | Changes |
|--------|------|---------|
| 1.0.0 | Initial | Project setup with basic UI |

---

**End of specification.**
