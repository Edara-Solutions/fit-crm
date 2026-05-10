import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Order } from '../types/order';

export const ordersService = {
  listOrders: (params?: ListQueryParams) => apiClient.get<{ orders: Order[]; pagination: Pagination }>('/api/orders', params),
  listMyAssignedOrders: (params?: ListQueryParams) => apiClient.get<{ orders: Order[]; pagination: Pagination }>('/api/orders/assigned/me', params),
  getOrder: (id: string) => apiClient.get<{ order: Order }>(`/api/orders/${id}`),
  assignOrder: (id: string, assignedTo: string) => apiClient.patch<{ order: Order }>(`/api/orders/${id}/assign`, { assignedTo }),
  updateOrderStatus: (id: string, orderStatus: string) => apiClient.patch<{ order: Order }>(`/api/orders/${id}/status`, { orderStatus }),
};
