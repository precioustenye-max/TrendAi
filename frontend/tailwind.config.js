/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background & Text
        background: "#0E1117",
        foreground: "#E6EAF0",
        card: "#14181F",
        popover: "#181D26",
        secondary: "#21262F",
        muted: "#1D2128",
        "muted-foreground": "#71798A",
        border: "#262B34",

        // Brand & Accents
        primary: "#21C55D",
        "primary-foreground": "#0E1117",
        accent: "#F59E0B",
        destructive: "#DC2626",

        // Chart Palette (grouped properly)
        chart: {
          green: "#21C55D",
          red: "#DC2626",
          blue: "#3B82F6",
          yellow: "#F59E0B",
          purple: "#A855F7",
        },

        // Sidebar (grouped)
        sidebar: {
          DEFAULT: "#0A0D12",
          foreground: "#B5BCC8",
          accent: "#181D26",
          border: "#1F242C",
        },
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      boxShadow: {
        "green-glow": "0 0 20px rgba(33, 197, 93, 0.15)",
        "red-glow": "0 0 20px rgba(220, 38, 38, 0.15)",
      },

      backgroundImage: {
        "bullish-gradient": "linear-gradient(135deg, #21C55D, #29A37F)",
        "bearish-gradient": "linear-gradient(135deg, #DC2626, #C7421F)",
        "card-gradient": "linear-gradient(135deg, #14181F, #181D26)",
      },

      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
}