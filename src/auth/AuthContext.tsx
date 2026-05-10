import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { AUTH_EVENT } from '../lib/apiClient';
import { useAuthStore } from '../stores/authStore';

type AuthContextValue = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping, login, logout, bootstrap } = useAuthStore();

  useEffect(() => {
    void bootstrap();
    window.addEventListener(AUTH_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EVENT, handleExpired);

    function handleExpired() {
      logout('Session expired. Please log in again.');
    }
  }, [bootstrap, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isBootstrapping,
      login: (email, password) => login({ email, password }),
      logout,
    }),
    [isAuthenticated, isBootstrapping, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
