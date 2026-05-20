import { Badge } from '../ui/Badge';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replaceAll('_', ' ');
  const positiveStatuses = ['active', 'paid', 'delivered', 'completed', 'vip'];
  const tone = positiveStatuses.includes(status) ? 'green' : status.includes('pending') || status.includes('processing') ? 'amber' : status === 'inactive' || status.includes('cancelled') || status.includes('failed') || status.includes('blocked') || status.includes('out') ? 'red' : 'gray';
  return <Badge tone={tone}>{normalized}</Badge>;
}
