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
  listCategories: (params?: ListQueryParams) => apiClient.get<{ categories: Category[]; pagination?: Pagination }>('/api/categories', params),
  createCategory: (payload: CategoryPayload) => apiClient.post<{ category: Category }>('/api/categories', buildFormData(payload), { isFormData: true }),
  updateCategory: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.patch<{ category: Category }>(`/api/categories/${id}`, buildFormData(payload), { isFormData: true }),
  deleteCategory: (id: string) => apiClient.delete<null>(`/api/categories/${id}`),
};
