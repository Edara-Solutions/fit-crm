export type BackendPaymentStatus = 'pending' | 'awaiting_review' | 'paid' | 'rejected' | 'failed' | 'refunded';

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
