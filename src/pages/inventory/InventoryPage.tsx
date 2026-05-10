import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { InventoryTable } from '../../components/crm/InventoryTable';
import { StatCard } from '../../components/crm/StatCard';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Tabs } from '../../components/ui/Tabs';
import { Textarea } from '../../components/ui/Textarea';
import { useInventoryStore } from '../../stores/inventoryStore';

export function InventoryPage() {
  const { lowStock, outOfStock, nearExpiry, pagination, activeTab, loading, error, threshold, days, fetchLowStock, fetchOutOfStock, fetchNearExpiry, adjustStock } = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: '', quantity: '', reason: '' });
  const items = useMemo(() => activeTab === 'low-stock' ? lowStock : activeTab === 'out-of-stock' ? outOfStock : nearExpiry, [activeTab, lowStock, nearExpiry, outOfStock]);

  useEffect(() => {
    void fetchLowStock();
    void fetchOutOfStock();
    void fetchNearExpiry();
  }, [fetchLowStock, fetchNearExpiry, fetchOutOfStock]);

  async function handleAdjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.reason.trim()) return;
    if (Number(form.quantity) < 0 && !window.confirm('Stock cannot become negative. Continue with this decrease?')) return;
    await adjustStock(form.productId, { quantity: Number(form.quantity), reason: form.reason });
    setOpen(false);
  }

  return (
    <PageContainer>
      <SectionHeader title="Inventory" action={<Button onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Adjust Stock</Button>} />
      <div className="grid gap-4 md:grid-cols-3"><StatCard title="Low Stock Alerts" value={lowStock.length} icon={Plus} /><StatCard title="Out Of Stock" value={outOfStock.length} icon={Minus} trend="down" /><StatCard title="Expiring Soon" value={nearExpiry.length} icon={Plus} /></div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><Tabs tabs={['Low Stock', 'Out Of Stock', 'Near Expiry']} active={activeTab === 'low-stock' ? 'Low Stock' : activeTab === 'out-of-stock' ? 'Out Of Stock' : 'Near Expiry'} onChange={(tab) => tab === 'Low Stock' ? void fetchLowStock() : tab === 'Out Of Stock' ? void fetchOutOfStock() : void fetchNearExpiry()} /><div className="flex gap-2"><Input className="w-28" type="number" defaultValue={threshold} onBlur={(event) => void fetchLowStock({ threshold: Number(event.target.value), page: 1, limit: 12 })} /><Input className="w-28" type="number" defaultValue={days} onBlur={(event) => void fetchNearExpiry({ days: Number(event.target.value), page: 1, limit: 12 })} /></div></div>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <InventoryTable items={items} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => activeTab === 'low-stock' ? void fetchLowStock({ page, limit: pagination.limit }) : activeTab === 'out-of-stock' ? void fetchOutOfStock({ page, limit: pagination.limit }) : void fetchNearExpiry({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title="Stock Adjustment" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={handleAdjust}><Input required placeholder="Product ID" value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} /><Input required placeholder="Quantity (+ increase, - decrease)" type="number" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /><Textarea required placeholder="Reason for stock change" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} /><p className="text-[10px] text-amber-300">Stock cannot become negative. Decreases may be rejected by the backend.</p><Button type="submit">Adjust Stock</Button></form>
      </Modal>
    </PageContainer>
  );
}
