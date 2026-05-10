import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { InventoryItem } from '../types/inventory';
import type { Product } from '../types/product';

export const inventoryService = {
  getLowStock: (params?: ListQueryParams) => apiClient.get<{ products: InventoryItem[]; pagination: Pagination }>('/api/inventory/low-stock', params),
  getOutOfStock: (params?: ListQueryParams) => apiClient.get<{ products: InventoryItem[]; pagination: Pagination }>('/api/inventory/out-of-stock', params),
  getNearExpiry: (params?: ListQueryParams) => apiClient.get<{ products: InventoryItem[]; pagination: Pagination }>('/api/inventory/near-expiry', params),
  adjustStock: (productId: string, payload: { quantity: number; reason: string }) =>
    apiClient.patch<{ product: Product; reason: string }>(`/api/inventory/products/${productId}/adjust`, payload),
};
