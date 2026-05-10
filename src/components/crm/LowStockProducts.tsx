import type { Product } from '../../types/product';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function LowStockProducts({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Low Stock Products</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between border-l-2 border-brand bg-white/5 py-2 pl-4 pr-3">
            <div>
              <p className="text-xs font-bold uppercase text-white">{product.name}</p>
              <p className="font-mono text-[10px] text-gray-500">{product.sku}</p>
            </div>
            <span className="font-mono text-xs text-[#E9514B]">{product.stock} left</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
