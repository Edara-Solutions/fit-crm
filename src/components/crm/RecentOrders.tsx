import { Link } from 'react-router-dom';
import type { Order } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { OrderStatusBadge } from './OrderStatusBadge';

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order' },
  { key: 'customerName', header: 'Customer' },
  { key: 'status', header: 'Status', render: (order) => <OrderStatusBadge status={order.status} /> },
  { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total) },
];

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
      <Table columns={columns} data={orders} getRowKey={(order) => order.id} actions={(order) => <Dropdown><Link to={`/orders/${order.id}`}><Button variant="ghost">View</Button></Link></Dropdown>} />
    </Card>
  );
}
