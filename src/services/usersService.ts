import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { AuthUser, InternalRole } from '../types/auth';

export type UserPayload = {
  name: string;
  email: string;
  password?: string;
  role: InternalRole;
};

export const usersService = {
  listUsers: (params?: ListQueryParams) => apiClient.get<{ users: AuthUser[]; pagination: Pagination }>('/api/users', params),
  getUser: (id: string) => apiClient.get<{ user: AuthUser }>(`/api/users/${id}`),
  createUser: (payload: UserPayload) => apiClient.post<{ user: AuthUser }>('/api/users', payload),
  updateUser: (id: string, payload: Partial<UserPayload>) => apiClient.patch<{ user: AuthUser }>(`/api/users/${id}`, payload),
  activateUser: (id: string) => apiClient.patch<{ user: AuthUser }>(`/api/users/${id}/activate`),
  deactivateUser: (id: string) => apiClient.patch<{ user: AuthUser }>(`/api/users/${id}/deactivate`),
  deleteUser: (id: string) => apiClient.delete<null>(`/api/users/${id}`),
};
