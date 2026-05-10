import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { customersService } from '../services/customersService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Customer } from '../types/customer';
import { useUiStore } from './uiStore';

type CustomersState = {
  customers: Customer[];
  selectedCustomer: Customer | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchCustomers: (params?: ListQueryParams) => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  blockCustomer: (id: string) => Promise<void>;
  unblockCustomer: (id: string) => Promise<void>;
};

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchCustomers: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { customers, pagination } = await customersService.listCustomers(params);
      set({ customers, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchCustomerById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { customer } = await customersService.getCustomer(id);
      set({ selectedCustomer: customer, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  blockCustomer: async (id) => {
    const { customer } = await customersService.blockCustomer(id);
    set({ customers: get().customers.map((item) => (getId(item) === id ? customer : item)), selectedCustomer: customer });
    useUiStore.getState().showToast({ type: 'success', message: 'Customer blocked.' });
  },
  unblockCustomer: async (id) => {
    const { customer } = await customersService.unblockCustomer(id);
    set({ customers: get().customers.map((item) => (getId(item) === id ? customer : item)), selectedCustomer: customer });
    useUiStore.getState().showToast({ type: 'success', message: 'Customer unblocked.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
