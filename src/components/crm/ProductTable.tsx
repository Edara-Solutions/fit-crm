import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { Table, type TableColumn } from '../ui/Table';
import { StatusBadge } from './StatusBadge';

const columns: TableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Product',
    render: (product) => (
      <div className="flex items-center gap-3">
        <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover ring-1 ring-border-subtle" />
        <div>
          <p className="font-bold uppercase text-white">{product.name}</p>
          <p className="font-mono text-[10px] text-gray-500">{product.sku}</p>
        </div>
      </div>
    ),
  },
  { key: 'brand', header: 'Brand' },
  { key: 'category', header: 'Category' },
  { key: 'price', header: 'Price', render: (product) => formatCurrency(product.price) },
  { key: 'discountPrice', header: 'Discount', render: (product) => product.discountPrice ? formatCurrency(product.discountPrice) : '-' },
  { key: 'stock', header: 'Stock', render: (product) => <span className="font-mono">{product.stock}</span> },
  { key: 'status', header: 'Status', render: (product) => <StatusBadge status={product.status} /> },
  { key: 'featured', header: 'Featured', render: (product) => product.featured ? <Badge tone="red">Featured</Badge> : <Badge>Standard</Badge> },
  { key: 'expiryDate', header: 'Expiry', render: (product) => formatDate(product.expiryDate) },
];

export function ProductTable({ products }: { products: Product[] }) {
  return <Table columns={columns} data={products} getRowKey={(product) => product.id} actions={() => <Dropdown />} />;
}
