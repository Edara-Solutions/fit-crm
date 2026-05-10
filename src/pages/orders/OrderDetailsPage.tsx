import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { OrderStatusBadge } from '../../components/crm/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/crm/PaymentStatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ORDER_STATUSES, ORDER_STATUS_SIDE_EFFECTS } from '../../constants/orderStatuses';
import { useOrdersStore } from '../../stores/ordersStore';
import type { OrderItem, OrderStatus, PaymentStatus } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const itemColumns: TableColumn<OrderItem>[] = [
  { key: 'name', header: 'Product', render: (item) => <div><p className="font-bold text-white">{item.name}</p><p className="font-mono text-[10px] text-gray-500">{item.sku}</p></div> },
  { key: 'quantity', header: 'Qty' },
  { key: 'price', header: 'Price', render: (item) => formatCurrency(item.price) },
];

export function OrderDetailsPage() {
  const { id } = useParams();
  const { selectedOrder: order, loading, error, fetchOrderById, updateOrderStatus } = useOrdersStore();
  const [nextStatus, setNextStatus] = useState<OrderStatus>('pending_payment');

  useEffect(() => {
    if (id) void fetchOrderById(id);
  }, [fetchOrderById, id]);

  useEffect(() => {
    if (order) setNextStatus(order.orderStatus || order.status || 'pending_payment');
  }, [order]);

  if (loading || !order) return <PageContainer><SectionHeader title="Order Details" eyebrow="Orders / Details" /><LoadingSkeleton /></PageContainer>;

  async function handleStatusUpdate() {
    if (!id) return;
    const warning = ORDER_STATUS_SIDE_EFFECTS[nextStatus] ? `${ORDER_STATUS_SIDE_EFFECTS[nextStatus]} Continue?` : 'Update order status?';
    if (window.confirm(warning)) await updateOrderStatus(id, nextStatus);
  }

  return (
    <PageContainer>
      <SectionHeader title={order.orderNumber || order._id || order.id} eyebrow="Orders / Details" action={<Button icon={<Printer className="h-4 w-4" />}>Print Invoice</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Ordered Products</CardTitle></CardHeader><Table columns={itemColumns} data={order.items} getRowKey={(item) => item.productId} /></Card>
          <Card><CardHeader><CardTitle>Admin Notes</CardTitle></CardHeader><CardContent><Textarea defaultValue={order.adminNotes ?? ''} /></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <p className="font-bold text-white">{order.customerName || getNestedName(order.customer)}</p>
              <p>{order.email}</p><p>{order.phone}</p>
              <p className="border-t border-border-subtle pt-3 text-gray-400">{typeof order.shippingAddress === 'string' ? order.shippingAddress : JSON.stringify(order.shippingAddress ?? {})}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Payment & Status</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><OrderStatusBadge status={order.orderStatus || order.status || 'pending_payment'} /></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><PaymentStatusBadge status={(order.paymentStatus || getPaymentStatus(order.payment)) as PaymentStatus} /></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span>{String(order.paymentMethod || '-').replaceAll('_', ' ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Coupon</span><span>{order.couponCode ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatCurrency(order.shippingFee ?? 0)}</span></div>
              <div className="flex justify-between border-t border-border-subtle pt-3 text-sm font-black text-white"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
              <Select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)}>{ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</Select>
              <Button className="w-full" onClick={() => void handleStatusUpdate()}>Update Status</Button>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader><CardContent className="space-y-4">{(order.timeline ?? []).map((item) => <div key={item.date} className="border-l-2 border-brand pl-3"><p className="text-xs font-bold text-white">{item.label}</p><p className="text-[10px] text-gray-500">{formatDate(item.date)}</p><p className="mt-1 text-xs text-gray-400">{item.description}</p></div>)}</CardContent></Card>
        </div>
      </div>
    </PageContainer>
  );
}

function getNestedName(value: unknown) {
  return typeof value === 'object' && value && 'name' in value ? String((value as { name?: string }).name ?? '-') : '-';
}

function getPaymentStatus(value: unknown) {
  return typeof value === 'object' && value && 'status' in value ? String((value as { status?: string }).status ?? 'pending') : 'pending';
}
