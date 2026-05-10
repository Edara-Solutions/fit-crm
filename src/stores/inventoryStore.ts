import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { inventoryService } from '../services/inventoryService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { InventoryItem } from '../types/inventory';
import { useUiStore } from './uiStore';

type InventoryTab = 'low-stock' | 'out-of-stock' | 'near-expiry';

type InventoryState = {
  lowStock: InventoryItem[];
  outOfStock: InventoryItem[];
  nearExpiry: InventoryItem[];
  pagination: Pagination;
  activeTab: InventoryTab;
  threshold: number;
  days: number;
  loading: boolean;
  error: string | null;
  fetchLowStock: (params?: ListQueryParams) => Promise<void>;
  fetchOutOfStock: (params?: ListQueryParams) => Promise<void>;
  fetchNearExpiry: (params?: ListQueryParams) => Promise<void>;
  adjustStock: (productId: string, payload: { quantity: number; reason: string }) => Promise<void>;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  lowStock: [],
  outOfStock: [],
  nearExpiry: [],
  pagination: DEFAULT_PAGINATION,
  activeTab: 'low-stock',
  threshold: 5,
  days: 60,
  loading: false,
  error: null,
  fetchLowStock: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, activeTab: 'low-stock' });
    try {
      const { products, pagination } = await inventoryService.getLowStock({ threshold: get().threshold, ...params });
      set({ lowStock: products, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchOutOfStock: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, activeTab: 'out-of-stock' });
    try {
      const { products, pagination } = await inventoryService.getOutOfStock(params);
      set({ outOfStock: products, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchNearExpiry: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, activeTab: 'near-expiry' });
    try {
      const { products, pagination } = await inventoryService.getNearExpiry({ days: get().days, ...params });
      set({ nearExpiry: products, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  adjustStock: async (productId, payload) => {
    await inventoryService.adjustStock(productId, payload);
    useUiStore.getState().showToast({ type: 'success', message: 'Stock adjusted.' });
    if (get().activeTab === 'low-stock') await get().fetchLowStock();
    if (get().activeTab === 'out-of-stock') await get().fetchOutOfStock();
    if (get().activeTab === 'near-expiry') await get().fetchNearExpiry();
  },
}));
