import { create } from 'zustand';
import { getErrorMessage } from '../lib/apiError';
import { couponsService, type CouponPayload } from '../services/couponsService';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination } from '../types/api';
import type { Coupon } from '../types/coupon';
import { useUiStore } from './uiStore';

type CouponsState = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  pagination: Pagination;
  view: 'all' | 'mine';
  loading: boolean;
  error: string | null;
  fetchCoupons: (params?: ListQueryParams) => Promise<void>;
  fetchMyCoupons: (params?: ListQueryParams) => Promise<void>;
  fetchCouponById: (id: string) => Promise<void>;
  createCoupon: (payload: CouponPayload) => Promise<void>;
  updateCoupon: (id: string, payload: CouponPayload) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
};

export const useCouponsStore = create<CouponsState>((set, get) => ({
  coupons: [],
  selectedCoupon: null,
  pagination: DEFAULT_PAGINATION,
  view: 'all',
  loading: false,
  error: null,
  fetchCoupons: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, view: 'all' });
    try {
      const { coupons, pagination } = await couponsService.listCoupons(params);
      set({ coupons, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchMyCoupons: async (params = { page: 1, limit: 12 }) => {
    set({ loading: true, error: null, view: 'mine' });
    try {
      const { coupons, pagination } = await couponsService.listMyCoupons(params);
      set({ coupons, pagination, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  fetchCouponById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { coupon } = await couponsService.getCoupon(id);
      set({ selectedCoupon: coupon, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
  createCoupon: async (payload) => {
    const { coupon } = await couponsService.createCoupon(payload);
    set({ coupons: [coupon, ...get().coupons] });
    useUiStore.getState().showToast({ type: 'success', message: 'Coupon created.' });
  },
  updateCoupon: async (id, payload) => {
    const { coupon } = await couponsService.updateCoupon(id, payload);
    set({ coupons: get().coupons.map((item) => (getId(item) === id ? coupon : item)) });
    useUiStore.getState().showToast({ type: 'success', message: 'Coupon updated.' });
  },
  deleteCoupon: async (id) => {
    await couponsService.deleteCoupon(id);
    set({ coupons: get().coupons.filter((item) => getId(item) !== id) });
    useUiStore.getState().showToast({ type: 'success', message: 'Coupon deleted.' });
  },
}));

function getId(item: { _id?: string; id?: string }) {
  return item._id || item.id || '';
}
