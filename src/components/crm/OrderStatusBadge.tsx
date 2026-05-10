import type { OrderStatus } from '../../types/order';
import { StatusBadge } from './StatusBadge';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge status={status} />;
}
