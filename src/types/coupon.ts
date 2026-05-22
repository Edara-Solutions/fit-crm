import type { Status } from './common';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export type Coupon = {
  _id?: string;
  id: string;
  code: string;
  type: CouponType;
  value?: number;
  minimumOrderAmount?: number;
  minOrderAmount?: number;
  maximumDiscount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate?: string;
  endDate?: string;
  startsAt?: string;
  expiresAt?: string;
  status?: Status;
  isActive?: boolean;
  vendor?: string | null;
  applicableCategories?: string[];
  applicableProducts?: string[];
  applicableCustomers?: string[];
};
