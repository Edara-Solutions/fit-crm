import { Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';

function SettingCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">{children}</CardContent></Card>;
}

export function SettingsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Settings" action={<Button icon={<Save className="h-4 w-4" />}>Save Settings</Button>} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingCard title="Store Information"><Input defaultValue="BE-FOX Supplements" /><Input defaultValue="+20 100 000 0000" /><Textarea defaultValue="Premium gym supplements store." /></SettingCard>
        <SettingCard title="Payment Methods"><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Cash on delivery</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Card payments</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" className="accent-[#A3141C]" /> Wallets</label></SettingCard>
        <SettingCard title="Shipping Fees"><Input defaultValue="80" /><Select><option>Flat rate</option><option>By governorate</option><option>Free over threshold</option></Select></SettingCard>
        <SettingCard title="Order Status Settings"><Select><option>pending</option><option>processing</option><option>shipped</option><option>delivered</option></Select><Textarea defaultValue="Default order workflow notifications." /></SettingCard>
        <SettingCard title="Notification Settings"><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Low stock alerts</label><label className="flex gap-2 text-xs text-gray-300"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> New order alerts</label></SettingCard>
        <SettingCard title="Admin Account & System"><Input defaultValue="admin@be-fox.com" /><Select><option>Dark premium mode</option></Select><Select><option>Egypt timezone</option></Select></SettingCard>
      </div>
    </PageContainer>
  );
}
