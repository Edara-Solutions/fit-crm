import type { PaymentStatus } from '../../types/order';
import { StatusBadge } from './StatusBadge';

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge status={status} />;
}
