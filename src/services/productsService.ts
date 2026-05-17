import { apiClient } from '../lib/apiClient';
import { buildFormData } from '../lib/formData';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Product } from '../types/product';

export type ProductPayload = Partial<Product> & {
  images?: File[] | string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isStack?: boolean;
};

export const productsService = {
  listProducts: (params?: ListQueryParams) => apiClient.get<{ products: Product[]; pagination?: Pagination }>('/api/products/admin', params),
  getProduct: (id: string) => apiClient.get<{ product: Product }>(`/api/products/admin/${id}`),
  createProduct: (payload: ProductPayload) => hasImageFiles(payload) ? apiClient.post<{ product: Product }>('/api/products', buildFormData(payload), { isFormData: true }) : apiClient.post<{ product: Product }>('/api/products', payload),
  updateProduct: (id: string, payload: ProductPayload) => hasImageFiles(payload) ? apiClient.patch<{ product: Product }>(`/api/products/${id}`, buildFormData(payload), { isFormData: true }) : apiClient.patch<{ product: Product }>(`/api/products/${id}`, payload),
  updateProductStock: (id: string, stock: number) => apiClient.patch<{ product: Product }>(`/api/products/${id}/stock`, { stock }),
  deleteProduct: (id: string) => apiClient.delete<null>(`/api/products/${id}`),
};

function hasImageFiles(payload: ProductPayload) {
  return Array.isArray(payload.images) && payload.images.some((image) => isFile(image));
}

function isFile(value: unknown): value is File {
  return value instanceof File;
}
