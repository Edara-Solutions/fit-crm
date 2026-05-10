import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { brandsService, type BrandPayload } from '../services/brandsService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Brand } from '../types/brand';
import { useUiStore } from './uiStore';

type BrandsState = {
  brands: Brand[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchBrands: (params?: ListQueryParams) => Promise<void>;
  createBrand: (payload: BrandPayload) => Promise<void>;
  updateBrand: (id: string, payload: Partial<BrandPayload>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
};

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: [],
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchBrands: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { brands, pagination } = await brandsService.listBrands(params);
      set({ brands, pagination: pagination ?? DEFAULT_PAGINATION, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  createBrand: async (payload) => {
    const { brand } = await brandsService.createBrand(payload);
    set({ brands: [brand, ...get().brands] });
    useUiStore.getState().showToast({ type: 'success', message: 'Brand created.' });
  },
  updateBrand: async (id, payload) => {
    const { brand } = await brandsService.updateBrand(id, payload);
    set({ brands: get().brands.map((item) => (getId(item) === id ? brand : item)) });
    useUiStore.getState().showToast({ type: 'success', message: 'Brand updated.' });
  },
  deleteBrand: async (id) => {
    await brandsService.deleteBrand(id);
    set({ brands: get().brands.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'Brand deleted.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
