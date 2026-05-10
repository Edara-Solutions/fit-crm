import type { Status } from './common';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: Status;
};
