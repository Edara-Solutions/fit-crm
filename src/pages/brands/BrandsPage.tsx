import { Plus } from 'lucide-react';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { mockBrands } from '../../data/mockBrands';
import type { Brand } from '../../types/brand';

const columns: TableColumn<Brand>[] = [
  { key: 'name', header: 'Brand', render: (brand) => <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded bg-bg-deep font-black text-white ring-1 ring-border-subtle">{brand.logo}</div><div><p className="font-bold text-white">{brand.name}</p><p className="text-[10px] text-gray-500">{brand.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (brand) => <StatusBadge status={brand.status} /> },
];

export function BrandsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Brands" action={<Button icon={<Plus className="h-4 w-4" />}>Add Brand</Button>} />
      <Card><Table columns={columns} data={mockBrands} getRowKey={(brand) => brand.id} actions={() => <Dropdown />} /></Card>
      <Modal open={false} title="Brand Form" onClose={() => undefined}>
        <div className="space-y-4"><Input placeholder="Name" /><Textarea placeholder="Description" /><Input placeholder="Logo" /></div>
      </Modal>
    </PageContainer>
  );
}
