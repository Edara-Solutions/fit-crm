import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, RotateCcw } from 'lucide-react';
import { OrderStatusBadge } from '../../components/crm/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/crm/PaymentStatusBadge';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { ORDER_STATUSES } from '../../constants/orderStatuses';
import { getErrorMessage } from '../../lib/apiError';
import { ordersService } from '../../services/ordersService';
import { useCustomersStore } from '../../stores/customersStore';
import { DEFAULT_PAGINATION, type ListQueryParams, type Pagination as PaginationState } from '../../types/api';
import type { CustomerAddress } from '../../types/customer';
import type { Order, PaymentStatus } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const orderColumns: TableColumn<Order>[] = [
  { key: 'orderNumber', header: 'Order', render: (order) => order.orderNumber || order._id || order.id },
  { key: 'date', header: 'Date', render: (order) => formatDate(order.date || order.createdAt || '') },
  { key: 'status', header: 'Status', render: (order) => <OrderStatusBadge status={order.orderStatus || order.status || 'pending_payment'} /> },
  { key: 'paymentStatus', header: 'Payment', render: (order) => <PaymentStatusBadge status={(order.paymentStatus || getPaymentStatus(order.payment)) as PaymentStatus} /> },
  { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total ?? 0) },
];

export function CustomerDetailsPage() {
  const { id } = useParams();
  const { selectedCustomer: customer, loading, error, fetchCustomerById, blockCustomer, unblockCustomer } = useCustomersStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPagination, setOrdersPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const lastCustomerFetchId = useRef('');
  const currentCustomerId = customer?._id || customer?.id || '';
  const customerSearch = customer ? getCustomerSearchName(customer) : '';
  const customerMatchesRoute = Boolean(customer && id && currentCustomerId === id);
  const dateRangeIsValid = !dateFrom || !dateTo || dateFrom <= dateTo;
  const hasOrderFilters = Boolean(statusFilter || paymentStatusFilter || paymentMethodFilter || dateFrom || dateTo);

  const getOrderQueryParams = useCallback((page = 1): ListQueryParams => ({
    page,
    limit: ordersPagination.limit,
    search: customerSearch || undefined,
    orderStatus: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined,
    paymentMethod: paymentMethodFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  }), [customerSearch, dateFrom, dateTo, ordersPagination.limit, paymentMethodFilter, paymentStatusFilter, statusFilter]);

  useEffect(() => {
    if (!id || lastCustomerFetchId.current === id) return;

    lastCustomerFetchId.current = id;
    void fetchCustomerById(id);
  }, [fetchCustomerById, id]);

  useEffect(() => {
    if (!customerMatchesRoute || !customerSearch || !dateRangeIsValid) return;

    const timeoutId = window.setTimeout(() => {
      void fetchCustomerOrders(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [customerMatchesRoute, customerSearch, dateRangeIsValid, getOrderQueryParams]);

  async function fetchCustomerOrders(page: number) {
    if (!customerSearch || !dateRangeIsValid) return;

    setOrdersLoading(true);
    setOrdersError('');
    try {
      const { orders: nextOrders, pagination } = await ordersService.listOrders(getOrderQueryParams(page));
      setOrders(nextOrders);
      setOrdersPagination(pagination ?? DEFAULT_PAGINATION);
    } catch (ordersFetchError) {
      setOrdersError(getErrorMessage(ordersFetchError, 'Could not load customer orders.'));
    } finally {
      setOrdersLoading(false);
    }
  }

  function clearOrderFilters() {
    setStatusFilter('');
    setPaymentStatusFilter('');
    setPaymentMethodFilter('');
    setDateFrom('');
    setDateTo('');
  }

  if (loading || !customer) {
    return <PageContainer><SectionHeader title="Customer Details" eyebrow="Customers / Profile" /><LoadingSkeleton /></PageContainer>;
  }

  return (
    <PageContainer>
      <SectionHeader title={customer.name} eyebrow="Customers / Profile" action={<Button variant={customer.isBlocked ? 'secondary' : 'danger'} onClick={() => id && (customer.isBlocked ? void unblockCustomer(id) : void blockCustomer(id))}>{customer.isBlocked ? 'Unblock' : 'Block'}</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Customer Orders</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 xl:grid-cols-3">
                <Select aria-label="Order status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="">All statuses</option>
                  {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </Select>
                <Select aria-label="Payment status" value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)}>
                  <option value="">All payment statuses</option>
                  <option value="paid">Paid</option>
                  <option value="partially_paid">Partially paid</option>
                  <option value="pending">Pending</option>
                  <option value="awaiting_review">Awaiting review</option>
                  <option value="failed">Failed</option>
                  <option value="rejected">Rejected</option>
                  <option value="refunded">Refunded</option>
                </Select>
                <Select aria-label="Payment method" value={paymentMethodFilter} onChange={(event) => setPaymentMethodFilter(event.target.value)}>
                  <option value="">All methods</option>
                  <option value="vodafone_cash">Vodafone Cash</option>
                  <option value="instapay">InstaPay</option>
                </Select>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                  <label className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">From</span>
                    <DatePickerField ariaLabel="Date from" value={dateFrom} max={dateTo || undefined} onChange={setDateFrom} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">To</span>
                    <DatePickerField ariaLabel="Date to" value={dateTo} min={dateFrom || undefined} onChange={setDateTo} />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {!dateRangeIsValid && <p className="text-xs text-brand">To date must be after From date.</p>}
                  <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} disabled={!hasOrderFilters} onClick={clearOrderFilters}>Reset</Button>
                </div>
              </div>
            </CardContent>
            {ordersError && <div className="mx-5 mb-4 border border-brand/40 bg-brand/10 p-3 text-sm text-red-100">{ordersError}<Button className="ml-3" variant="secondary" onClick={() => void fetchCustomerOrders(ordersPagination.page)}>Retry</Button></div>}
            {ordersLoading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={orderColumns} data={orders} getRowKey={(order) => order._id || order.id} actions={(order) => <Link to={`/orders/${order._id || order.id}`}><Button variant="secondary">Details</Button></Link>} emptyTitle="No orders found" />}
            <Pagination page={ordersPagination.page} totalPages={ordersPagination.pages || 1} onPageChange={(page) => void fetchCustomerOrders(page)} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-gray-300"><StatusBadge status={customer.isBlocked ? 'blocked' : customer.status || 'active'} /><p>{customer.email}</p><p>{customer.phone ?? '-'}</p><p className="text-2xl font-black text-white">{formatCurrency(customer.totalSpent ?? 0)}</p><p className="text-[10px] uppercase text-gray-500">Total spending / {customer.totalOrders ?? 0} orders</p><p className="text-2xl font-black text-white">{formatCurrency(customer.totalShippingFee ?? 0)}</p><p className="text-[10px] uppercase text-gray-500">Total ShippingFees / {customer.totalOrders ?? 0} orders</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Addresses</CardTitle></CardHeader><CardContent className="space-y-2">{(customer.addresses ?? []).map((address, index) => <div key={getAddressKey(address, index)} className="rounded bg-white/5 p-3 text-xs text-gray-300">{renderAddress(address)}</div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Used Coupons</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{(customer.usedCoupons ?? []).map((coupon) => <span key={coupon} className="rounded bg-brand/10 px-2 py-1 font-mono text-xs text-[#E9514B]">{coupon}</span>)}</CardContent></Card>
        </div>
      </div>
    </PageContainer>
  );
}

function getAddressKey(address: string | CustomerAddress, index: number) {
  if (typeof address === 'string') return `${address}-${index}`;
  return address._id || address.id || `${formatAddress(address)}-${index}`;
}

function renderAddress(address: string | CustomerAddress) {
  if (typeof address === 'string') return <p>{address}</p>;

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        {address.fullName && <p className="font-bold text-white">{address.fullName}</p>}
        {address.isDefault && <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#E9514B]">Default</span>}
      </div>
      <p>{formatAddress(address) || '-'}</p>
      {address.phone && <p className="text-gray-500">{address.phone}</p>}
      {address.notes && <p className="text-gray-500">{address.notes}</p>}
    </div>
  );
}

function formatAddress(address: CustomerAddress) {
  return [
    address.city,
    address.area,
    address.street,
    address.buildingNumber ? `Building ${address.buildingNumber}` : '',
    address.apartmentNumber ? `Apartment ${address.apartmentNumber}` : '',
  ].filter(Boolean).join(', ');
}

function getCustomerSearchName(customer: { fullName?: string; name?: string; firstName?: string; lastName?: string }) {
  return customer.fullName || customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ');
}

function getPaymentStatus(value: unknown) {
  return typeof value === 'object' && value && 'status' in value ? String((value as { status?: string }).status ?? 'pending') : 'pending';
}

function DatePickerField({ ariaLabel, value, min, max, onChange }: { ariaLabel: string; value: string; min?: string; max?: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;

    if ('showPicker' in input) {
      input.showPicker();
      return;
    }

    input.focus();
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        className="pr-10"
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        aria-label={`Open ${ariaLabel.toLowerCase()} picker`}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
        type="button"
        onClick={openPicker}
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  );
}
