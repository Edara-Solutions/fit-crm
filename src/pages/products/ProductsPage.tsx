import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid2X2, List, Plus } from 'lucide-react';
import { FilterBar } from '../../components/crm/FilterBar';
import { ProductCard } from '../../components/crm/ProductCard';
import { ProductTable } from '../../components/crm/ProductTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { IconButton } from '../../components/ui/IconButton';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { useBrandsStore } from '../../stores/brandsStore';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { useProductsStore } from '../../stores/productsStore';

export function ProductsPage() {
  const { products, pagination, loading, error, fetchProducts } = useProductsStore();
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    void fetchProducts();
    void fetchBrands();
    void fetchCategories();
  }, [fetchBrands, fetchCategories, fetchProducts]);

  // TODO: Replace local filtering with backend search params when product search is documented.
  const visibleProducts = useMemo(() => products.filter((product) => `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase())), [products, search]);

  return (
    <PageContainer>
      <SectionHeader title="Product Assets" eyebrow="Storage / Inventory" action={<Link to="/products/new"><Button icon={<Plus className="h-4 w-4" />}>Register Asset</Button></Link>} />
      <FilterBar placeholder="Search products by name or SKU..." value={search} onChange={(event) => setSearch(event.target.value)}>
        <Select><option>All Categories</option>{categories.map((item) => <option key={item._id || item.id}>{item.name}</option>)}</Select>
        <Select><option>All Brands</option>{brands.map((item) => <option key={item._id || item.id}>{item.name}</option>)}</Select>
        <Select><option>Stock Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></Select>
        <Select><option>Visibility</option><option>Active</option><option>Inactive</option><option>Featured</option></Select>
      </FilterBar>
      <div className="flex items-center justify-between">
        <Tabs tabs={['Table', 'Grid']} active="Table" />
        <div className="flex gap-2"><IconButton label="Table view"><List className="h-4 w-4" /></IconButton><IconButton label="Grid view"><Grid2X2 className="h-4 w-4" /></IconButton></div>
      </div>
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchProducts()}>Retry</Button></div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <ProductTable products={visibleProducts} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchProducts({ page, limit: pagination.limit })} /></Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <div key={product._id || product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
