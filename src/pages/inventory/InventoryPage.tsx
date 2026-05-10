import { Minus, Plus } from 'lucide-react';
import { InventoryTable } from '../../components/crm/InventoryTable';
import { StatCard } from '../../components/crm/StatCard';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { mockInventory, mockStockAdjustments } from '../../data/mockInventory';
import type { StockAdjustment } from '../../types/inventory';
import { formatDate } from '../../utils/formatDate';

const columns: TableColumn<StockAdjustment>[] = [
  { key: 'productName', header: 'Product' },
  { key: 'type', header: 'Type' },
  { key: 'quantity', header: 'Qty' },
  { key: 'reason', header: 'Reason' },
  { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
  { key: 'user', header: 'User' },
];

export function InventoryPage() {
  const lowStock = mockInventory.filter((item) => item.stock > 0 && item.stock <= item.lowStockThreshold).length;
  const outOfStock = mockInventory.filter((item) => item.stock === 0).length;
  const expiringSoon = mockInventory.filter((item) => new Date(item.expiryDate) < new Date('2026-08-01')).length;

  return (
    <PageContainer>
      <SectionHeader title="Inventory" action={<div className="flex gap-2"><Button icon={<Plus className="h-4 w-4" />}>Add Stock</Button><Button variant="secondary" icon={<Minus className="h-4 w-4" />}>Reduce Stock</Button></div>} />
      <div className="grid gap-4 md:grid-cols-3"><StatCard title="Low Stock Alerts" value={lowStock} icon={Plus} /><StatCard title="Out Of Stock" value={outOfStock} icon={Minus} trend="down" /><StatCard title="Expiring Soon" value={expiringSoon} icon={Plus} /></div>
      <Card><InventoryTable items={mockInventory} /></Card>
      <Card><CardHeader><CardTitle>Stock Adjustment History</CardTitle></CardHeader><Table columns={columns} data={mockStockAdjustments} getRowKey={(item) => item.id} /></Card>
      <Modal open={false} title="Stock Adjustment" onClose={() => undefined}>
        <div className="space-y-4"><Input placeholder="Product" /><Input placeholder="Quantity" type="number" /><Textarea placeholder="Reason for stock change" /></div>
      </Modal>
    </PageContainer>
  );
}
