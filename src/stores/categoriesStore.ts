import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { categoriesService, type CategoryPayload } from '../services/categoriesService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Category } from '../types/category';
import { useUiStore } from './uiStore';

type CategoriesState = {
  categories: Category[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchCategories: (params?: ListQueryParams) => Promise<void>;
  createCategory: (payload: CategoryPayload) => Promise<void>;
  updateCategory: (id: string, payload: Partial<CategoryPayload>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchCategories: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { categories, pagination } = await categoriesService.listCategories(params);
      set({ categories, pagination: pagination ?? DEFAULT_PAGINATION, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  createCategory: async (payload) => {
    const { category } = await categoriesService.createCategory(payload);
    set({ categories: [category, ...get().categories] });
    useUiStore.getState().showToast({ type: 'success', message: 'Category created.' });
  },
  updateCategory: async (id, payload) => {
    const { category } = await categoriesService.updateCategory(id, payload);
    set({ categories: get().categories.map((item) => (getId(item) === id ? category : item)) });
    useUiStore.getState().showToast({ type: 'success', message: 'Category updated.' });
  },
  deleteCategory: async (id) => {
    await categoriesService.deleteCategory(id);
    set({ categories: get().categories.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'Category deleted.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
