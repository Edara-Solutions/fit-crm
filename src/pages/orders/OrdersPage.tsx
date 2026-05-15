import { useEffect, useMemo, useState } from 'react';
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
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { ORDER_STATUSES } from '../../constants/orderStatuses';
import { useOrdersStore } from '../../stores/ordersStore';
import type { Order, PaymentStatus } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', render: (order) => order.orderNumber || order._id || order.id },
  { key: 'customerName', header: 'Customer', render: (order) => getCustomerName(order.customer, order.customerName) },
  { key: 'date', header: 'Date', render: (order) => formatDate(order.date || order.createdAt || '') },
  { key: 'status', header: 'Status', render: (order) => <OrderStatusBadge status={order.orderStatus || order.status || 'pending_payment'} /> },
  { key: 'paymentStatus', header: 'Payment', render: (order) => <PaymentStatusBadge status={(order.paymentStatus || getPaymentStatus(order.payment)) as PaymentStatus} /> },
  { key: 'paymentMethod', header: 'Method', render: (order) => String(order.paymentMethod || '-').replaceAll('_', ' ') },
  { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total) },
];

export function OrdersPage() {
  const { orders, pagination, loading, error, view, fetchOrders, fetchMyAssignedOrders, updateOrderStatus } = useOrdersStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // TODO: Replace local filtering with backend search params when order search is documented.
  const visibleOrders = useMemo(() => orders.filter((order) => `${order.orderNumber ?? ''} ${order._id ?? order.id} ${order.customerName ?? ''}`.toLowerCase().includes(search.toLowerCase())), [orders, search]);

  return (
    <PageContainer>
      <SectionHeader title="Orders" action={<Button variant={view === 'assigned' ? 'primary' : 'secondary'} onClick={() => view === 'assigned' ? void fetchOrders() : void fetchMyAssignedOrders()} icon={<Plus className="h-4 w-4" />}>{view === 'assigned' ? 'All Orders' : 'My Assigned Orders'}</Button>} />
      <FilterBar placeholder="Search orders by id, customer, phone..." value={search} onChange={(event) => setSearch(event.target.value)}>
        <Select><option>Status</option>{ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}</Select>
        <Select><option>Payment Status</option><option>Paid</option><option>Pending</option><option>Failed</option></Select>
        <Select><option>Payment Method</option><option>Cash</option><option>Card</option><option>Wallet</option></Select>
        <Select><option>Date Range</option><option>Today</option><option>This week</option><option>This month</option></Select>
      </FilterBar>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchOrders()}>Retry</Button></div>}
      <Card>
        {loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={visibleOrders} getRowKey={(order) => order._id || order.id} actions={(order) => <Dropdown><div className="flex flex-col gap-1"><Link to={`/orders/${order._id || order.id}`}><Button variant="primary" className="cursor-pointer">Details</Button></Link></div></Dropdown>} />}
        <Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => view === 'assigned' ? void fetchMyAssignedOrders({ page, limit: pagination.limit }) : void fetchOrders({ page, limit: pagination.limit })} />
      </Card>
    </PageContainer>
  );
}

function getNestedName(value: unknown) {
  return typeof value === 'object' && value && 'name' in value ? String((value as { name?: string }).name ?? '-') : '-';
}

function getCustomerName(customer: unknown, fallback?: string) {
  if (typeof customer === 'object' && customer) {
    if ('fullName' in customer && customer.fullName) return String(customer.fullName);
    return getNestedName(customer);
  }

  return fallback ?? '-';
}

function getPaymentStatus(value: unknown) {
  return typeof value === 'object' && value && 'status' in value ? String((value as { status?: string }).status ?? 'pending') : 'pending';
}
