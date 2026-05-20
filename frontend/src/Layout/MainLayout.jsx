import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import { SearchProvider } from '../context/SearchContext';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

function LayoutContent() {
  const { isDesktopOpen, isMobile } = useSidebar();
  const location = useLocation();

  return (
    <div
      className="flex min-h-screen overflow-x-clip"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {!isMobile && (
        <div
          className={`${
            isDesktopOpen ? 'w-64' : 'w-20'
          } shrink-0 transition-[width] duration-300 ease-in-out`}
        />
      )}
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="mx-auto w-full max-w-[1420px]">
          <Navbar />
        </div>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[840px] px-4 py-5 sm:px-5 md:px-7 md:py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <SearchModal />
    </div>
  );
}

export default function MainLayout() {
  return (
    <SearchProvider>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </SearchProvider>
  );
}
