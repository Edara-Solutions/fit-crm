import type { TimelineItem } from './common';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'bank_transfer';

export type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  shippingAddress: string;
  adminNotes: string;
  timeline: TimelineItem[];
};
