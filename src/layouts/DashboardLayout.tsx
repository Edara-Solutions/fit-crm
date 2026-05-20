import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Drawer } from '../components/ui/Drawer';
import { cn } from '../utils/cn';

export function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-[#F5F5F5]">
      {isMobileOpen && <button aria-label="Close menu" className="fixed inset-0 z-[60] bg-black/60 lg:hidden" onClick={() => setIsMobileOpen(false)} type="button" />}
      <Drawer open={isMobileOpen}>
        <Sidebar isCollapsed={false} setIsCollapsed={setIsCollapsed} onNavigate={() => setIsMobileOpen(false)} />
      </Drawer>
      <div className={cn('fixed left-0 top-0 z-50 hidden h-screen lg:block', isCollapsed ? 'w-20' : 'w-64')}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className={cn('flex min-h-screen flex-col transition-all duration-300', isCollapsed ? 'lg:ml-20' : 'lg:ml-64')}>
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-x-hidden bg-bg-deep p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="flex h-10 items-center justify-between border-t border-border-subtle bg-bg-deep px-4 font-mono text-[10px] tracking-wider text-gray-600 md:px-8">
          <span>NETWORK: STABLE</span>
          <span>FIT_OS v1.4.0</span>
        </footer>
      </div>
    </div>
  );
}
