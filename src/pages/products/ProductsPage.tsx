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
import { mockBrands } from '../../data/mockBrands';
import { mockCategories } from '../../data/mockCategories';
import { mockProducts } from '../../data/mockProducts';

export function ProductsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Product Assets" eyebrow="Storage / Inventory" action={<Link to="/products/new"><Button icon={<Plus className="h-4 w-4" />}>Register Asset</Button></Link>} />
      <FilterBar placeholder="Search products by name or SKU...">
        <Select><option>All Categories</option>{mockCategories.map((item) => <option key={item.id}>{item.name}</option>)}</Select>
        <Select><option>All Brands</option>{mockBrands.map((item) => <option key={item.id}>{item.name}</option>)}</Select>
        <Select><option>Stock Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></Select>
        <Select><option>Visibility</option><option>Active</option><option>Inactive</option><option>Featured</option></Select>
      </FilterBar>
      <div className="flex items-center justify-between">
        <Tabs tabs={['Table', 'Grid']} active="Table" />
        <div className="flex gap-2"><IconButton label="Table view"><List className="h-4 w-4" /></IconButton><IconButton label="Grid view"><Grid2X2 className="h-4 w-4" /></IconButton></div>
      </div>
      <Card><ProductTable products={mockProducts} /><Pagination /></Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockProducts.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
