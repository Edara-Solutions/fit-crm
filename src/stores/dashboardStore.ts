import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { dashboardService } from '../services/dashboardService';
import type { BestSellingProduct, DashboardOverview, RevenuePeriod, RevenuePoint } from '../types/dashboard';

type DashboardState = {
  overview: DashboardOverview | null;
  revenue: RevenuePoint[];
  bestSellingProducts: BestSellingProduct[];
  period: RevenuePeriod;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  setPeriod: (period: RevenuePeriod) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  overview: null,
  revenue: [],
  bestSellingProducts: [],
  period: 'year',
  loading: false,
  error: null,
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const [overview, revenue, bestSelling] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getRevenue(get().period),
        dashboardService.getBestSellingProducts(5),
      ]);
      set({
        overview: overview.overview,
        revenue: revenue.revenue,
        bestSellingProducts: bestSelling.products,
        loading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  setPeriod: async (period) => {
    set({ period, loading: true, error: null });
    try {
      const { revenue } = await dashboardService.getRevenue(period);
      set({ revenue, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
}));
