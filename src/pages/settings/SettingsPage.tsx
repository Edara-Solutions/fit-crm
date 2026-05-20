import { FormEvent, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { useAuthStore } from '../../stores/authStore';
import { useShippingCitiesStore } from '../../stores/shippingCitiesStore';
import type { ShippingCity } from '../../types/shippingCity';

function SettingCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">{children}</CardContent></Card>;
}

export function SettingsPage() {
  const { user, changePassword, loading } = useAuthStore();
  const { cities, pagination, fetchShippingCities, createShippingCity } = useShippingCitiesStore();
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [city, setCity] = useState({ name: '', shippingFee: '' });

  useEffect(() => {
    void fetchShippingCities();
  }, [fetchShippingCities]);

  async function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await changePassword(password);
    setPassword({ currentPassword: '', newPassword: '' });
  }

  async function handleCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createShippingCity({ name: city.name, shippingFee: Number(city.shippingFee), isActive: true });
    setCity({ name: '', shippingFee: '' });
  }

  return (
    <PageContainer>
      <SectionHeader title="Settings" action={<Button icon={<Save className="h-4 w-4" />}>Save Settings</Button>} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingCard title="Store Information"><Input defaultValue="FIT Supplements" /><Input defaultValue="+20 100 000 0000" /><Textarea defaultValue="Premium gym supplements store." /></SettingCard>
        <SettingCard title="Payment Methods"><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Cash on delivery</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Card payments</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" className="accent-[#A3141C]" /> Wallets</label></SettingCard>
        <SettingCard title="Shipping Cities"><form className="grid gap-3 md:grid-cols-[1fr_120px_auto]" onSubmit={handleCity}><Input required placeholder="City" value={city.name} onChange={(event) => setCity({ ...city, name: event.target.value })} /><Input required placeholder="Fee" type="number" value={city.shippingFee} onChange={(event) => setCity({ ...city, shippingFee: event.target.value })} /><Button type="submit">Add</Button></form><Table columns={cityColumns} data={cities} getRowKey={(item) => item._id || item.id || item.name} /><Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchShippingCities({ page, limit: pagination.limit })} /></SettingCard>
        <SettingCard title="Order Status Settings"><Select><option>pending</option><option>processing</option><option>shipped</option><option>delivered</option></Select><Textarea defaultValue="Default order workflow notifications." /></SettingCard>
        <SettingCard title="Notification Settings"><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Low stock alerts</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> New order alerts</label></SettingCard>
        <SettingCard title="Admin Account & System"><Input value={user?.email ?? ''} readOnly /><Input value={user?.name ?? ''} readOnly /><Select><option>{user?.role ?? 'internal user'}</option></Select></SettingCard>
        <SettingCard title="Change Password"><form className="space-y-4" onSubmit={handlePassword}><Input required type="password" placeholder="Current password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} /><Input required type="password" placeholder="New password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} /><Button disabled={loading} type="submit">Change Password</Button></form></SettingCard>
      </div>
    </PageContainer>
  );
}

const cityColumns: TableColumn<ShippingCity>[] = [
  { key: 'name', header: 'City' },
  { key: 'shippingFee', header: 'Fee' },
  { key: 'isActive', header: 'Status', render: (city) => city.isActive ? 'Active' : 'Inactive' },
];
