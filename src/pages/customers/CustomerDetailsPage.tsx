import { useParams } from 'react-router-dom';
import { RecentOrders } from '../../components/crm/RecentOrders';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { mockCustomers } from '../../data/mockCustomers';
import { mockOrders } from '../../data/mockOrders';
import { formatCurrency } from '../../utils/formatCurrency';

export function CustomerDetailsPage() {
  const { id } = useParams();
  const customer = mockCustomers.find((item) => item.id === id) ?? mockCustomers[0];
  const orders = mockOrders.filter((order) => order.customerId === customer.id);

  return (
    <PageContainer>
      <SectionHeader title={customer.name} eyebrow="Customers / Profile" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecentOrders orders={orders.length ? orders : mockOrders.slice(0, 2)} />
          <Card><CardHeader><CardTitle>Support Notes</CardTitle></CardHeader><CardContent><Textarea defaultValue={customer.notes} /></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-gray-300"><StatusBadge status={customer.status} /><p>{customer.email}</p><p>{customer.phone}</p><p className="text-2xl font-black text-white">{formatCurrency(customer.totalSpent)}</p><p className="text-[10px] uppercase text-gray-500">Total spending / {customer.totalOrders} orders</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Addresses</CardTitle></CardHeader><CardContent className="space-y-2">{customer.addresses.map((address) => <p key={address} className="rounded bg-white/5 p-3 text-xs text-gray-300">{address}</p>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Used Coupons</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{customer.usedCoupons.map((coupon) => <span key={coupon} className="rounded bg-brand/10 px-2 py-1 font-mono text-xs text-[#E9514B]">{coupon}</span>)}</CardContent></Card>
        </div>
      </div>
    </PageContainer>
  );
}
