import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, RotateCcw } from 'lucide-react';
import { OrderStatusBadge } from '../../components/crm/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/crm/PaymentStatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { Table, type TableColumn } from '../../components/ui/Table';
import { ORDER_STATUSES } from '../../constants/orderStatuses';
import { useOrdersStore } from '../../stores/ordersStore';
import type { ListQueryParams } from '../../types/api';
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
  const { orders, pagination, loading, error, view, fetchOrders, fetchMyAssignedOrders } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const dateRangeIsValid = !dateFrom || !dateTo || dateFrom <= dateTo;
  const hasFilters = Boolean(search.trim() || statusFilter || paymentStatusFilter || paymentMethodFilter || dateFrom || dateTo);

  const getQueryParams = useCallback((page = 1): ListQueryParams => ({
    page,
    limit: pagination.limit,
    search: search.trim() || undefined,
    orderStatus: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined,
    paymentMethod: paymentMethodFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  }), [dateFrom, dateTo, pagination.limit, paymentMethodFilter, paymentStatusFilter, search, statusFilter]);

  const fetchCurrentView = useCallback((params: ListQueryParams) => {
    return view === 'assigned' ? fetchMyAssignedOrders(params) : fetchOrders(params);
  }, [fetchMyAssignedOrders, fetchOrders, view]);

  useEffect(() => {
    if (!dateRangeIsValid) return;

    const timeoutId = window.setTimeout(() => {
      void fetchCurrentView(getQueryParams(1));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [dateRangeIsValid, fetchCurrentView, getQueryParams]);

  function clearFilters() {
    setSearch('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setPaymentMethodFilter('');
    setDateFrom('');
    setDateTo('');
  }

  return (
    <PageContainer>
      <SectionHeader title="Orders" action={<Button variant={view === 'assigned' ? 'primary' : 'secondary'} onClick={() => view === 'assigned' ? void fetchOrders(getQueryParams(1)) : void fetchMyAssignedOrders(getQueryParams(1))} icon={<Plus className="h-4 w-4" />}>{view === 'assigned' ? 'All Orders' : 'My Assigned Orders'}</Button>} />
      <div className="space-y-3 rounded border border-border-subtle bg-panel p-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(260px,1.4fr)_repeat(3,minmax(150px,1fr))]">
          <SearchInput placeholder="Search by order, customer, phone..." value={search} onChange={(event) => setSearch(event.target.value)} />
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
            <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} disabled={!hasFilters} onClick={clearFilters}>Reset</Button>
          </div>
        </div>
      </div>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchCurrentView(getQueryParams(pagination.page))}>Retry</Button></div>}
      <Card>
        {loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={orders} getRowKey={(order) => order._id || order.id} actions={(order) => <Dropdown><div className="flex flex-col gap-1"><Link to={`/orders/${order._id || order.id}`}><Button variant="primary" className="cursor-pointer">Details</Button></Link></div></Dropdown>} />}
        <Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCurrentView(getQueryParams(page))} />
      </Card>
    </PageContainer>
  );
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

function getNestedName(value: unknown) {
  return typeof value === 'object' && value && 'name' in value ? String((value as { name?: string }).name ?? '-') : '-';
}

function getCustomerName(customer: unknown, fallback?: string) {
  if (typeof customer === 'object' && customer) {
    if ('fullName' in customer && customer.fullName) return String(customer.fullName);
    if ('firstName' in customer || 'lastName' in customer) return [getStringProperty(customer, 'firstName'), getStringProperty(customer, 'lastName')].filter(Boolean).join(' ') || fallback || '-';
    return getNestedName(customer);
  }

  return fallback ?? '-';
}

function getStringProperty(value: object, key: string) {
  return key in value ? String((value as Record<string, unknown>)[key] ?? '') : '';
}

function getPaymentStatus(value: unknown) {
  return typeof value === 'object' && value && 'status' in value ? String((value as { status?: string }).status ?? 'pending') : 'pending';
}
