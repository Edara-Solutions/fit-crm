import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { useProductsStore } from '../../stores/productsStore';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { selectedProduct: product, loading, error, fetchProductById } = useProductsStore();

  useEffect(() => {
    if (id) void fetchProductById(id);
  }, [fetchProductById, id]);

  if (loading || !product) {
    return <PageContainer><SectionHeader title="Product Details" eyebrow="Products / Details" /><LoadingSkeleton /></PageContainer>;
  }

  const productId = product._id || product.id;
  const productRouteKey = product.slug || productId;
  const images = getProductImages(product);
  const brand = getNamedValue(product.brand);
  const category = getNamedValue(product.category);
  const status = product.status || (product.stock === 0 ? 'out_of_stock' : product.isActive === false ? 'inactive' : 'active');

  return (
    <PageContainer>
      <SectionHeader
        title={product.name}
        eyebrow="Products / Details"
        action={productRouteKey ? <Link to={`/products/${productRouteKey}/edit`}><Button icon={<Edit3 className="h-4 w-4" />}>Edit Product</Button></Link> : undefined}
      />
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}</div>}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-5 text-sm text-gray-300">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={status} />
                {product.isFeatured || product.featured ? <Badge tone="red">Featured</Badge> : <Badge>Standard</Badge>}
                {product.isStack && <Badge>Stack</Badge>}
              </div>
              <DetailGrid items={[
                { label: 'SKU', value: product.sku },
                { label: 'Brand', value: brand },
                { label: 'Category', value: category },
                { label: 'Short Description', value: product.shortDescription },
              ]} />
              <TextBlock label="Description" value={product.description} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Supplement Details</CardTitle></CardHeader>
            <CardContent className="space-y-5 text-sm text-gray-300">
              <DetailGrid items={[
                { label: 'Flavors', value: formatList(product.flavors) },
                { label: 'Size', value: product.size },
                { label: 'Weight', value: product.weight },
                { label: 'Servings', value: product.servings },
                { label: 'Ingredients', value: formatList(product.ingredients) },
              ]} />
              <TextBlock label="Nutrition Facts" value={formatNutrition(product.nutritionFacts)} />
              <TextBlock label="Warnings" value={formatList(product.warnings)} />
              <TextBlock label="Usage Instructions" value={formatList(product.usageInstructions)} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            {images[0] ? <img src={images[0]} alt={product.name} className="h-64 w-full object-cover" /> : null}
            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image) => <img key={image} src={image} alt={product.name} className="h-16 w-full rounded object-cover ring-1 ring-border-subtle" />)}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No product images uploaded.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <InfoRow label="Price" value={formatCurrency(product.price ?? 0)} strong />
              <InfoRow label="Discount Price" value={product.discountPrice ? formatCurrency(product.discountPrice) : '-'} />
              <InfoRow label="Revenue" value={product.revenue === undefined ? '-' : formatCurrency(product.revenue)} />
              <div className="border-t border-border-subtle pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Original Price History</p>
                {product.originalPriceHistory?.length ? product.originalPriceHistory.map((item, index) => (
                  <div key={`${item.price}-${item.date || item.createdAt || index}`}>
                    <InfoRow label={item.date || item.createdAt ? formatDate(item.date || item.createdAt || '') : `Entry ${index + 1}`} value={`${formatCurrency(item.price)}${item.note ? ` - ${item.note}` : ''}`} />
                  </div>
                )) : <p className="text-xs text-gray-500">No original price history.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <InfoRow label="Stock" value={String(product.stock ?? 0)} strong />
              <InfoRow label="Low Stock Threshold" value={formatValue(product.lowStockThreshold)} />
              <InfoRow label="Expiry Date" value={product.expiryDate ? formatDate(product.expiryDate) : '-'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <InfoRow label="Active" value={product.isActive === false ? 'No' : 'Yes'} />
              <InfoRow label="Featured" value={product.isFeatured || product.featured ? 'Yes' : 'No'} />
              <InfoRow label="Created" value={product.createdAt ? formatDate(product.createdAt) : '-'} />
              <InfoRow label="Updated" value={product.updatedAt ? formatDate(product.updatedAt) : '-'} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function DetailGrid({ items }: { items: Array<{ label: string; value: unknown }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</p>
          <p className="break-words text-gray-300">{formatValue(item.value)}</p>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="whitespace-pre-wrap break-words text-gray-300">{formatValue(value)}</p>
    </div>
  );
}

function InfoRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex justify-between gap-4"><span className="text-gray-500">{label}</span><span className={strong ? 'font-black text-white' : 'text-gray-300'}>{value}</span></div>;
}

function getProductImages(product: Product) {
  return [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
}

function getNamedValue(value: Product['brand'] | Product['category']) {
  return typeof value === 'string' ? value : value?.name || '-';
}

function formatList(value: Product['flavors'] | Product['ingredients'] | Product['warnings'] | Product['usageInstructions']) {
  return Array.isArray(value) ? value.join(', ') : value;
}

function formatNutrition(value: Product['nutritionFacts']) {
  if (!value || typeof value === 'string') return value;

  return Object.entries(value).map(([key, item]) => `${key}: ${String(item)}`).join('\n');
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
}
