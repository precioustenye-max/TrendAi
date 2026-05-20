import { Search, PanelLeft, Moon, Sun, ImagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';

export default function Navbar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearch();

  return (
    <nav
      className="w-full border-b"
      style={{
        borderColor: 'var(--sidebar-border)',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 md:px-7">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition"
          style={{ color: 'var(--icon-muted)' }}
          title="Toggle sidebar"
        >
          <PanelLeft className="h-[18px] w-[18px] stroke-[1.9]" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[840px]">
            <button
              type="button"
              onClick={openSearch}
              className="relative block h-11 w-full rounded-2xl border pl-11 pr-4 text-left text-sm transition sm:pr-16"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)',
                color: 'var(--input-foreground)',
              }}
            >
              <Search
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--muted-foreground)' }}
              />
              <span style={{ color: 'var(--muted-foreground)' }}>
                {isMobile ? 'Search asset...' : 'Search asset... e.g., BTC/USDT, EUR/USD, AAPL'}
              </span>
              <span
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded-md border px-2 py-1 text-[10px] sm:flex"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface-3)',
                  color: 'var(--muted-foreground)',
                }}
              >
               
              </span>
            </button>
          </div>
        </div>
        <Link
          to="/chat-analyzer"
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
            isMobile ? 'h-9 w-9 rounded-xl px-0' : ''
          }`}
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          title="Upload chart screenshot"
        >
          <ImagePlus className="h-4 w-4 shrink-0" />
          {!isMobile && <span>Upload screenshot</span>}
        </Link>
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-all duration-200"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)',
            color: 'var(--icon-muted)',
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-[17px] w-[17px] stroke-[1.9] transition-transform duration-200 ease-out" />
          ) : (
            <Moon className="h-[17px] w-[17px] stroke-[1.9] transition-transform duration-200 ease-out" />
          )}
        </button>
      </div>
    </nav>
  );
}
