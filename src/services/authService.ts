import { apiClient } from '../lib/apiClient';
import type { AuthUser, ChangePasswordPayload, LoginPayload, LoginResult } from '../types/auth';

export const authService = {
  login: (payload: LoginPayload) => apiClient.post<LoginResult>('/api/users/auth/login', payload),
  getMe: () => apiClient.get<{ user: AuthUser }>('/api/users/me'),
  changePassword: (payload: ChangePasswordPayload) => apiClient.patch<null>('/api/users/me/password', payload),
};
