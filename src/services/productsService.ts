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
  listProducts: (params?: ListQueryParams) => apiClient.get<{ products: Product[]; pagination?: Pagination }>('/api/products', params),
  getProduct: (id: string) => apiClient.get<{ product: Product }>(`/api/products/${id}`),
  createProduct: (payload: ProductPayload) => apiClient.post<{ product: Product }>('/api/products', buildFormData(payload), { isFormData: true }),
  updateProduct: (id: string, payload: ProductPayload) => apiClient.patch<{ product: Product }>(`/api/products/${id}`, buildFormData(payload), { isFormData: true }),
  updateProductStock: (id: string, stock: number) => apiClient.patch<{ product: Product }>(`/api/products/${id}/stock`, { stock }),
  deleteProduct: (id: string) => apiClient.delete<null>(`/api/products/${id}`),
};
