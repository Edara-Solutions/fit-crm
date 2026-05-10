import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <img src={product.image} alt={product.name} className="h-36 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-sm font-black uppercase text-white">{product.name}</h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">{product.brand} / {product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-emerald-400">{formatCurrency(product.discountPrice ?? product.price)}</span>
          <StatusBadge status={product.status} />
        </div>
      </div>
    </Card>
  );
}
