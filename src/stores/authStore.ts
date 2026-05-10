import { create } from 'zustand';
import { AUTH_TOKEN_KEY } from '../lib/apiClient';
import { getErrorMessage } from '../lib/apiError';
import { authService } from '../services/authService';
import type { AuthUser, ChangePasswordPayload, LoginPayload } from '../types/auth';
import { useUiStore } from './uiStore';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: (message?: string) => void;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(AUTH_TOKEN_KEY),
  user: null,
  isAuthenticated: Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  isBootstrapping: true,
  loading: false,
  error: null,
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authService.login(payload);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      set({ token, user, isAuthenticated: true, loading: false });
      useUiStore.getState().showToast({ type: 'success', message: 'Logged in successfully.' });
    } catch (error) {
      const message = getErrorMessage(error, 'Invalid email or password.');
      set({ error: message, loading: false, isAuthenticated: false, token: null, user: null });
      useUiStore.getState().showToast({ type: 'error', message });
      throw error;
    }
  },
  bootstrap: async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      set({ token: null, user: null, isAuthenticated: false, isBootstrapping: false });
      return;
    }

    try {
      const { user } = await authService.getMe();
      set({ token, user, isAuthenticated: true, isBootstrapping: false });
    } catch {
      get().logout();
      set({ isBootstrapping: false });
    }
  },
  logout: (message = 'Logged out.') => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false, loading: false, error: null });
    useUiStore.getState().showToast({ type: 'info', message });
  },
  changePassword: async (payload) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(payload);
      set({ loading: false });
      useUiStore.getState().showToast({ type: 'success', message: 'Password changed successfully.' });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, loading: false });
      useUiStore.getState().showToast({ type: 'error', message });
      throw error;
    }
  },
}));
