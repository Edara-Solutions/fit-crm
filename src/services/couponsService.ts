import { apiClient } from '../lib/apiClient';
import type { ListQueryParams, Pagination } from '../types/api';
import type { Coupon } from '../types/coupon';

export type CouponPayload = Partial<Coupon> & {
  minOrderAmount?: number;
  maxDiscount?: number;
  startsAt?: string;
  expiresAt?: string;
  vendor?: string | null;
  applicableCategories?: string[];
  applicableProducts?: string[];
};

function normalizeCoupon(payload: CouponPayload) {
  return {
    ...payload,
    code: payload.code?.trim().toUpperCase(),
    vendor: payload.vendor || null,
  };
}

export const couponsService = {
  listCoupons: (params?: ListQueryParams) => apiClient.get<{ coupons: Coupon[]; pagination: Pagination }>('/api/coupons', params),
  listMyCoupons: (params?: ListQueryParams) => apiClient.get<{ coupons: Coupon[]; pagination: Pagination }>('/api/coupons/mine', params),
  getCoupon: (id: string) => apiClient.get<{ coupon: Coupon }>(`/api/coupons/${id}`),
  createCoupon: (payload: CouponPayload) => apiClient.post<{ coupon: Coupon }>('/api/coupons', normalizeCoupon(payload)),
  updateCoupon: (id: string, payload: CouponPayload) => apiClient.patch<{ coupon: Coupon }>(`/api/coupons/${id}`, normalizeCoupon(payload)),
  deleteCoupon: (id: string) => apiClient.delete<null>(`/api/coupons/${id}`),
};
