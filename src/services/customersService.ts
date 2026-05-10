import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Customer } from '../types/customer';

export const customersService = {
  listCustomers: (params?: ListQueryParams) => apiClient.get<{ customers: Customer[]; pagination: Pagination }>('/api/customers/admin', params),
  getCustomer: (id: string) => apiClient.get<{ customer: Customer }>(`/api/customers/admin/${id}`),
  blockCustomer: (id: string) => apiClient.patch<{ customer: Customer }>(`/api/customers/admin/${id}/block`),
  unblockCustomer: (id: string) => apiClient.patch<{ customer: Customer }>(`/api/customers/admin/${id}/unblock`),
};
