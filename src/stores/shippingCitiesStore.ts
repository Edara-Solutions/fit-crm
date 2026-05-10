import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { shippingCitiesService } from '../services/shippingCitiesService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { ShippingCity, ShippingCityPayload } from '../types/shippingCity';
import { useUiStore } from './uiStore';

type ShippingCitiesState = {
  cities: ShippingCity[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchShippingCities: (params?: ListQueryParams) => Promise<void>;
  createShippingCity: (payload: ShippingCityPayload) => Promise<void>;
  updateShippingCity: (id: string, payload: Partial<ShippingCityPayload>) => Promise<void>;
  deleteShippingCity: (id: string) => Promise<void>;
};

export const useShippingCitiesStore = create<ShippingCitiesState>((set, get) => ({
  cities: [],
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchShippingCities: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { cities, pagination } = await shippingCitiesService.listShippingCities(params);
      set({ cities, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  createShippingCity: async (payload) => {
    const { city } = await shippingCitiesService.createShippingCity(payload);
    set({ cities: [city, ...get().cities] });
    useUiStore.getState().showToast({ type: 'success', message: 'Shipping city created.' });
  },
  updateShippingCity: async (id, payload) => {
    const { city } = await shippingCitiesService.updateShippingCity(id, payload);
    set({ cities: get().cities.map((item) => (getId(item) === id ? city : item)) });
    useUiStore.getState().showToast({ type: 'success', message: 'Shipping city updated.' });
  },
  deleteShippingCity: async (id) => {
    await shippingCitiesService.deleteShippingCity(id);
    set({ cities: get().cities.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'Shipping city deleted.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
