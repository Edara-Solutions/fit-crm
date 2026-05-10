export type CustomerStatus = 'active' | 'blocked' | 'vip';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses: string[];
  usedCoupons: string[];
  notes: string;
};
