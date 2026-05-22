import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Calendar, CheckCircle2, Globe2, Plus, UserRound, X } from 'lucide-react';
import { CouponTable } from '../../components/crm/CouponTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { useCouponsStore } from '../../stores/couponsStore';
import { useCustomersStore } from '../../stores/customersStore';
import { useProductsStore } from '../../stores/productsStore';
import { useUsersStore } from '../../stores/usersStore';
import type { Coupon, CouponType } from '../../types/coupon';

type CouponForm = {
  code: string;
  type: CouponType;
  value: string;
  minOrderAmount: string;
  maxDiscount: string;
  startsAt: string;
  expiresAt: string;
  usageLimit: string;
  isActive: boolean;
  vendor: string;
  applicableCategories: string[];
  applicableProducts: string[];
  applicableCustomers: string[];
};

type TargetOption = {
  id: string;
  label: string;
};

const emptyForm: CouponForm = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderAmount: '',
  maxDiscount: '',
  startsAt: '',
  expiresAt: '',
  usageLimit: '',
  isActive: true,
  vendor: '',
  applicableCategories: [],
  applicableProducts: [],
  applicableCustomers: [],
};

export function CouponsPage() {
  const { coupons, pagination, loading, error, view, fetchCoupons, fetchMyCoupons, fetchCouponById, createCoupon, updateCoupon, deleteCoupon, selectedCoupon } = useCouponsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { products, fetchProducts } = useProductsStore();
  const { customers, fetchCustomers } = useCustomersStore();
  const { users, fetchUsers } = useUsersStore();
  const [open, setOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState('');
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const isEditing = Boolean(editingCouponId);

  const categoryOptions = useMemo<TargetOption[]>(() => categories.map((category) => ({ id: category._id || category.id, label: category.name })), [categories]);
  const productOptions = useMemo<TargetOption[]>(() => products.map((product) => ({ id: product._id || product.id, label: product.name })), [products]);
  const customerOptions = useMemo<TargetOption[]>(() => customers.map((customer) => ({ id: customer._id || customer.id, label: getCustomerName(customer) })), [customers]);
  const vendorOptions = useMemo<TargetOption[]>(() => users.filter((user) => user.isActive !== false).map((user) => ({ id: user._id || user.id || '', label: `${user.name} (${user.role})` })).filter((user) => user.id), [users]);

  useEffect(() => {
    void fetchCoupons();
    void fetchCategories({ page: 1, limit: 100 });
    void fetchProducts({ page: 1, limit: 100 });
    void fetchCustomers({ page: 1, limit: 100 });
    void fetchUsers({ page: 1, limit: 100 });
  }, [fetchCategories, fetchCoupons, fetchCustomers, fetchProducts, fetchUsers]);

  useEffect(() => {
    if (!open || !isEditing || !selectedCoupon) return;

    setForm(couponToForm(selectedCoupon));
  }, [isEditing, open, selectedCoupon]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = buildCouponPayload(form);

    if (isEditing) {
      await updateCoupon(editingCouponId, payload);
    } else {
      await createCoupon(payload);
    }

    closeForm();
  }

  function openCreateForm() {
    setEditingCouponId('');
    setForm(emptyForm);
    resetSelectors();
    setOpen(true);
  }

  async function openDetailsForm(couponId: string) {
    const listCoupon = coupons.find((coupon) => (coupon._id || coupon.id) === couponId);
    setEditingCouponId(couponId);
    setForm(listCoupon ? couponToForm(listCoupon) : emptyForm);
    resetSelectors();
    setOpen(true);
    await fetchCouponById(couponId);
  }

  function closeForm() {
    setOpen(false);
    setEditingCouponId('');
    setForm(emptyForm);
    resetSelectors();
  }

  function resetSelectors() {
    setSelectedCategory('');
    setSelectedProduct('');
    setSelectedCustomer('');
  }

  async function handleDeleteCoupon(couponId: string) {
    if (!window.confirm('Delete this coupon permanently?')) return;

    await deleteCoupon(couponId);
  }

  const fetchCurrentView = view === 'mine' ? fetchMyCoupons : fetchCoupons;

  return (
    <PageContainer>
      <SectionHeader title="Coupons" action={<div className="flex gap-2"><Button variant={view === 'mine' ? 'primary' : 'secondary'} onClick={() => view === 'mine' ? void fetchCoupons() : void fetchMyCoupons()}>{view === 'mine' ? 'All Coupons' : 'My Coupons'}</Button><Button onClick={openCreateForm} icon={<Plus className="h-4 w-4" />}>Create Coupon</Button></div>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <CouponTable coupons={coupons} onEdit={(couponId) => void openDetailsForm(couponId)} onDelete={(couponId) => void handleDeleteCoupon(couponId)} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchCurrentView({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title={isEditing ? 'Coupon Details' : 'Create Coupon'} onClose={closeForm}>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Code"><Input required placeholder="SAVE10" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} /></Field>
            <Field label="Type"><Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CouponType, value: event.target.value === 'free_shipping' ? '' : form.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option><option value="free_shipping">Free shipping</option></Select></Field>
            <Field label="Value"><Input disabled={form.type === 'free_shipping'} placeholder={form.type === 'percentage' ? '10' : '100'} type="number" min="0" step="0.01" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} /></Field>
            <Field label="Minimum order"><Input placeholder="500" type="number" min="0" step="0.01" value={form.minOrderAmount} onChange={(event) => setForm({ ...form, minOrderAmount: event.target.value })} /></Field>
            <Field label="Max discount"><Input disabled={form.type !== 'percentage'} placeholder="100" type="number" min="0" step="0.01" value={form.maxDiscount} onChange={(event) => setForm({ ...form, maxDiscount: event.target.value })} /></Field>
            <Field label="Usage limit"><Input placeholder="100" type="number" min="0" value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: event.target.value })} /></Field>
            <Field label="Starts at"><DatePickerField ariaLabel="Starts at" value={form.startsAt} max={form.expiresAt || undefined} onChange={(value) => setForm({ ...form, startsAt: value })} /></Field>
            <Field label="Expires at"><DatePickerField ariaLabel="Expires at" value={form.expiresAt} min={form.startsAt || undefined} onChange={(value) => setForm({ ...form, expiresAt: value })} /></Field>
          </div>

          <div className="space-y-4 rounded border border-border-subtle bg-bg-deep p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase text-white">Targeting</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">Control who owns the coupon and who can use it.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="accent-[#A3141C]" />
                Active
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <TargetSummaryCard icon={<Globe2 className="h-4 w-4" />} label="Audience" value={form.applicableCustomers.length > 0 ? `${form.applicableCustomers.length} customers` : 'Public'} />
              <TargetSummaryCard icon={<CheckCircle2 className="h-4 w-4" />} label="Catalog scope" value={getCatalogScopeLabel(form)} />
              <TargetSummaryCard icon={<UserRound className="h-4 w-4" />} label="Vendor" value={form.vendor ? vendorOptions.find((vendor) => vendor.id === form.vendor)?.label ?? 'Assigned' : 'No vendor'} />
            </div>

            <div className="rounded border border-border-subtle bg-panel/60 p-3">
              <Field label="Vendor owner">
                <Select value={form.vendor} onChange={(event) => setForm({ ...form, vendor: event.target.value })}>
                  <option value="">No vendor</option>
                  {vendorOptions.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.label}</option>)}
                </Select>
              </Field>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-gray-500">Optional. Vendor coupons appear in that internal user's My Coupons view.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TargetPicker label="Categories" emptyText="All categories" value={selectedCategory} options={categoryOptions} selectedIds={form.applicableCategories} onValueChange={setSelectedCategory} onAdd={() => addTarget('applicableCategories', selectedCategory, setSelectedCategory)} onRemove={(id) => removeTarget('applicableCategories', id)} />
              <TargetPicker label="Products" emptyText="All products" value={selectedProduct} options={productOptions} selectedIds={form.applicableProducts} onValueChange={setSelectedProduct} onAdd={() => addTarget('applicableProducts', selectedProduct, setSelectedProduct)} onRemove={(id) => removeTarget('applicableProducts', id)} />
              <div className="md:col-span-2">
                <TargetPicker label="Customers" emptyText="Public coupon" value={selectedCustomer} options={customerOptions} selectedIds={form.applicableCustomers} onValueChange={setSelectedCustomer} onAdd={() => addTarget('applicableCustomers', selectedCustomer, setSelectedCustomer)} onRemove={(id) => removeTarget('applicableCustomers', id)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeForm}>Cancel</Button>
            <Button type="submit" disabled={loading}>{isEditing ? 'Update Coupon' : 'Save Coupon'}</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );

  function addTarget(field: 'applicableCategories' | 'applicableProducts' | 'applicableCustomers', value: string, clearValue: (value: string) => void) {
    if (!value || form[field].includes(value)) return;

    setForm((current) => ({ ...current, [field]: [...current[field], value] }));
    clearValue('');
  }

  function removeTarget(field: 'applicableCategories' | 'applicableProducts' | 'applicableCustomers', value: string) {
    setForm((current) => ({ ...current, [field]: current[field].filter((item) => item !== value) }));
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"><span>{label}</span>{children}</label>;
}

function TargetSummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border border-border-subtle bg-panel/60 p-3">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-sm bg-brand/10 text-[#E9514B]">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-white">{value}</p>
    </div>
  );
}

function TargetPicker({ label, emptyText, value, options, selectedIds, onValueChange, onAdd, onRemove }: { label: string; emptyText: string; value: string; options: TargetOption[]; selectedIds: string[]; onValueChange: (value: string) => void; onAdd: () => void; onRemove: (id: string) => void }) {
  const selectedOptions = selectedIds.map((id) => options.find((option) => option.id === id) ?? { id, label: id });

  return (
    <div className="space-y-3 rounded border border-border-subtle bg-panel/60 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
        <span className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">{selectedIds.length > 0 ? `${selectedIds.length} selected` : emptyText}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Select className="min-w-0" value={value} onChange={(event) => onValueChange(event.target.value)}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.filter((option) => !selectedIds.includes(option.id)).map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </Select>
        <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={onAdd}>Add</Button>
      </div>
      <div className="flex min-h-8 flex-wrap gap-2">
        {selectedOptions.length > 0 ? selectedOptions.map((option) => (
          <span key={option.id} className="inline-flex max-w-full items-center gap-2 rounded-sm border border-border-subtle bg-bg-deep px-2 py-1 text-xs font-semibold text-gray-300">
            <span className="truncate">{option.label}</span>
            <button type="button" className="text-gray-500 transition-colors hover:text-white" aria-label={`Remove ${option.label}`} onClick={() => onRemove(option.id)}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )) : <span className="text-xs font-normal normal-case tracking-normal text-gray-500">{emptyText}.</span>}
      </div>
    </div>
  );
}

