import { FormEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import { useCouponsStore } from '../../stores/couponsStore';
import type { CouponType } from '../../types/coupon';

export function CouponsPage() {
  const { coupons, pagination, loading, error, view, fetchCoupons, fetchMyCoupons, createCoupon } = useCouponsStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as CouponType, value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiresAt: '', isActive: true });

  useEffect(() => {
    void fetchCoupons();
  }, [fetchCoupons]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createCoupon({
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value ? Number(form.value) : undefined,
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      expiresAt: form.expiresAt || undefined,
      isActive: form.isActive,
    });
    setOpen(false);
  }

  return (
    <PageContainer>
      <SectionHeader title="Coupons" action={<div className="flex gap-2"><Button variant={view === 'mine' ? 'primary' : 'secondary'} onClick={() => view === 'mine' ? void fetchCoupons() : void fetchMyCoupons()}>{view === 'mine' ? 'All Coupons' : 'My Coupons'}</Button><Button onClick={() => setOpen(true)} icon={<Plus className="h-4 w-4" />}>Create Coupon</Button></div>} />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <CouponTable coupons={coupons} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => view === 'mine' ? void fetchMyCoupons({ page, limit: pagination.limit }) : void fetchCoupons({ page, limit: pagination.limit })} /></Card>
      <Modal open={open} title="Coupon Form" onClose={() => setOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}><Input required placeholder="Code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} /><Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CouponType })}><option value="percentage">percentage</option><option value="fixed">fixed</option><option value="free_shipping">free shipping</option></Select><Input placeholder="Value" type="number" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} /><Input placeholder="Minimum order" type="number" value={form.minOrderAmount} onChange={(event) => setForm({ ...form, minOrderAmount: event.target.value })} /><Input placeholder="Max discount" type="number" value={form.maxDiscount} onChange={(event) => setForm({ ...form, maxDiscount: event.target.value })} /><Input placeholder="Usage limit" type="number" value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: event.target.value })} /><Input type="date" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} /><Button type="submit">Save Coupon</Button></form>
      </Modal>
    </PageContainer>
  );
}
