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
  listBrands: (params?: ListQueryParams) => apiClient.get<{ brands: Brand[]; pagination?: Pagination }>('/api/brands/admin', params),
  createBrand: async (payload: BrandPayload) => {
    if (!hasLogoFile(payload)) return apiClient.post<{ brand: Brand }>('/api/brands', payload);

    const { brand } = await apiClient.post<{ brand: Brand }>('/api/brands', buildFormData(getBrandFormDataPayload(payload)), { isFormData: true });
    const brandId = brand._id || brand.id;

    return payload.isActive === undefined || !brandId
      ? { brand }
      : apiClient.patch<{ brand: Brand }>(`/api/brands/${brandId}`, { isActive: payload.isActive });
  },
  updateBrand: async (id: string, payload: Partial<BrandPayload>) => {
    if (!hasLogoFile(payload)) return apiClient.patch<{ brand: Brand }>(`/api/brands/${id}`, payload);

    const { brand } = await apiClient.patch<{ brand: Brand }>(`/api/brands/${id}`, buildFormData(getBrandFormDataPayload(payload)), { isFormData: true });

    return payload.isActive === undefined
      ? { brand }
      : apiClient.patch<{ brand: Brand }>(`/api/brands/${id}`, { isActive: payload.isActive });
  },
  deleteBrand: (id: string) => apiClient.delete<null>(`/api/brands/${id}`),
};

function hasLogoFile(payload: Partial<BrandPayload>) {
  return payload.logo instanceof File;
}

function getBrandFormDataPayload(payload: Partial<BrandPayload>) {
  const { isActive, ...formDataPayload } = payload;
  return formDataPayload;
}
