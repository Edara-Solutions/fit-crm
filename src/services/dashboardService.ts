import { apiClient } from '../lib/apiClient';
import type { BestSellingProduct, DashboardOverview, RevenuePeriod, RevenuePoint } from '../types/dashboard';

export const dashboardService = {
  getOverview: () => apiClient.get<{ overview: DashboardOverview }>('/api/dashboard/overview'),
  getRevenue: (period: RevenuePeriod) => apiClient.get<{ revenue: RevenuePoint[] }>('/api/dashboard/revenue', { period }),
  getBestSellingProducts: (limit = 5) => apiClient.get<{ products: BestSellingProduct[] }>('/api/dashboard/best-selling-products', { limit }),
};
