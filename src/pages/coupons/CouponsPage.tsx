import { Plus } from 'lucide-react';
import { CouponTable } from '../../components/crm/CouponTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { mockCoupons } from '../../data/mockCoupons';

export function CouponsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Coupons" action={<Button icon={<Plus className="h-4 w-4" />}>Create Coupon</Button>} />
      <Card><CouponTable coupons={mockCoupons} /></Card>
      <Modal open={false} title="Coupon Form" onClose={() => undefined}>
        <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Code" /><Select><option>percentage</option><option>fixed</option><option>free shipping</option></Select><Input placeholder="Value" /><Input placeholder="Minimum order" /><Input placeholder="Usage limit" /><Input type="date" /></div>
      </Modal>
    </PageContainer>
  );
}
