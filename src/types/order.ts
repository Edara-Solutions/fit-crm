import type { TimelineItem } from './common';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending_payment' | 'payment_submitted' | 'confirmed' | 'refunded' | 'payment_rejected';
export type PaymentStatus = 'paid' | 'partially_paid' | 'pending' | 'failed' | 'refunded' | 'awaiting_review' | 'rejected';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'bank_transfer';

export type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

export type Order = {
  _id?: string;
  id: string;
  orderNumber?: string;
  customerId?: string;
  customer?: unknown;
  customerName?: string;
  phone?: string;
  email?: string;
  date?: string;
  createdAt?: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  paid?: number;
  reminder?: number;
  total: number;
  status?: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  payment?: unknown;
  paymentMethod?: PaymentMethod | string;
  couponCode?: string;
  shippingAddress?: string | Record<string, unknown>;
  shippingDetails?: string | Record<string, unknown>;
  adminNotes?: string;
  timeline?: TimelineItem[];
  vendor?: unknown;
  assignedTo?: unknown;
  assignedBy?: unknown;
};
