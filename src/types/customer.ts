export type CustomerStatus = 'active' | 'blocked' | 'vip';

export type Customer = {
  _id?: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: CustomerStatus;
  isBlocked?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  addresses?: string[];
  usedCoupons?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};
