import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Payment, PaymentApprovalPayload } from '../types/payment';

export const paymentsService = {
  listPayments: (params?: ListQueryParams) => apiClient.get<{ payments: Payment[]; pagination: Pagination }>('/api/payments', params),
  getPayment: (id: string) => apiClient.get<{ payment: Payment }>(`/api/payments/${id}`),
  approvePayment: (id: string, payload?: PaymentApprovalPayload) => apiClient.patch<{ payment: Payment }>(`/api/payments/${id}/approve`, payload),
  rejectPayment: (id: string, rejectionReason: string) => apiClient.patch<{ payment: Payment }>(`/api/payments/${id}/reject`, { rejectionReason }),
};
