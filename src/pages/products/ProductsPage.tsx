import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RotateCcw } from 'lucide-react';
import { FilterBar } from '../../components/crm/FilterBar';
import { ProductCard } from '../../components/crm/ProductCard';
import { ProductTable } from '../../components/crm/ProductTable';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
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
  const [flavorFilter, setFlavorFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [stackFilter, setStackFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const hasFilters = Boolean(search.trim() || categoryFilter || brandFilter || flavorFilter || visibilityFilter || stackFilter || minPrice || maxPrice || sort !== '-createdAt');

  const getQueryParams = useCallback((page = 1): ListQueryParams => ({
    page,
    limit: pagination.limit,
    search: search.trim() || undefined,
    category: categoryFilter || undefined,
    brand: brandFilter || undefined,
    flavor: flavorFilter.trim() || undefined,
    isActive: visibilityFilter === 'active' ? true : visibilityFilter === 'inactive' ? false : undefined,
    isFeatured: visibilityFilter === 'featured' ? true : undefined,
    isStack: stackFilter === 'stack' ? true : stackFilter === 'single' ? false : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
  }), [brandFilter, categoryFilter, flavorFilter, maxPrice, minPrice, pagination.limit, search, sort, stackFilter, visibilityFilter]);

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
    setFlavorFilter('');
    setVisibilityFilter('');
    setStackFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSort('-createdAt');
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
        <Input aria-label="Flavor" placeholder="Flavor" value={flavorFilter} onChange={(event) => setFlavorFilter(event.target.value)} />
        <Select aria-label="Visibility" value={visibilityFilter} onChange={(event) => setVisibilityFilter(event.target.value)}>
          <option value="">All visibility</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </Select>
        <Select aria-label="Stack type" value={stackFilter} onChange={(event) => setStackFilter(event.target.value)}>
          <option value="">All product types</option>
          <option value="single">Single products</option>
          <option value="stack">Stacks</option>
        </Select>
        <Input aria-label="Minimum price" placeholder="Min price" inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        <Input aria-label="Maximum price" placeholder="Max price" inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        <Select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="price">Price low to high</option>
          <option value="-price">Price high to low</option>
          <option value="-revenue">Revenue high to low</option>
          <option value="name">Name A-Z</option>
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
