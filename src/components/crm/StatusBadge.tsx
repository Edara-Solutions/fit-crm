import { Badge } from '../ui/Badge';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replaceAll('_', ' ');
  const tone = status.includes('active') || status === 'paid' || status === 'delivered' || status === 'completed' || status === 'vip' ? 'green' : status.includes('pending') || status.includes('processing') ? 'amber' : status.includes('cancelled') || status.includes('failed') || status.includes('blocked') || status.includes('out') ? 'red' : 'gray';
  return <Badge tone={tone}>{normalized}</Badge>;
}
