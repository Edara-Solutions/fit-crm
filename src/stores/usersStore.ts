import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { usersService, type UserPayload } from '../services/usersService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { AuthUser } from '../types/auth';
import { useUiStore } from './uiStore';

type UsersState = {
  users: AuthUser[];
  selectedUser: AuthUser | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: ListQueryParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (payload: UserPayload) => Promise<void>;
  updateUser: (id: string, payload: Partial<UserPayload>) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  selectedUser: null,
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchUsers: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { users, pagination } = await usersService.listUsers(params);
      set({ users, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchUserById: async (id) => {
    const { user } = await usersService.getUser(id);
    set({ selectedUser: user });
  },
  createUser: async (payload) => {
    const { user } = await usersService.createUser(payload);
    set({ users: [user, ...get().users] });
    useUiStore.getState().showToast({ type: 'success', message: 'User created.' });
  },
  updateUser: async (id, payload) => {
    const { user } = await usersService.updateUser(id, payload);
    set({ users: get().users.map((item) => (getId(item) === id ? user : item)), selectedUser: user });
    useUiStore.getState().showToast({ type: 'success', message: 'User updated.' });
  },
  activateUser: async (id) => {
    const { user } = await usersService.activateUser(id);
    set({ users: get().users.map((item) => (getId(item) === id ? user : item)), selectedUser: getId(get().selectedUser ?? {}) === id ? user : get().selectedUser });
    useUiStore.getState().showToast({ type: 'success', message: 'User activated.' });
  },
  deactivateUser: async (id) => {
    const { user } = await usersService.deactivateUser(id);
    set({ users: get().users.map((item) => (getId(item) === id ? user : item)), selectedUser: getId(get().selectedUser ?? {}) === id ? user : get().selectedUser });
    useUiStore.getState().showToast({ type: 'success', message: 'User deactivated.' });
  },
  deleteUser: async (id) => {
    await usersService.deleteUser(id);
    set({ users: get().users.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'User deleted.' });
  },
}));

function getId(user: Pick<AuthUser, '_id' | 'id'>) {
  return user._id || user.id || '';
}
