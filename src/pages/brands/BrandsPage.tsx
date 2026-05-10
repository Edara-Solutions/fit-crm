import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../../components/crm/StatusBadge';
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
import type { Brand } from '../../types/brand';
import { useBrandsStore } from '../../stores/brandsStore';

const columns: TableColumn<Brand>[] = [
  { key: 'name', header: 'Brand', render: (brand) => <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded bg-bg-deep font-black text-white ring-1 ring-border-subtle">{brand.logo?.startsWith('http') ? <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" /> : brand.logo || brand.name.slice(0, 2)}</div><div><p className="font-bold text-white">{brand.name}</p><p className="text-[10px] text-gray-500">{brand.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (brand) => <StatusBadge status={brand.status || (brand.isActive === false ? 'inactive' : 'active')} /> },
];

export function BrandsPage() {
  const { brands, pagination, loading, error, fetchBrands, createBrand } = useBrandsStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', logo: '', isActive: true });

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createBrand(form);
    setOpen(false);
    setForm({ name: '', description: '', logo: '', isActive: true });
  }

  return (
    <PageContainer>
      <SectionHeader title="Brands" action={<Button onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Add Brand</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={brands} getRowKey={(brand) => brand._id || brand.id} actions={() => <Dropdown />} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchBrands({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title="Brand Form" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}><Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><Input placeholder="Logo URL" value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} /><Button type="submit">Save Brand</Button></form>
      </Modal>
    </PageContainer>
  );
}
