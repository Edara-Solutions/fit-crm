import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { InternalRole } from '../types/auth';
import { useAuthStore } from '../stores/authStore';

export function RoleProtectedRoute({ roles, children }: { roles: readonly InternalRole[]; children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return (
      <div className="rounded border border-border-subtle bg-panel p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand">Access denied</p>
        <h1 className="mt-2 text-2xl font-black uppercase italic text-white">You do not have permission to view this page.</h1>
      </div>
    );
  }

  return children;
}

