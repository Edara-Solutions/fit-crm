import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { ordersService } from '../services/ordersService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Order } from '../types/order';
import { useUiStore } from './uiStore';

type OrdersState = {
  orders: Order[];
  selectedOrder: Order | null;
  pagination: Pagination;
  view: 'all' | 'assigned';
  loading: boolean;
  error: string | null;
  fetchOrders: (params?: ListQueryParams) => Promise<void>;
  fetchMyAssignedOrders: (params?: ListQueryParams) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  assignOrder: (id: string, assignedTo: string) => Promise<void>;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  pagination: DEFAULT_PAGINATION,
  view: 'all',
  loading: false,
  error: null,
  fetchOrders: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, view: 'all' });
    try {
      const { orders, pagination } = await ordersService.listOrders(params);
      set({ orders, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchMyAssignedOrders: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, view: 'assigned' });
    try {
      const { orders, pagination } = await ordersService.listMyAssignedOrders(params);
      set({ orders, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { order } = await ordersService.getOrder(id);
      set({ selectedOrder: order, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  updateOrderStatus: async (id, status) => {
    const { order } = await ordersService.updateOrderStatus(id, status);
    set({ orders: get().orders.map((item) => (getId(item) === id ? order : item)), selectedOrder: order });
    useUiStore.getState().showToast({ type: 'success', message: 'Order status updated.' });
  },
  assignOrder: async (id, assignedTo) => {
    const { order } = await ordersService.assignOrder(id, assignedTo);
    set({ orders: get().orders.map((item) => (getId(item) === id ? order : item)), selectedOrder: order });
    useUiStore.getState().showToast({ type: 'success', message: 'Order assigned.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
