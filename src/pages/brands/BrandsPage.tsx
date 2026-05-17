import { FormEvent, useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dropdown } from '../../components/ui/Dropdown';
import { ImageUploadField } from '../../components/ui/ImageUploadField';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Table, type TableColumn } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/Textarea';
import type { Brand } from '../../types/brand';
import { useBrandsStore } from '../../stores/brandsStore';
import { validateImageFile } from '../../lib/formData';

type BrandForm = {
  name: string;
  description: string;
  logo: string | File;
  isActive: boolean;
};

const emptyForm: BrandForm = { name: '', description: '', logo: '', isActive: true };

const columns: TableColumn<Brand>[] = [
  { key: 'name', header: 'Brand', render: (brand) => <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded bg-bg-deep font-black text-white ring-1 ring-border-subtle">{brand.logo?.startsWith('http') ? <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" /> : brand.logo || brand.name.slice(0, 2)}</div><div><p className="font-bold text-white">{brand.name}</p><p className="text-[10px] text-gray-500">{brand.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (brand) => <StatusBadge status={brand.status || (brand.isActive === false ? 'inactive' : 'active')} /> },
];

export function BrandsPage() {
  const { brands, pagination, loading, error, fetchBrands, createBrand, updateBrand } = useBrandsStore();
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [form, setForm] = useState<BrandForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    if (!form.logo) {
      setLogoPreview('');
      return;
    }

    if (typeof form.logo === 'string') {
      setLogoPreview(form.logo);
      return;
    }

    const previewUrl = URL.createObjectURL(form.logo);
    setLogoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.logo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    if (form.logo instanceof File) {
      const imageError = validateImageFile(form.logo);
      if (imageError) {
        setFormError(imageError);
        return;
      }
    }

    const payload = {
      name: form.name,
      description: form.description || undefined,
      logo: form.logo || undefined,
      isActive: form.isActive,
    };

    if (selectedBrand) {
      const brandId = selectedBrand._id || selectedBrand.id;
      await updateBrand(brandId, payload);
    } else {
      await createBrand(payload);
    }

    closeForm();
  }

  function openCreateForm() {
    setSelectedBrand(null);
    setForm(emptyForm);
    setFormError('');
    setOpen(true);
  }

  function openDetailsForm(brand: Brand) {
    setSelectedBrand(brand);
    setForm({
      name: brand.name,
      description: brand.description ?? '',
      logo: brand.logo ?? '',
      isActive: brand.isActive !== false,
    });
    setFormError('');
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setSelectedBrand(null);
    setForm(emptyForm);
    setFormError('');
  }

  return (
    <PageContainer>
      <SectionHeader title="Brands" action={<Button onClick={openCreateForm} icon={<Plus className="h-4 w-4" />}>Add Brand</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={brands} getRowKey={(brand) => brand._id || brand.id} actions={(brand) => <Dropdown><Button variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => openDetailsForm(brand)}>Details</Button></Dropdown>} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchBrands({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title={selectedBrand ? 'Brand Details' : 'Brand Form'} onClose={closeForm}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError && <p className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-red-200">{formError}</p>}
          <Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <ImageUploadField
            label="Brand logo"
            previewUrl={logoPreview}
            fileName={form.logo instanceof File ? form.logo.name : undefined}
            fallbackText={form.name ? form.name.slice(0, 2).toUpperCase() : 'No logo'}
            onChange={(file) => setForm({ ...form, logo: file })}
            onClear={() => setForm({ ...form, logo: selectedBrand?.logo ?? '' })}
          />
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="accent-[#A3141C]" />
            Active
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit">{selectedBrand ? 'Update Brand' : 'Save Brand'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
