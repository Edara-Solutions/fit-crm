import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'befox-authenticated';
const DEMO_ADMIN = {
  email: 'admin@admin.com',
  password: 'admin123',
};

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) === 'true');

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: (email, password) => {
        const isValid = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;

        if (isValid) {
          localStorage.setItem(AUTH_STORAGE_KEY, 'true');
          setIsAuthenticated(true);
        }

        return isValid;
      },
      logout: () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
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

