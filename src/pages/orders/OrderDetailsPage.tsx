import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Printer } from 'lucide-react';
import { OrderStatusBadge } from '../../components/crm/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/crm/PaymentStatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ORDER_STATUSES, ORDER_STATUS_SIDE_EFFECTS } from '../../constants/orderStatuses';
import { getErrorMessage } from '../../lib/apiError';
import { paymentsService } from '../../services/paymentsService';
import { useOrdersStore } from '../../stores/ordersStore';
import { useUiStore } from '../../stores/uiStore';
import type { OrderItem, OrderStatus, PaymentStatus } from '../../types/order';
import type { PaymentApprovalPayload } from '../../types/payment';
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
  const showToast = useUiStore((state) => state.showToast);
  const [nextStatus, setNextStatus] = useState<OrderStatus>('pending_payment');
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<PaymentApprovalPayload['paymentStatus']>('partially_paid');
  const [approvalAmount, setApprovalAmount] = useState('');
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);

  useEffect(() => {
    if (id) void fetchOrderById(id);
  }, [fetchOrderById, id]);

  useEffect(() => {
    if (order) setNextStatus(order.orderStatus || order.status || 'pending_payment');
  }, [order]);

  useEffect(() => {
    if (approvalOpen && order && approvalStatus === 'paid') {
      setApprovalAmount(String(getApprovalDefaultAmount(order)));
    }
  }, [approvalOpen, approvalStatus, order]);

  if (loading || !order) return <PageContainer><SectionHeader title="Order Details" eyebrow="Orders / Details" /><LoadingSkeleton /></PageContainer>;

  const customer = getCustomerInfo(order.customer);
  const vendor = getVendorInfo(order.vendor);
  const shippingDetails = getShippingDetails(order.shippingDetails ?? order.shippingAddress);
  const paymentId = getPaymentId(order.payment);
  const paymentProofImage = getPaymentProofImage(order.payment);
  const showApprovePayment = (order.orderStatus || order.status) === 'payment_submitted';

  async function handleStatusUpdate() {
    if (!id) return;
    const warning = ORDER_STATUS_SIDE_EFFECTS[nextStatus] ? `${ORDER_STATUS_SIDE_EFFECTS[nextStatus]} Continue?` : 'Update order status?';
    if (window.confirm(warning)) await updateOrderStatus(id, nextStatus);
  }

  function openApprovalModal() {
    setApprovalStatus('partially_paid');
    // setApprovalAmount(String(getApprovalDefaultAmount(order)));
    setApprovalAmount(0);
    setApprovalOpen(true);
  }

  function handleDownloadProofImage() {
    if (!paymentProofImage) return;

    const link = document.createElement('a');
    link.href = paymentProofImage;
    link.target = '_blank';
    link.download = `${order.orderNumber || order._id || order.id}-payment-proof`;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleApprovePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentId) {
      showToast({ type: 'error', message: 'Payment id is missing for this order.' });
      return;
    }

    const paidAmount = Number(approvalAmount);

    if (approvalStatus === 'partially_paid' && (!Number.isFinite(paidAmount) || paidAmount <= 0)) {
      showToast({ type: 'error', message: 'Enter a valid paid amount.' });
      return;
    }

    if (approvalStatus === 'partially_paid' && paidAmount >= order.total) {
      showToast({ type: 'error', message: 'Partial payment amount must be less than the order total.' });
      return;
    }

    setApprovalSubmitting(true);
    try {
      const payload: PaymentApprovalPayload = approvalStatus === 'partially_paid' ? { paymentStatus: approvalStatus, paidAmount } : { paymentStatus: approvalStatus };
      await paymentsService.approvePayment(paymentId, payload);
      if (id) await fetchOrderById(id);
      setApprovalOpen(false);
      showToast({ type: 'success', message: 'Payment approved.' });
    } catch (approveError) {
      showToast({ type: 'error', message: getErrorMessage(approveError, 'Could not approve payment.') });
    } finally {
      setApprovalSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <SectionHeader title={order.orderNumber || order._id || order.id} eyebrow="Orders / Details" action={<div className="flex flex-wrap items-center gap-2">{showApprovePayment && <Button onClick={openApprovalModal} icon={<CheckCircle2 className="h-4 w-4" />}>approvePayment</Button>}{paymentProofImage && <Button onClick={handleDownloadProofImage} icon={<ExternalLink className="h-4 w-4" />}>Show Invoice</Button>}</div>} />
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
              <div className="space-y-2">
                <p className="font-bold text-white">Customer : {customer.name}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
              </div>
              <div className="space-y-2 border-t border-border-subtle pt-3 text-xs text-gray-400">
                {shippingDetails.map((item) => (
                  <div key={item.label} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
                    <span className="font-mono uppercase tracking-wider text-gray-600">{item.label}</span>
                    <span className="break-words text-gray-300">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Payment & Status</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><OrderStatusBadge status={order.orderStatus || order.status || 'pending_payment'} /></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><PaymentStatusBadge status={(order.paymentStatus || getPaymentStatus(order.payment)) as PaymentStatus} /></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span>{String(order.paymentMethod || '-').replaceAll('_', ' ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Coupon</span><span>{order.couponCode ?? '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(order.subtotal ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatCurrency(order.shippingFee ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>{formatCurrency(order.discount ?? 0)}</span></div>
              <div className="flex justify-between border-t border-border-subtle pt-3 text-sm font-black text-white"><span>Total</span><span>{formatCurrency(order.total ?? 0)}</span></div>
              <div className="flex justify-between border-t border-border-subtle pt-3 text-sm font-black text-white"><span>Paid</span><span>{formatCurrency(order.paid ?? 0)}</span></div>
              <div className="flex justify-between border-t border-border-subtle pt-3 text-sm font-black text-white"><span>Reminder</span><span>{formatCurrency(order.reminder ?? 0)}</span></div>

              <Select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)}>{ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</Select>
              <Button className="w-full" onClick={() => void handleStatusUpdate()}>Update Status</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vendor Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-2">
                <p>Name: {vendor.name}</p>
                <p>Email: {vendor.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader><CardContent className="space-y-4">{(order.timeline ?? []).map((item) => <div key={item.date} className="border-l-2 border-brand pl-3"><p className="text-xs font-bold text-white">{item.label}</p><p className="text-[10px] text-gray-500">{formatDate(item.date)}</p><p className="mt-1 text-xs text-gray-400">{item.description}</p></div>)}</CardContent></Card>
        </div>
      </div>
      <Modal open={approvalOpen} title="Approve Payment" onClose={() => setApprovalOpen(false)}>
        <form className="space-y-4" onSubmit={(event) => void handleApprovePayment(event)}>
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Payment status</span>
            <Select value={approvalStatus} onChange={(event) => setApprovalStatus(event.target.value as PaymentApprovalPayload['paymentStatus'])}>
              <option value="paid">paid</option>
              <option value="partially_paid">partially_paid</option>
            </Select>
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Amount</span>
            <Input type="number" min="0" step="0.01" value={approvalAmount} onChange={(event) => setApprovalAmount(event.target.value)} />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setApprovalOpen(false)} disabled={approvalSubmitting}>Cancel</Button>
            <Button type="submit" disabled={approvalSubmitting || !paymentId}>{approvalSubmitting ? 'Approving...' : 'Approve Payment'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}

function getCustomerInfo(value: unknown) {
  const customer: Record<string, unknown> = isRecord(value) ? value : {};
  const firstName = getString(customer.firstName);
  const lastName = getString(customer.lastName);
  const fullName = getString(customer.fullName) || [firstName, lastName].filter(Boolean).join(' ');

  return {
    name: fullName || getString(customer.name) || 'Unknown Customer',
    email: getString(customer.email) || '-',
    phone: getString(customer.phone) || '-',
  };
}

function getVendorInfo(value: unknown) {
  const vendor: Record<string, unknown> = isRecord(value) ? value : {};

  return {
    name: getString(vendor.name) || '-',
    email: getString(vendor.email) || '-',
  };
}

function getShippingDetails(value: unknown) {
  if (typeof value === 'string') {
    return [{ label: 'Address', value }];
  }

  if (!isRecord(value)) {
    return [{ label: 'Address', value: '-' }];
  }

  const fullName = getString(value.fullName);
  const phone = getString(value.phone);
  const city = getString(value.city);
  const area = getString(value.area);
  const country = getString(value.country);
  const buildingNumber = getString(value.buildingNumber);
  const apartmentNumber = getString(value.apartmentNumber);
  const notes = getString(value.notes);

  return [
    fullName && { label: 'Ship To', value: fullName },
    phone && { label: 'Phone', value: phone },
    [city, area].filter(Boolean).join(', ') && { label: 'Location', value: [city, area].filter(Boolean).join(', ') },
    country && { label: 'Country', value: country },
    [buildingNumber && `Building ${buildingNumber}`, apartmentNumber && `Apt ${apartmentNumber}`].filter(Boolean).join(', ') && {
      label: 'Unit',
      value: [buildingNumber && `Building ${buildingNumber}`, apartmentNumber && `Apt ${apartmentNumber}`].filter(Boolean).join(', '),
    },
    notes && { label: 'Notes', value: notes },
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getApprovalDefaultAmount(order: { reminder?: number; total?: number }) {
  return order.reminder ?? order.total ?? 0;
}

function getPaymentId(value: unknown) {
  if (typeof value === 'string') return value;
  if (!isRecord(value)) return '';

  return getString(value._id) || getString(value.id);
}

function getPaymentProofImage(value: unknown) {
  if (!isRecord(value)) return '';

  return getString(value.proofImage);
}

function getPaymentStatus(value: unknown) {
  return typeof value === 'object' && value && 'status' in value ? String((value as { status?: string }).status ?? 'pending') : 'pending';
}
