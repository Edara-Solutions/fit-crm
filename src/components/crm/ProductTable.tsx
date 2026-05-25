import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Product',
    render: (product) => (
      <div className="flex items-center gap-3">
        <img src={product.image || product.images?.[0] || '/vite.svg'} alt={product.name} className="h-10 w-10 rounded object-cover ring-1 ring-border-subtle" />
        <div>
          <p className="font-bold uppercase text-white">{product.name}</p>
          <p className="font-mono text-[10px] text-gray-500">{product.sku}</p>
        </div>
      </div>
    ),
  },
  { key: 'brand', header: 'Brand', render: (product) => typeof product.brand === 'string' ? product.brand : product.brand?.name || '-' },
  { key: 'category', header: 'Category', render: (product) => typeof product.category === 'string' ? product.category : product.category?.name || '-' },
  { key: 'price', header: 'Price', render: (product) => formatCurrency(product.price) },
  { key: 'discountPrice', header: 'Discount', render: (product) => product.discountPrice ? formatCurrency(product.discountPrice) : '-' },
  { key: 'revenue', header: 'Revenue', render: (product) => product.revenue === undefined ? '-' : formatCurrency(product.revenue) },
  { key: 'stock', header: 'Stock', render: (product) => <span className="font-mono">{product.stock}</span> },
  { key: 'status', header: 'Status', render: (product) => <StatusBadge status={product.status || (product.stock === 0 ? 'out_of_stock' : product.isActive === false ? 'inactive' : 'active')} /> },
  { key: 'featured', header: 'Featured', render: (product) => product.featured || product.isFeatured ? <Badge tone="red">Featured</Badge> : <Badge>Standard</Badge> },
  { key: 'expiryDate', header: 'Expiry', render: (product) => product.expiryDate ? formatDate(product.expiryDate) : '-' },
];

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table
      columns={columns}
      data={products}
      getRowKey={(product) => product._id || product.id}
      actions={(product) => (
        <Dropdown>
          <Link to={`/products/${product.slug || product._id || product.id}`}>
            <Button variant="secondary" icon={<Eye className="h-4 w-4" />}>Details</Button>
          </Link>
        </Dropdown>
      )}
    />
  );
}
