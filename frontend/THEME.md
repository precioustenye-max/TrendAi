# TrendAI Core Theme

This document outlines the complete design system and color palette for TrendAI. All components should follow these guidelines for consistency.

## Color Tokens

### Background & Text
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `background` | `220 20% 7%` | `#0E1117` | Main app background (deep near-black) |
| `foreground` | `210 20% 92%` | `#E6EAF0` | Primary text |
| `card` | `220 18% 10%` | `#14181F` | Card surfaces |
| `popover` | `220 18% 12%` | `#181D26` | Popovers / dropdowns |
| `secondary` | `220 16% 16%` | `#21262F` | Buttons, inputs background |
| `muted` | `220 14% 14%` | `#1D2128` | Subtle surfaces |
| `muted-foreground` | `215 12% 50%` | `#71798A` | Secondary text |
| `border` / `input` | `220 14% 18%` | `#262B34` | Borders & input outlines |

### Brand & Accents
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `primary` | `142 71% 45%` | `#21C55D` | Bullish green — buy signals, CTAs, brand color |
| `primary-foreground` | `220 20% 7%` | `#0E1117` | Text on primary |
| `accent` | `38 92% 50%` | `#F59E0B` | Amber/gold — warnings, highlights |
| `destructive` | `0 72% 51%` | `#DC2626` | Bearish red — sell signals, errors |
| `ring` | `142 71% 45%` | `#21C55D` | Focus rings |

### Chart Palette
| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `chart-green` | `142 71% 45%` | `#21C55D` | Bullish candles / up trends |
| `chart-red` | `0 72% 51%` | `#DC2626` | Bearish candles / down trends |
| `chart-blue` | `217 91% 60%` | `#3B82F6` | Volume, MA lines |
| `chart-yellow` | `38 92% 50%` | `#F59E0B` | Warnings, highlights |
| `chart-purple` | `270 70% 60%` | `#A855F7` | Special indicators (RSI, etc.) |

### Sidebar
| Token | Value | Hex |
|-------|-------|-----|
| `sidebar-background` | `220 20% 5%` | `#0A0D12` |
| `sidebar-foreground` | `210 15% 75%` | `#B5BCC8` |
| `sidebar-accent` | `220 16% 12%` | `#181D26` |
| `sidebar-border` | `220 14% 15%` | `#1F242C` |

## Fonts

### Font Families
- **Body, UI, Headings**: `Inter` (weights: 300, 400, 500, 600, 700, 800)
- **Numbers, Prices, Tickers, Code, Timestamps**: `JetBrains Mono` (weights: 400, 500, 600, 700)

### Tailwind Classes
- `font-sans` → Inter
- `font-mono` → JetBrains Mono

## Gradients & Effects

### Gradients
```css
--bullish-gradient: linear-gradient(135deg, #21C55D → #29A37F)
--bearish-gradient: linear-gradient(135deg, #DC2626 → #C7421F)
--card-gradient: linear-gradient(135deg, #14181F → #181D26)
```

### Glows
```css
--green-glow: 0 0 20px rgba(33, 197, 93, 0.15)
--red-glow: 0 0 20px rgba(220, 38, 38, 0.15)
```

## Usage Examples

### Primary Button
```jsx
<button className="bg-primary hover:bg-opacity-90 text-primary-foreground font-semibold py-2 px-4 rounded-lg">
  Action
</button>
```

### Card Component
```jsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Input Field
```jsx
<input 
  className="bg-secondary border border-border text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 focus:border-primary focus:outline-none"
  placeholder="Search..."
/>
```

### Bullish/Bearish Text
```jsx
<span className="text-chart-green">Bullish</span>
<span className="text-destructive">Bearish</span>
```

### Monospace (for prices/tickers)
```jsx
<span className="font-mono text-foreground">BTC/USDT</span>
```

## Component Library Classes

Common utility classes defined in `src/index.css`:
- `.card-base` - Base card styling
- `.button-primary` - Primary button style
- `.button-secondary` - Secondary button style
- `.input-base` - Base input styling
- `.text-primary-accent` - Primary accent text
- `.text-secondary-accent` - Secondary accent text
- `.text-destructive-accent` - Destructive accent text

## CSS Custom Properties

All colors are available as CSS custom properties:
```css
var(--background)
var(--foreground)
var(--primary)
var(--destructive)
/* ... and all others defined in tailwind.config.js */
```

## Dark Mode

This theme is designed as a dark-first theme. Light mode can be added by extending the tailwind config with a light palette.
