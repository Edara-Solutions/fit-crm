import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

export function ProductCard({ product }: { product: Product }) {
  const brand = typeof product.brand === 'string' ? product.brand : product.brand?.name || '-';
  const category = typeof product.category === 'string' ? product.category : product.category?.name || '-';

  return (
    <Card className="overflow-hidden">
      <img src={product.image || product.images?.[0] || '/vite.svg'} alt={product.name} className="h-36 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-sm font-black uppercase text-white">{product.name}</h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">{brand} / {category}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-emerald-400">{formatCurrency(product.discountPrice ?? product.price)}</span>
          <StatusBadge status={product.status || (product.stock === 0 ? 'out_of_stock' : product.isActive === false ? 'inactive' : 'active')} />
        </div>
      </div>
    </Card>
  );
}
