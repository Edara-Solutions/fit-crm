import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navigationItems } from '../../constants/navigation';
import { routePermissions } from '../../constants/permissions';
import { roleLabels } from '../../constants/roles';
import { useAuthStore } from '../../stores/authStore';
import type { InternalRole } from '../../types/auth';
import { cn } from '../../utils/cn';

import foxImage from '../../assets/images/logo.png';

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNavigate?: () => void;
};

export function Sidebar({ isCollapsed, setIsCollapsed, onNavigate }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const visibleItems = navigationItems.filter((item) => user && (routePermissions[item.permission] as readonly InternalRole[]).includes(user.role));
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AU';

  return (
    <div className={cn('h-full overflow-visible transition-all duration-300', isCollapsed ? 'w-20' : 'w-64')}>
      <aside className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden border-r border-border-subtle bg-panel text-[#F5F5F5]">
        <div className={cn('flex min-h-20 items-center p-6', isCollapsed ? 'justify-center' : 'gap-3')}>
          {isCollapsed ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brand text-xl font-black italic text-white text-xs text-center">
              FIT
            </div>
          ) : (
            <span className="min-w-0 whitespace-nowrap text-xl font-black italic tracking-tighter text-white underline decoration-brand decoration-4 underline-offset-4">
              <img src={foxImage} alt="FIT" className="w-50 h-30 object-contain" />
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.title : undefined}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex w-full items-center gap-3 rounded-md py-2 transition-colors',
                  isCollapsed ? 'justify-center px-0' : 'px-4',
                  isActive ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'opacity-100' : 'opacity-60')} />
                  {!isCollapsed && <span className="min-w-0 whitespace-nowrap text-sm font-medium">{item.title}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="overflow-hidden border-t border-border-subtle bg-bg-deep/50 p-4">
          <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center px-0' : 'px-2')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-slate-800 text-[10px] font-bold">{initials}</div>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-xs font-semibold">{user?.name || 'Admin User'}</p>
                <p className="truncate text-[10px] uppercase tracking-tighter text-gray-500">{user?.role ? roleLabels[user.role] : 'Administrator'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 top-10 z-10 hidden h-7 w-7 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-brand text-white shadow-lg transition-colors hover:bg-[#E9514B] lg:flex"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );
}
