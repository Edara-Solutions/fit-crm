import { FormEvent, useEffect, useState } from 'react';
import { Eye, Plus } from 'lucide-react';
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
import type { Category } from '../../types/category';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { validateImageFile } from '../../lib/formData';

type CategoryForm = {
  name: string;
  description: string;
  image: string | File;
  isActive: boolean;
};

const emptyForm: CategoryForm = { name: '', description: '', image: '', isActive: true };

const columns: TableColumn<Category>[] = [
  { key: 'name', header: 'Category', render: (category) => <div className="flex items-center gap-3"><img src={category.image || '/vite.svg'} alt={category.name} className="h-10 w-10 rounded object-cover" /><div><p className="font-bold text-white">{category.name}</p><p className="text-[10px] text-gray-500">{category.description}</p></div></div> },
  { key: 'productCount', header: 'Products' },
  { key: 'status', header: 'Status', render: (category) => <StatusBadge status={category.status || (category.isActive === false ? 'inactive' : 'active')} /> },
];

export function CategoriesPage() {
  const { categories, pagination, loading, error, fetchCategories, createCategory, updateCategory } = useCategoriesStore();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!form.image) {
      setImagePreview('');
      return;
    }

    if (typeof form.image === 'string') {
      setImagePreview(form.image);
      return;
    }

    const previewUrl = URL.createObjectURL(form.image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [form.image]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    if (form.image instanceof File) {
      const imageError = validateImageFile(form.image);
      if (imageError) {
        setFormError(imageError);
        return;
      }
    }

    const payload = {
      name: form.name,
      description: form.description || undefined,
      image: form.image || undefined,
      isActive: form.isActive,
    };

    if (selectedCategory) {
      const categoryId = selectedCategory._id || selectedCategory.id;
      await updateCategory(categoryId, payload);
    } else {
      await createCategory(payload);
    }

    closeForm();
  }

  function openCreateForm() {
    setSelectedCategory(null);
    setForm(emptyForm);
    setFormError('');
    setOpen(true);
  }

  function openDetailsForm(category: Category) {
    setSelectedCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? '',
      image: category.image ?? '',
      isActive: category.isActive !== false,
    });
    setFormError('');
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setSelectedCategory(null);
    setForm(emptyForm);
    setFormError('');
  }

  return (
    <PageContainer>
      <SectionHeader title="Categories" action={<Button onClick={openCreateForm} icon={<Plus className="h-4 w-4" />}>Add Category</Button>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <Table columns={columns} data={categories} getRowKey={(category) => category._id || category.id} actions={(category) => <Dropdown><Button variant="secondary" icon={<Eye className="h-4 w-4" />} onClick={() => openDetailsForm(category)}>Details</Button></Dropdown>} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCategories({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title={selectedCategory ? 'Category Details' : 'Category Form'} onClose={closeForm}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError && <p className="border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-red-200">{formError}</p>}
          <Input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <ImageUploadField
            label="Category image"
            previewUrl={imagePreview}
            fileName={form.image instanceof File ? form.image.name : undefined}
            fallbackText="No image"
            onChange={(file) => setForm({ ...form, image: file })}
            onClear={() => setForm({ ...form, image: selectedCategory?.image ?? '' })}
          />
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="accent-[#A3141C]" />
            Active
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit">{selectedCategory ? 'Update Category' : 'Save Category'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
