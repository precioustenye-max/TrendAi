import { Search, X, Clock3, Bitcoin, DollarSign, BriefcaseBusiness } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const groupedAssets = [
  {
    label: 'Recent',
    items: [
      { value: 'SOL/USDT', icon: Clock3, accent: '#f59e0b' },
      { value: 'BTC/USDT', icon: Clock3, accent: 'var(--muted-foreground)' },
    ],
  },
  {
    label: 'Crypto',
    items: [
      { value: 'BTC/USDT', icon: Bitcoin },
      { value: 'ETH/USDT', icon: Bitcoin },
      { value: 'SOL/USDT', icon: Bitcoin },
      { value: 'BNB/USDT', icon: Bitcoin },
    ],
  },
  {
    label: 'Forex',
    items: [
      { value: 'EUR/USD', icon: DollarSign },
      { value: 'GBP/USD', icon: DollarSign },
      { value: 'USD/JPY', icon: DollarSign },
    ],
  },
  {
    label: 'Stocks',
    items: [{ value: 'AAPL', icon: BriefcaseBusiness }],
  },
];

export default function SearchModal() {
  const { isSearchOpen, query, setQuery, closeSearch } = useSearch();

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = !normalizedQuery
    ? groupedAssets
    : groupedAssets
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.value.toLowerCase().includes(normalizedQuery)),
        }))
        .filter((group) => group.items.length > 0);

  if (!isSearchOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-3 pt-16 backdrop-blur-[2px] sm:px-4 sm:pt-28"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-[500px] overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative border-b px-4"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <Search
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search asset... e.g., BTC/USDT, EUR/USD, AAPL"
            className="h-12 w-full bg-transparent pl-9 pr-10 text-sm outline-none"
            style={{ color: 'var(--input-foreground)' }}
          />
          <button
            type="button"
            onClick={closeSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="max-h-[70vh] overflow-y-auto py-2 sm:max-h-[548px]"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {filteredGroups.length === 0 ? (
            <div className="px-4 py-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              No assets found.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.label} className="pb-2">
                <div className="px-4 py-2 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  {group.label}
                </div>
                <div className="space-y-1 px-2">
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    const isHighlighted = group.label === 'Recent' && index === 0 && !query.trim();

                    return (
                      <button
                        key={`${group.label}-${item.value}-${index}`}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition"
                        style={{
                          backgroundColor: isHighlighted ? '#f59e0b' : 'transparent',
                          color: isHighlighted ? '#101010' : 'var(--foreground)',
                        }}
                      >
                        <Icon
                          className="h-4 w-4 shrink-0"
                          style={{
                            color: isHighlighted ? '#101010' : item.accent || 'var(--muted-foreground)',
                          }}
                        />
                        <span className="text-sm font-semibold">{item.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
