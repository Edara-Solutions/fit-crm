import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { FilterBar } from '../../components/crm/FilterBar';
import { OrderStatusBadge } from '../../components/crm/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/crm/PaymentStatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { mockOrders } from '../../data/mockOrders';
import type { Order } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order' },
  { key: 'customerName', header: 'Customer' },
  { key: 'date', header: 'Date', render: (order) => formatDate(order.date) },
  { key: 'status', header: 'Status', render: (order) => <OrderStatusBadge status={order.status} /> },
  { key: 'paymentStatus', header: 'Payment', render: (order) => <PaymentStatusBadge status={order.paymentStatus} /> },
  { key: 'paymentMethod', header: 'Method', render: (order) => order.paymentMethod.replaceAll('_', ' ') },
  { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total) },
];

export function OrdersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Orders" action={<Button icon={<Plus className="h-4 w-4" />}>Create Order</Button>} />
      <FilterBar placeholder="Search orders by id, customer, phone...">
        <Select><option>Status</option><option>Pending</option><option>Processing</option><option>Delivered</option></Select>
        <Select><option>Payment Status</option><option>Paid</option><option>Pending</option><option>Failed</option></Select>
        <Select><option>Payment Method</option><option>Cash</option><option>Card</option><option>Wallet</option></Select>
        <Select><option>Date Range</option><option>Today</option><option>This week</option><option>This month</option></Select>
      </FilterBar>
      <Card>
        <Table columns={columns} data={mockOrders} getRowKey={(order) => order.id} actions={(order) => <Dropdown><Link to={`/orders/${order.id}`}><Button variant="ghost">Details</Button></Link></Dropdown>} />
        <Pagination />
      </Card>
    </PageContainer>
  );
}
