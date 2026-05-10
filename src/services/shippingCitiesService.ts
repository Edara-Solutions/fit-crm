import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { ShippingCity, ShippingCityPayload } from '../types/shippingCity';

export const shippingCitiesService = {
  listShippingCities: (params?: ListQueryParams) => apiClient.get<{ cities: ShippingCity[]; pagination: Pagination }>('/api/shipping-cities/admin', params),
  createShippingCity: (payload: ShippingCityPayload) => apiClient.post<{ city: ShippingCity }>('/api/shipping-cities', payload),
  updateShippingCity: (id: string, payload: Partial<ShippingCityPayload>) => apiClient.patch<{ city: ShippingCity }>(`/api/shipping-cities/${id}`, payload),
  deleteShippingCity: (id: string) => apiClient.delete<null>(`/api/shipping-cities/${id}`),
};
