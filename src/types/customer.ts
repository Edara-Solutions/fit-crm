export type CustomerStatus = 'active' | 'blocked' | 'vip';

export type CustomerAddress = {
  _id?: string;
  id?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  area?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  notes?: string;
  isDefault?: boolean;
};

export type Customer = {
  _id?: string;
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: CustomerStatus;
  isBlocked?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  addresses?: Array<string | CustomerAddress>;
  usedCoupons?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};