function buildCouponPayload(form: CouponForm) {
  return {
    code: form.code.toUpperCase(),
    type: form.type,
    value: form.type === 'free_shipping' || !form.value ? undefined : Number(form.value),
    minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
    maxDiscount: form.type === 'percentage' && form.maxDiscount ? Number(form.maxDiscount) : undefined,
    startsAt: form.startsAt || undefined,
    expiresAt: form.expiresAt || undefined,
    usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
    isActive: form.isActive,
    vendor: form.vendor || null,
    applicableCategories: form.applicableCategories,
    applicableProducts: form.applicableProducts,
    applicableCustomers: form.applicableCustomers,
  };
}

function couponToForm(coupon: Coupon): CouponForm {
  return {
    code: coupon.code ?? '',
    type: coupon.type ?? 'percentage',
    value: coupon.value === undefined ? '' : String(coupon.value),
    minOrderAmount: String(coupon.minOrderAmount ?? coupon.minimumOrderAmount ?? ''),
    maxDiscount: String(coupon.maxDiscount ?? coupon.maximumDiscount ?? ''),
    startsAt: (coupon.startsAt ?? coupon.startDate ?? '').slice(0, 10),
    expiresAt: (coupon.expiresAt ?? coupon.endDate ?? '').slice(0, 10),
    usageLimit: coupon.usageLimit === undefined ? '' : String(coupon.usageLimit),
    isActive: coupon.isActive !== false,
    vendor: getReferenceId(coupon.vendor),
    applicableCategories: normalizeReferenceList(coupon.applicableCategories),
    applicableProducts: normalizeReferenceList(coupon.applicableProducts),
    applicableCustomers: normalizeReferenceList(coupon.applicableCustomers),
  };
}

function normalizeReferenceList(value: unknown) {
  return Array.isArray(value) ? value.map(getReferenceId).filter(Boolean) : [];
}

function getReferenceId(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value) {
    const record = value as { _id?: string; id?: string };
    return record._id || record.id || '';
  }

  return '';
}

function getCustomerName(customer: { name?: string; firstName?: string; lastName?: string; email?: string }) {
  return customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email || 'Customer';
}

function getCatalogScopeLabel(form: CouponForm) {
  const scopes = [
    form.applicableCategories.length > 0 && `${form.applicableCategories.length} categories`,
    form.applicableProducts.length > 0 && `${form.applicableProducts.length} products`,
  ].filter(Boolean);

  return scopes.length > 0 ? scopes.join(', ') : 'All items';
}

function DatePickerField({ ariaLabel, value, min, max, onChange }: { ariaLabel: string; value: string; min?: string; max?: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;

    if ('showPicker' in input) {
      input.showPicker();
      return;
    }

    input.focus();
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        className="pr-10"
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        aria-label={`Open ${ariaLabel.toLowerCase()} picker`}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
        type="button"
        onClick={openPicker}
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  );
}
