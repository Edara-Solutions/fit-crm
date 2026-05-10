import { apiClient } from '../lib/apiClient';
import { buildFormData } from '../lib/formData';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Brand } from '../types/brand';

export type BrandPayload = {
  name: string;
  description?: string;
  logo?: string | File;
  isActive?: boolean;
};

export const brandsService = {
  listBrands: (params?: ListQueryParams) => apiClient.get<{ brands: Brand[]; pagination?: Pagination }>('/api/brands', params),
  createBrand: (payload: BrandPayload) => apiClient.post<{ brand: Brand }>('/api/brands', buildFormData(payload), { isFormData: true }),
  updateBrand: (id: string, payload: Partial<BrandPayload>) => apiClient.patch<{ brand: Brand }>(`/api/brands/${id}`, buildFormData(payload), { isFormData: true }),
  deleteBrand: (id: string) => apiClient.delete<null>(`/api/brands/${id}`),
};
