import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { roleLabels } from '../../constants/roles';
import { useAuthStore } from '../../stores/authStore';
import { SearchInput } from '../ui/SearchInput';
import { IconButton } from '../ui/IconButton';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-panel px-4 shadow-sm md:px-8">
      <div className="max-w-xl flex-1">
        <SearchInput placeholder="Search inventory, orders, or customers..." />
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="mr-2 hidden items-center gap-2 text-[10px] font-mono text-gray-500 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          LIVE_NODE: ACTIVE
        </div>
        <IconButton label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-panel bg-brand" />
        </IconButton>
        <div className="hidden text-right sm:block">
          <p className="text-xs font-bold uppercase tracking-tight text-white">{user?.name || 'Be-Fox System'}</p>
          <p className="font-mono text-[10px] text-gray-500">{user?.role ? roleLabels[user.role] : 'v1.4.0-PROD'}</p>
        </div>
        <IconButton label="Logout" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </IconButton>
        <IconButton label="Open menu" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </IconButton>
      </div>
    </header>
  );
}
