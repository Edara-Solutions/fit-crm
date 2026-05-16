import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid2X2, List, Plus, RotateCcw } from 'lucide-react';
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
import type { ListQueryParams } from '../../types/api';

export function ProductsPage() {
  const { products, pagination, loading, error, fetchProducts } = useProductsStore();
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const hasFilters = Boolean(search.trim() || categoryFilter || brandFilter || stockStatusFilter || visibilityFilter);

  const getQueryParams = useCallback((page = 1): ListQueryParams => ({
    page,
    limit: pagination.limit,
    search: search.trim() || undefined,
    category: categoryFilter || undefined,
    brand: brandFilter || undefined,
    stockStatus: stockStatusFilter || undefined,
    isActive: visibilityFilter === 'active' ? true : visibilityFilter === 'inactive' ? false : undefined,
    isFeatured: visibilityFilter === 'featured' ? true : undefined,
  }), [brandFilter, categoryFilter, pagination.limit, search, stockStatusFilter, visibilityFilter]);

  useEffect(() => {
    void fetchBrands();
    void fetchCategories();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProducts(getQueryParams(1));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts, getQueryParams]);

  function clearFilters() {
    setSearch('');
    setCategoryFilter('');
    setBrandFilter('');
    setStockStatusFilter('');
    setVisibilityFilter('');
  }

  return (
    <PageContainer>
      <SectionHeader title="Product Assets" eyebrow="Storage / Inventory" action={<Link to="/products/new"><Button icon={<Plus className="h-4 w-4" />}>Register Asset</Button></Link>} />
      <FilterBar placeholder="Search products by name or SKU..." value={search} onChange={(event) => setSearch(event.target.value)}>
        <Select aria-label="Category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>)}
        </Select>
        <Select aria-label="Brand" value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
          <option value="">All brands</option>
          {brands.map((item) => <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>)}
        </Select>
        {/* <Select aria-label="Stock status" value={stockStatusFilter} onChange={(event) => setStockStatusFilter(event.target.value)}>
          <option value="">All stock statuses</option>
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </Select> */}
        <Select aria-label="Visibility" value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
          <option value="">All visibility</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </Select>
        <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} disabled={!hasFilters} onClick={clearFilters}>Reset</Button>
      </FilterBar>
      {/* <div className="flex items-center justify-between">
        <Tabs tabs={['Table', 'Grid']} active="Table" />
        <div className="flex gap-2"><IconButton label="Table view"><List className="h-4 w-4" /></IconButton><IconButton label="Grid view"><Grid2X2 className="h-4 w-4" /></IconButton></div>
      </div> */}
      {error && <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">{error}<Button className="ml-3" variant="secondary" onClick={() => void fetchProducts(getQueryParams(pagination.page))}>Retry</Button></div>}
      <Card>{loading ? <div className="p-5"><LoadingSkeleton /></div> : <ProductTable products={products} />}<Pagination page={pagination.page} totalPages={pagination.pages || 1} onPageChange={(page) => void fetchProducts(getQueryParams(page))} /></Card>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product._id || product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div> */}
    </PageContainer>
  );
}
