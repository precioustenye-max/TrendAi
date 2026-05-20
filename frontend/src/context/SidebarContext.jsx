import { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext();
const MOBILE_BREAKPOINT = 1024;

export function SidebarProvider({ children }) {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(nextIsMobile);

      if (!nextIsMobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !isMobileOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMobileOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
      return;
    }

    setIsDesktopOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsMobileOpen(false);
  const openSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(true);
    } else {
      setIsDesktopOpen(true);
    }
  };

  const isOpen = isMobile ? isMobileOpen : isDesktopOpen;

  return (
    <SidebarContext.Provider
      value={{
        closeSidebar,
        isDesktopOpen,
        isMobile,
        isMobileOpen,
        isOpen,
        openSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
