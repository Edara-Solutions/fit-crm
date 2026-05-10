import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { productsService, type ProductPayload } from '../services/productsService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Product } from '../types/product';
import { useUiStore } from './uiStore';

type ProductsState = {
  products: Product[];
  selectedProduct: Product | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchProducts: (params?: ListQueryParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (payload: ProductPayload) => Promise<Product>;
  updateProduct: (id: string, payload: ProductPayload) => Promise<Product>;
  updateProductStock: (id: string, stock: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  selectedProduct: null,
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
  fetchProducts: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null });
    try {
      const { products, pagination } = await productsService.listProducts(params);
      set({ products, pagination: pagination ?? DEFAULT_PAGINATION, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { product } = await productsService.getProduct(id);
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  createProduct: async (payload) => {
    const { product } = await productsService.createProduct(payload);
    set({ products: [product, ...get().products] });
    useUiStore.getState().showToast({ type: 'success', message: 'Product created.' });
    return product;
  },
  updateProduct: async (id, payload) => {
    const { product } = await productsService.updateProduct(id, payload);
    set({ products: get().products.map((item) => (getId(item) === id ? product : item)), selectedProduct: product });
    useUiStore.getState().showToast({ type: 'success', message: 'Product updated.' });
    return product;
  },
  updateProductStock: async (id, stock) => {
    const { product } = await productsService.updateProductStock(id, stock);
    set({ products: get().products.map((item) => (getId(item) === id ? product : item)) });
    useUiStore.getState().showToast({ type: 'success', message: 'Stock updated.' });
  },
  deleteProduct: async (id) => {
    await productsService.deleteProduct(id);
    set({ products: get().products.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'Product deleted.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
