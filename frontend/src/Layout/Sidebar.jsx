import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Sparkles,
  CandlestickChart,
  Calculator,
  History,
  Settings,
  X,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const { closeSidebar, isMobile, isOpen } = useSidebar();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Ai Analysis', path: '/ai-analysis', icon: Sparkles },
    { label: 'Screenshot AI', path: '/chat-analyzer', icon: CandlestickChart },
    { label: 'FX Calculator', path: '/fx-calculator', icon: Calculator },
    { label: 'History', path: '/history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[1px] lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col overflow-hidden border-r transition-[width,transform] duration-300 ease-in-out ${
          isMobile
            ? `w-[min(84vw,18rem)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isOpen
              ? 'w-64 translate-x-0'
              : 'w-20 translate-x-0'
        }`}
        style={{
          borderColor: 'var(--sidebar-border)',
          backgroundColor: 'var(--sidebar-background)',
          color: 'var(--sidebar-foreground)',
        }}
      >
        <div className=" px-4 py-4" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div
            className={`flex items-center transition-all duration-300 ${
              isOpen ? 'justify-between gap-3' : 'justify-center'
            }`}
          >
            <div className={`flex min-w-0 items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--logo-foreground)' }}
              >
                <BarChart3 className="h-4 w-4 stroke-[2.4]" />
              </div>
              <span
                className={`overflow-hidden whitespace-nowrap text-base font-extrabold uppercase tracking-[-0.03em] transition-all duration-200 ${
                  isOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'
                }`}
                style={{ color: 'var(--foreground)' }}
              >
                TrendAi
              </span>
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={closeSidebar}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                style={{ color: 'var(--icon-muted)' }}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 py-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    title={item.label}
                    onClick={() => {
                      if (isMobile) {
                        closeSidebar();
                      }
                    }}
                    className={() =>
                      `flex rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 ${
                        isOpen ? 'items-center justify-start gap-3' : 'items-center justify-center'
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
                      color: isActive ? 'var(--foreground)' : 'var(--sidebar-foreground)',
                    })}
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0 stroke-[1.9]"
                      style={{ color: 'var(--icon-muted)' }}
                    />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                        isOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t px-4 py-5" style={{ borderColor: 'var(--sidebar-border)' }}>
          <p
            className={`overflow-hidden text-xs leading-5 transition-all duration-200 ${
              isOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ color: 'var(--sidebar-muted)' }}
          >
            AI insights are educational. Not financial advice.
          </p>
        </div>
      </aside>
    </>
  );
}
