import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Textarea } from '../../components/ui/Textarea';
import { useCustomersStore } from '../../stores/customersStore';
import type { CustomerAddress } from '../../types/customer';
import { formatCurrency } from '../../utils/formatCurrency';

export function CustomerDetailsPage() {
  const { id } = useParams();
  const { selectedCustomer: customer, loading, error, fetchCustomerById, blockCustomer, unblockCustomer } = useCustomersStore();

  useEffect(() => {
    if (id) void fetchCustomerById(id);
  }, [fetchCustomerById, id]);

  if (loading || !customer) {
    return <PageContainer><SectionHeader title="Customer Details" eyebrow="Customers / Profile" /><LoadingSkeleton /></PageContainer>;
  }

  return (
    <PageContainer>
      <SectionHeader title={customer.name} eyebrow="Customers / Profile" action={<Button variant={customer.isBlocked ? 'secondary' : 'danger'} onClick={() => id && (customer.isBlocked ? void unblockCustomer(id) : void blockCustomer(id))}>{customer.isBlocked ? 'Unblock' : 'Block'}</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Support Notes</CardTitle></CardHeader><CardContent><Textarea defaultValue={customer.notes ?? ''} /></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-gray-300"><StatusBadge status={customer.isBlocked ? 'blocked' : customer.status || 'active'} /><p>{customer.email}</p><p>{customer.phone ?? '-'}</p><p className="text-2xl font-black text-white">{formatCurrency(customer.totalSpent ?? 0)}</p><p className="text-[10px] uppercase text-gray-500">Total spending / {customer.totalOrders ?? 0} orders</p></CardContent></Card>
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
