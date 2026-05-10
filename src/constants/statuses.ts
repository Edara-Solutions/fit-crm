export const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const paymentStatuses = ['paid', 'pending', 'failed', 'refunded'] as const;
export const paymentMethods = ['cash', 'card', 'wallet', 'bank_transfer'] as const;
export const stockStatuses = ['in_stock', 'low_stock', 'out_of_stock'] as const;
