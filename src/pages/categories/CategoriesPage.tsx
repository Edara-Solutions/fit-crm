import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import type { Category } from '../../types/category';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { useCategoriesStore } from '../../stores/categoriesStore';

const columns: TableColumn<Category>[] = [
  { key: 'name', header: 'Category', render: (category) => <div className="flex items-center gap-3"><img src={category.image || '/vite.svg'} alt={category.name} className="h-10 w-10 rounded object-cover" /><div><p className="font-bold text-white">{category.name}</p><p className="text-[10px] text-gray-500">{category.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (category) => <StatusBadge status={category.status || (category.isActive === false ? 'inactive' : 'active')} /> },
];

export function CategoriesPage() {
  const { categories, pagination, loading, error, fetchCategories, createCategory } = useCategoriesStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '', isActive: true });

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createCategory(form);
    setOpen(false);
    setForm({ name: '', description: '', image: '', isActive: true });
  }

  return (
    <PageContainer>
      <SectionHeader title="Categories" action={<Button onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Add Category</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={categories} getRowKey={(category) => category._id || category.id} actions={() => <Dropdown />} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCategories({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title="Category Form" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}><Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><Input placeholder="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /><Button type="submit">Save Category</Button></form>
      </Modal>
    </PageContainer>
  );
}
