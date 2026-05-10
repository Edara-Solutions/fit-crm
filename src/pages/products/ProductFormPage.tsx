import { Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { ImageUploader } from '../../components/crm/ImageUploader';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { mockBrands } from '../../data/mockBrands';
import { mockCategories } from '../../data/mockCategories';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"><span>{label}</span>{children}</label>;
}

export function ProductFormPage() {
  return (
    <PageContainer>
      <SectionHeader title="Product Form" eyebrow="Products / Editor" action={<Button icon={<Save className="h-4 w-4" />}>Save Product</Button>} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Name"><Input /></Field><Field label="Short description"><Input /></Field><Field label="Description"><Textarea className="md:col-span-2" /></Field><Field label="Brand"><Select>{mockBrands.map((brand) => <option key={brand.id}>{brand.name}</option>)}</Select></Field><Field label="Category"><Select>{mockCategories.map((category) => <option key={category.id}>{category.name}</option>)}</Select></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Supplement Details</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Flavors"><Input placeholder="Chocolate, Vanilla" /></Field><Field label="Size"><Input placeholder="2kg" /></Field><Field label="Weight"><Input /></Field><Field label="Servings"><Input type="number" /></Field><Field label="Ingredients"><Textarea /></Field><Field label="Nutrition facts"><Textarea /></Field><Field label="Warnings"><Textarea /></Field><Field label="Usage instructions"><Textarea /></Field></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Media</CardTitle></CardHeader><CardContent><ImageUploader /></CardContent></Card>
          <Card><CardHeader><CardTitle>Pricing</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Price"><Input type="number" /></Field><Field label="Discount price"><Input type="number" /></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Inventory</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Stock"><Input type="number" /></Field><Field label="SKU"><Input /></Field><Field label="Low stock threshold"><Input type="number" /></Field><Field label="Expiry date"><Input type="date" /></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Visibility</CardTitle></CardHeader><CardContent className="space-y-3 text-xs text-gray-300"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[#A3141C]" /> Active</label><label className="flex items-center gap-2"><input type="checkbox" className="accent-[#A3141C]" /> Featured</label></CardContent></Card>
        </div>
      </div>
    </PageContainer>
  );
}
