export type DashboardOverview = {
  totalRevenue: number;
  todaysOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  productsInStock: number;
  lowStockAlerts: number;
  activeCoupons: number;
  monthlyRevenue: number;
  totalShippingFee: number;
  awaitingReviewOrders: number;
  monthlyShippingFee: number;
};

export type RevenuePeriod = 'year' | 'month' | 'week';

export type RevenuePoint = {
  name: string;
  revenue: number;
};

export type BestSellingProduct = {
  name: string;
  sold: number;
  revenue: number;
};
