import type { Coupon } from '../../types/coupon';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<Coupon>[] = [
  { key: 'code', header: 'Code', render: (coupon) => <span className="font-mono font-bold text-white">{coupon.code}</span> },
  { key: 'type', header: 'Type', render: (coupon) => coupon.type.replaceAll('_', ' ') },
  { key: 'value', header: 'Value', render: (coupon) => coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'free_shipping' ? 'Free shipping' : formatCurrency(coupon.value) },
  { key: 'minimumOrderAmount', header: 'Min Order', render: (coupon) => formatCurrency(coupon.minimumOrderAmount) },
  { key: 'maximumDiscount', header: 'Max Discount', render: (coupon) => coupon.maximumDiscount ? formatCurrency(coupon.maximumDiscount) : '-' },
  { key: 'usageLimit', header: 'Limit' },
  { key: 'usedCount', header: 'Used' },
  { key: 'endDate', header: 'Ends', render: (coupon) => formatDate(coupon.endDate) },
  { key: 'status', header: 'Status', render: (coupon) => <StatusBadge status={coupon.status} /> },
];

export function CouponTable({ coupons }: { coupons: Coupon[] }) {
  return <Table columns={columns} data={coupons} getRowKey={(coupon) => coupon.id} actions={() => <Dropdown />} />;
}
