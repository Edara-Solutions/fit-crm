import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
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

type NutritionFactRow = {
  key: string;
  value: string;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"><span>{label}</span>{children}</label>;
}

function StringListEditor({
  title,
  placeholder,
  inputValue,
  items,
  emptyText,
  onInputChange,
  onAdd,
  onRemove,
}: {
  title: string;
  placeholder: string;
  inputValue: string;
  items: string[];
  emptyText: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</span>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAdd();
            }
          }}
        />
        <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={onAdd}>Add</Button>
      </div>
      <div className="flex min-h-8 flex-wrap gap-2">
        {items.length > 0 ? items.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 rounded-sm border border-border-subtle bg-white/5 px-2 py-1 text-xs font-semibold text-gray-300">
            {item}
            <button type="button" className="text-gray-500 transition-colors hover:text-white" aria-label={`Remove ${item}`} onClick={() => onRemove(item)}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )) : <span className="text-xs text-gray-500">{emptyText}</span>}
      </div>
    </div>
  );
}

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const { selectedProduct, loading, createProduct, updateProduct, fetchProductById } = useProductsStore();
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [flavorInput, setFlavorInput] = useState('');
  const [warningInput, setWarningInput] = useState('');
  const [usageInstructionInput, setUsageInstructionInput] = useState('');
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
    flavors: [] as string[],
    size: '',
    weight: '',
    servings: '',
    ingredients: '',
    nutritionFacts: [] as NutritionFactRow[],
    warnings: [] as string[],
    usageInstructions: [] as string[],
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
      flavors: Array.isArray(selectedProduct.flavors) ? selectedProduct.flavors : [],
      size: selectedProduct.size ?? '',
      weight: selectedProduct.weight ?? '',
      servings: selectedProduct.servings ? String(selectedProduct.servings) : '',
      ingredients: formatEditableList(selectedProduct.ingredients),
      nutritionFacts: normalizeNutritionFacts(selectedProduct.nutritionFacts),
      warnings: normalizeStringArray(selectedProduct.warnings),
      usageInstructions: normalizeStringArray(selectedProduct.usageInstructions),
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
      flavors: form.flavors,
      ingredients: form.ingredients ? form.ingredients.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
      nutritionFacts: buildNutritionFacts(form.nutritionFacts),
      warnings: form.warnings,
      usageInstructions: form.usageInstructions,
      images: images.length > 0 ? images : undefined,
    };

    if (id) {
      const productId = selectedProduct?._id || selectedProduct?.id;
      if (!productId) {
        setError('Product id is missing. Please reload the product and try again.');
        return;
      }
      await updateProduct(productId, payload);
    } else {
      await createProduct(payload);
    }
    navigate('/products');
  }

  function addFlavor() {
    const nextFlavor = flavorInput.trim();
    if (!nextFlavor) return;

    setForm((current) => current.flavors.includes(nextFlavor) ? current : { ...current, flavors: [...current.flavors, nextFlavor] });
    setFlavorInput('');
  }

  function removeFlavor(flavor: string) {
    setForm((current) => ({ ...current, flavors: current.flavors.filter((item) => item !== flavor) }));
  }

  function addStringItem(field: 'warnings' | 'usageInstructions', value: string, clearInput: () => void) {
    const nextValue = value.trim();
    if (!nextValue) return;

    setForm((current) => current[field].includes(nextValue) ? current : { ...current, [field]: [...current[field], nextValue] });
    clearInput();
  }

  function removeStringItem(field: 'warnings' | 'usageInstructions', value: string) {
    setForm((current) => ({ ...current, [field]: current[field].filter((item) => item !== value) }));
  }

  function addNutritionFact() {
    setForm((current) => ({ ...current, nutritionFacts: [...current.nutritionFacts, { key: '', value: '' }] }));
  }

  function updateNutritionFact(index: number, field: keyof NutritionFactRow, value: string) {
    setForm((current) => ({
      ...current,
      nutritionFacts: current.nutritionFacts.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  }

  function removeNutritionFact(index: number) {
    setForm((current) => ({ ...current, nutritionFacts: current.nutritionFacts.filter((_, itemIndex) => itemIndex !== index) }));
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit}>
      <SectionHeader title="Product Form" eyebrow="Products / Editor" action={<Button disabled={loading} type="submit" icon={<Save className="h-4 w-4" />}>{loading ? 'Saving...' : 'Save Product'}</Button>} />
      {error && <p className="mb-4 border-l-2 border-brand bg-brand/10 px-3 py-2 text-xs font-semibold text-red-200">{error}</p>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card><CardHeader><CardTitle>Basic Information</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field><Field label="Short description"><Input value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} /></Field><Field label="Description"><Textarea className="md:col-span-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><Field label="Brand"><Select value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })}><option value="">Select brand</option>{brands.map((brand) => <option key={brand._id || brand.id} value={brand._id || brand.id}>{brand.name}</option>)}</Select></Field><Field label="Category"><Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category._id || category.id} value={category._id || category.id}>{category.name}</option>)}</Select></Field></CardContent></Card>
          <Card><CardHeader><CardTitle>Supplement Details</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><Field label="Flavors"><div className="space-y-3"><div className="flex gap-2"><Input placeholder="Chocolate" value={flavorInput} onChange={(event) => setFlavorInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addFlavor(); } }} /><Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={addFlavor}>Add</Button></div><div className="flex min-h-8 flex-wrap gap-2">{form.flavors.length > 0 ? form.flavors.map((flavor) => <span key={flavor} className="inline-flex items-center gap-2 rounded-sm border border-border-subtle bg-white/5 px-2 py-1 text-xs font-semibold text-gray-300">{flavor}<button type="button" className="text-gray-500 transition-colors hover:text-white" aria-label={`Remove ${flavor}`} onClick={() => removeFlavor(flavor)}><X className="h-3 w-3" /></button></span>) : <span className="text-xs text-gray-500">No flavors added.</span>}</div></div></Field><Field label="Size"><Input placeholder="2kg" value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })} /></Field><Field label="Weight"><Input value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} /></Field><Field label="Servings"><Input type="number" value={form.servings} onChange={(event) => setForm({ ...form, servings: event.target.value })} /></Field><Field label="Ingredients"><Textarea value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} /></Field><div className="space-y-2 md:col-span-2"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nutrition facts</span><Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={addNutritionFact}>Add Fact</Button></div><div className="space-y-2">{form.nutritionFacts.length > 0 ? form.nutritionFacts.map((fact, index) => <div key={index} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><Input placeholder="Protein" value={fact.key} onChange={(event) => updateNutritionFact(index, 'key', event.target.value)} /><Input placeholder="25g" value={fact.value} onChange={(event) => updateNutritionFact(index, 'value', event.target.value)} /><Button variant="secondary" icon={<X className="h-4 w-4" />} onClick={() => removeNutritionFact(index)}>Delete</Button></div>) : <p className="text-xs text-gray-500">No nutrition facts added.</p>}</div></div><StringListEditor title="Warnings" placeholder="Contains milk and soy" inputValue={warningInput} items={form.warnings} emptyText="No warnings added." onInputChange={setWarningInput} onAdd={() => addStringItem('warnings', warningInput, () => setWarningInput(''))} onRemove={(item) => removeStringItem('warnings', item)} /><StringListEditor title="Usage instructions" placeholder="Mix one scoop with water" inputValue={usageInstructionInput} items={form.usageInstructions} emptyText="No usage instructions added." onInputChange={setUsageInstructionInput} onAdd={() => addStringItem('usageInstructions', usageInstructionInput, () => setUsageInstructionInput(''))} onRemove={(item) => removeStringItem('usageInstructions', item)} /></CardContent></Card>
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

function formatEditableList(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join(', ') : value ?? '';
}

function normalizeStringArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeNutritionFacts(value: string | Record<string, unknown> | undefined): NutritionFactRow[] {
  if (!value) return [];

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (isRecord(parsed)) return objectToNutritionRows(parsed);
    } catch {
      return [{ key: 'Details', value }];
    }

    return [{ key: 'Details', value }];
  }

  return objectToNutritionRows(value);
}

function objectToNutritionRows(value: Record<string, unknown>) {
  return Object.entries(value).map(([key, item]) => ({ key, value: String(item ?? '') }));
}

function buildNutritionFacts(rows: NutritionFactRow[]) {
  return rows.reduce<Record<string, string>>((facts, row) => {
    const key = row.key.trim();
    if (!key) return facts;

    facts[key] = row.value.trim();
    return facts;
  }, {});
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
