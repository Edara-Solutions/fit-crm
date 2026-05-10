import { FormEvent, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { validateImageFile } from '../../lib/formData';
import { useBrandsStore } from '../../stores/brandsStore';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { useProductsStore } from '../../stores/productsStore';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"><span>{label}</span>{children}</label>;
}

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { selectedProduct, loading, createProduct, updateProduct, fetchProductById } = useProductsStore();
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sku: '',
    flavors: '',
    size: '',
    weight: '',
    servings: '',
    ingredients: '',
    nutritionFacts: '',
    warnings: '',
    usageInstructions: '',
    expiryDate: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    void fetchBrands();
    void fetchCategories();
    if (id) void fetchProductById(id);
  }, [fetchBrands, fetchCategories, fetchProductById, id]);

  useEffect(() => {
    if (!selectedProduct || !id) return;
    setForm((current) => ({
      ...current,
      name: selectedProduct.name ?? '',
      shortDescription: selectedProduct.shortDescription ?? '',
      description: selectedProduct.description ?? '',
      brand: typeof selectedProduct.brand === 'string' ? selectedProduct.brand : selectedProduct.brand?._id || selectedProduct.brand?.id || '',
      category: typeof selectedProduct.category === 'string' ? selectedProduct.category : selectedProduct.category?._id || selectedProduct.category?.id || '',
      price: String(selectedProduct.price ?? ''),
      discountPrice: String(selectedProduct.discountPrice ?? ''),
      stock: String(selectedProduct.stock ?? ''),
      sku: selectedProduct.sku ?? '',
      expiryDate: selectedProduct.expiryDate?.slice(0, 10) ?? '',
      isActive: selectedProduct.isActive !== false,
      isFeatured: Boolean(selectedProduct.isFeatured || selectedProduct.featured),
    }));
  }, [id, selectedProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.brand || !form.category || !form.price || !form.sku) {
      setError('Name, description, brand, category, price, and SKU are required.');
      return;
    }

    const imageError = images.map(validateImageFile).find(Boolean);
    if (imageError) {
      setError(imageError);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      servings: form.servings ? Number(form.servings) : undefined,
      flavors: form.flavors ? form.flavors.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
      ingredients: form.ingredients ? form.ingredients.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
      nutritionFacts: form.nutritionFacts ? safeJson(form.nutritionFacts) : undefined,
      images,
    };

    if (id) await updateProduct(id, payload);
    else await createProduct(payload);
    navigate('/products');
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit}>
      <SectionHeader title="Product Form" eyebrow="Products / Editor" action={<Button disabled={loading} type="submit" icon={<Save className="h-4 w-4" />}>{loading ? 'Saving...' : 'Save Product'}</Button>} />
      {error && <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-red-200">{error}</p>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Short description"><Input value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} /></Field><Field label="Description"><Textarea className="md:col-span-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><Field label="Brand"><Select value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })}><option value="">Select brand</option>{brands.map((brand) => <option key={brand._id || brand.id} value={brand._id || brand.id}>{brand.name}</option>)}</Select></Field><Field label="Category"><Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category._id || category.id} value={category._id || category.id}>{category.name}</option>)}</Select></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Supplement Details</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Flavors"><Input placeholder="Chocolate, Vanilla" value={form.flavors} onChange={(event) => setForm({ ...form, flavors: event.target.value })} /></Field><Field label="Size"><Input placeholder="2kg" value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} /></Field><Field label="Weight"><Input value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} /></Field><Field label="Servings"><Input type="number" value={form.servings} onChange={(event) => setForm({ ...form, servings: event.target.value })} /></Field><Field label="Ingredients"><Textarea value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} /></Field><Field label="Nutrition facts"><Textarea value={form.nutritionFacts} onChange={(event) => setForm({ ...form, nutritionFacts: event.target.value })} /></Field><Field label="Warnings"><Textarea value={form.warnings} onChange={(event) => setForm({ ...form, warnings: event.target.value })} /></Field><Field label="Usage instructions"><Textarea value={form.usageInstructions} onChange={(event) => setForm({ ...form, usageInstructions: event.target.value })} /></Field></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Media</CardTitle></CardHeader><CardContent><Input type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files ?? []).slice(0, 8))} /><p className="mt-2 text-[10px] text-gray-500">Up to 8 images, 5MB each.</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pricing</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Price"><Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></Field><Field label="Discount price"><Input type="number" value={form.discountPrice} onChange={(event) => setForm({ ...form, discountPrice: event.target.value })} /></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Inventory</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Stock"><Input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></Field><Field label="SKU"><Input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></Field><Field label="Low stock threshold"><Input type="number" /></Field><Field label="Expiry date"><Input type="date" value={form.expiryDate} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} /></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Visibility</CardTitle></CardHeader><CardContent className="space-y-3 text-xs text-gray-300"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="accent-[#A3141C]" /> Active</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} className="accent-[#A3141C]" /> Featured</label></CardContent></Card>
        </div>
      </div>
      </form>
    </PageContainer>
  );
}

function safeJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
