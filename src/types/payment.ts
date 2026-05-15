export type BackendPaymentStatus = 'pending' | 'awaiting_review' | 'paid' | 'partially_paid' | 'rejected' | 'failed' | 'refunded';

export type PaymentApprovalPayload = {
  paymentStatus: 'paid' | 'partially_paid';
  paidAmount?: number;
};

export type Payment = {
  _id?: string;
  id?: string;
  order?: unknown;
  customer?: unknown;
  status?: BackendPaymentStatus;
  amount?: number;
  method?: string;
  proofImage?: string;
  rejectionReason?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};
