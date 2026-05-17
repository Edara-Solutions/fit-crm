import { apiClient } from '../lib/apiClient';
import { buildFormData } from '../lib/formData';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Category } from '../types/category';

export type CategoryPayload = {
  name: string;
  description?: string;
  image?: string | File;
  isActive?: boolean;
};

export const categoriesService = {
  listCategories: (params?: ListQueryParams) => apiClient.get<{ categories: Category[]; pagination?: Pagination }>('/api/categories/admin', params),
  createCategory: async (payload: CategoryPayload) => {
    if (!hasImageFile(payload)) return apiClient.post<{ category: Category }>('/api/categories', payload);

    const { category } = await apiClient.post<{ category: Category }>('/api/categories', buildFormData(getCategoryFormDataPayload(payload)), { isFormData: true });
    const categoryId = category._id || category.id;

    return payload.isActive === undefined || !categoryId
      ? { category }
      : apiClient.patch<{ category: Category }>(`/api/categories/${categoryId}`, { isActive: payload.isActive });
  },
  updateCategory: async (id: string, payload: Partial<CategoryPayload>) => {
    if (!hasImageFile(payload)) return apiClient.patch<{ category: Category }>(`/api/categories/${id}`, payload);

    const { category } = await apiClient.patch<{ category: Category }>(`/api/categories/${id}`, buildFormData(getCategoryFormDataPayload(payload)), { isFormData: true });

    return payload.isActive === undefined
      ? { category }
      : apiClient.patch<{ category: Category }>(`/api/categories/${id}`, { isActive: payload.isActive });
  },
  deleteCategory: (id: string) => apiClient.delete<null>(`/api/categories/${id}`),
};

function hasImageFile(payload: Partial<CategoryPayload>) {
  return payload.image instanceof File;
}

function getCategoryFormDataPayload(payload: Partial<CategoryPayload>) {
  const { isActive, ...formDataPayload } = payload;
  return formDataPayload;
}
