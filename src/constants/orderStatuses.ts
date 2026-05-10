export const ORDER_STATUSES = [
  'pending_payment',
  'payment_submitted',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'payment_rejected',
] as const;

export const ORDER_STATUS_SIDE_EFFECTS: Record<string, string> = {
  confirmed: 'This deducts stock once and marks the payment as paid.',
  cancelled: 'This restores stock if it was previously deducted.',
  refunded: 'This restores stock and marks the payment as refunded.',
  delivered: 'This sets the delivered date.',
};
