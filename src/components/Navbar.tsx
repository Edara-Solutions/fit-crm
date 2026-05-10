import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 border-b border-border-subtle bg-panel sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search inventory, orders, or customers..." 
            className="w-full bg-bg-deep border border-border-subtle rounded text-gray-300 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mr-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE_NODE: ACTIVE
        </div>
        <button className="p-2 text-gray-400 hover:bg-white/5 rounded transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand rounded-full border border-panel"></span>
        </button>
        <div className="h-8 w-px bg-border-subtle mx-1"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white tracking-tight uppercase">Be-Fox System</p>
            <p className="text-[10px] text-gray-500 font-mono">v1.4.0-PROD</p>
          </div>
          <button className="w-8 h-8 rounded bg-bg-deep border border-border-subtle flex items-center justify-center lg:hidden">
            <Menu className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
