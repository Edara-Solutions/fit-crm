import { Plus } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import { mockCategories } from '../../data/mockCategories';
import type { Category } from '../../types/category';
import { StatusBadge } from '../../components/crm/StatusBadge';

const columns: TableColumn<Category>[] = [
  { key: 'name', header: 'Category', render: (category) => <div className="flex items-center gap-3"><img src={category.image} alt={category.name} className="h-10 w-10 rounded object-cover" /><div><p className="font-bold text-white">{category.name}</p><p className="text-[10px] text-gray-500">{category.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (category) => <StatusBadge status={category.status} /> },
];

export function CategoriesPage() {
  return (
    <PageContainer>
      <SectionHeader title="Categories" action={<Button icon={<Plus className="h-4 w-4" />}>Add Category</Button>} />
      <Card><Table columns={columns} data={mockCategories} getRowKey={(category) => category.id} actions={() => <Dropdown />} /></Card>
      <Modal open={false} title="Category Form" onClose={() => undefined}>
        <div className="space-y-4"><Input placeholder="Name" /><Textarea placeholder="Description" /><Input placeholder="Image URL" /></div>
      </Modal>
    </PageContainer>
  );
}
