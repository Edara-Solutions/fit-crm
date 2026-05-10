import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { paymentsService } from '../services/paymentsService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Payment } from '../types/payment';
import { useUiStore } from './uiStore';

type PaymentsState = {
  payments: Payment[];
  selectedPayment: Payment | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchPayments: (params?: ListQueryParams) => Promise<void>;
  fetchPaymentById: (id: string) => Promise<void>;
  approvePayment: (id: string) => Promise<void>;
  rejectPayment: (id: string, rejectionReason: string) => Promise<void>;
};

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  payments: [],
  selectedPayment: null,
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchPayments: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { payments, pagination } = await paymentsService.listPayments(params);
      set({ payments, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchPaymentById: async (id) => {
    const { payment } = await paymentsService.getPayment(id);
    set({ selectedPayment: payment });
  },
  approvePayment: async (id) => {
    const { payment } = await paymentsService.approvePayment(id);
    set({ payments: get().payments.map((item) => (getId(item) === id ? payment : item)), selectedPayment: payment });
    useUiStore.getState().showToast({ type: 'success', message: 'Payment approved.' });
  },
  rejectPayment: async (id, rejectionReason) => {
    const { payment } = await paymentsService.rejectPayment(id, rejectionReason);
    set({ payments: get().payments.map((item) => (getId(item) === id ? payment : item)), selectedPayment: payment });
    useUiStore.getState().showToast({ type: 'success', message: 'Payment rejected.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
