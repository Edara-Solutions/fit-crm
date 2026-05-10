import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg-deep flex font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <Navbar />
        <main className="p-8 flex-1 overflow-x-hidden overflow-y-auto bg-bg-deep">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Status Bar */}
        <footer className="h-10 bg-bg-deep border-t border-border-subtle px-8 flex items-center justify-between text-[10px] text-gray-600 font-mono tracking-wider">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> 
              NETWORK: STABLE
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> 
              SYNC_PROGRESS: 100%
            </div>
            <div className="hidden md:flex items-center gap-2 italic">
              LATENCY: 42ms
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-50">BE-FOX_OS v1.4.0</span>
            <div className="h-3 w-[1px] bg-border-subtle"></div>
            <span className="text-gray-500">AUTH: ADMIN_ROOT</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
