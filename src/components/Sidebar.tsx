import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Tags, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Boxes, 
  CreditCard, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Users / Staff', href: '/users', icon: Users },
  { title: 'Customers', href: '/customers', icon: UserCircle },
  { title: 'Categories', href: '/categories', icon: Tags },
  { title: 'Products', href: '/products', icon: Package },
  { title: 'Orders', href: '/orders', icon: ShoppingCart },
  { title: 'Coupons', href: '/coupons', icon: Ticket },
  { title: 'Inventory', href: '/inventory', icon: Boxes },
  { title: 'Payments', href: '/payments', icon: CreditCard },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen overflow-visible transition-all duration-300 z-50",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <aside className="bg-panel text-[#F5F5F5] flex h-full w-full flex-col overflow-y-auto overflow-x-hidden border-r border-border-subtle">
        <div className={cn(
          "p-6 flex items-center min-h-[80px]",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="w-10 h-10 bg-brand flex items-center justify-center rounded-sm font-black text-xl italic text-white flex-shrink-0">
            F
          </div>
          {!isCollapsed && (
            <span className="min-w-0 text-xl font-black tracking-tighter italic text-white underline decoration-brand decoration-4 underline-offset-4 whitespace-nowrap">
              BE-FOX
            </span>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.title : undefined}
              className={({ isActive }) => cn(
                "flex w-full items-center gap-3 py-2 rounded-md transition-colors",
                isCollapsed ? "justify-center px-0" : "px-4",
                isActive 
                  ? "bg-brand text-white shadow-lg shadow-brand/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "opacity-100" : "opacity-60")} />
                  {!isCollapsed && <span className="min-w-0 text-sm font-medium whitespace-nowrap">{item.title}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle bg-bg-deep/50 overflow-hidden">
          <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center px-0" : "px-2")}>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-border-subtle flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              AU
            </div>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-xs font-semibold truncate">Admin User</p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="cursor-pointer absolute right-0 top-10 translate-x-1/2 w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white border border-border-subtle hover:bg-brand/90 transition-colors shadow-lg z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
