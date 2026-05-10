import type { Coupon } from '../types/coupon';

export const mockCoupons: Coupon[] = [
  { id: 'cpn-1', code: 'BULK15', type: 'percentage', value: 15, minimumOrderAmount: 3000, maximumDiscount: 900, usageLimit: 200, usedCount: 84, startDate: '2026-04-01', endDate: '2026-06-30', status: 'active' },
  { id: 'cpn-2', code: 'FOXSHIP', type: 'free_shipping', value: 0, minimumOrderAmount: 1500, usageLimit: 500, usedCount: 121, startDate: '2026-05-01', endDate: '2026-05-31', status: 'active' },
  { id: 'cpn-3', code: 'WELCOME10', type: 'fixed', value: 100, minimumOrderAmount: 700, maximumDiscount: 100, usageLimit: 1000, usedCount: 442, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active' },
];
