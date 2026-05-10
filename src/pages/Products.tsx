import React from 'react';
import { DataTable } from '../components/UI';
import { Package, Plus, MoreVertical, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const products = [
  { id: '1', name: 'Whey Protein Isolate', category: 'Protein', brand: 'Optimum Nutrition', price: 65.00, stock: 124, status: 'active' },
  { id: '2', name: 'Creatine Monohydrate', category: 'Strength', brand: 'MuscleTech', price: 29.99, stock: 45, status: 'active' },
  { id: '3', name: 'BCAA Energy Drink', category: 'Energy', brand: 'C4', price: 2.50, stock: 230, status: 'active' },
  { id: '4', name: 'ZMA Night Support', category: 'Recovery', brand: 'Now Foods', price: 18.00, stock: 0, status: 'out_of_stock' },
  { id: '5', name: 'Fat Burner Extreme', category: 'Weight Loss', brand: 'Animal', price: 42.00, stock: 12, status: 'active' },
  { id: '6', name: 'Multivitamin for Men', category: 'Health', brand: 'Vitacost', price: 24.00, stock: 89, status: 'discontinued' },
];

export function Products() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono tracking-widest uppercase mb-1">
            Storage <span className="text-gray-700">/</span> Inventory
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic underline decoration-brand/30 decoration-8 underline-offset-8 uppercase">
            Product Assets
          </h2>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand hover:bg-brand/80 text-white rounded-sm font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 italic">
          <Plus className="w-3.5 h-3.5" />
          <span>Register Asset</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search local database..." 
            className="w-full bg-panel border border-border-subtle rounded text-gray-300 pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-panel border border-border-subtle rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      <DataTable 
        title="Inventory Database"
        subtitle="Binary asset tracking for supplement stocks."
        columns={[
          { 
            key: 'name', 
            header: 'Resource Name',
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-bg-deep rounded border border-border-subtle flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs uppercase tracking-tight">{row.name}</p>
                  <p className="text-[10px] text-gray-600 font-mono italic">{row.brand}</p>
                </div>
              </div>
            )
          },
          { key: 'category', header: 'Category' },
          { 
            key: 'price', 
            header: 'Valuation',
            render: (row) => <span className="font-mono text-emerald-500 font-bold">${row.price.toFixed(2)}</span>
          },
          { 
            key: 'stock', 
            header: 'Availability',
            render: (row) => (
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                  row.stock > 50 ? "bg-emerald-500 shadow-emerald-500/50" :
                  row.stock > 0 ? "bg-amber-500 shadow-amber-500/50" :
                  "bg-brand shadow-brand/50"
                )}></span>
                <span className="font-mono text-[10px]">{row.stock} U_LOG</span>
              </div>
            )
          },
          { 
            key: 'status', 
            header: 'State',
            render: (row) => (
              <span className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter",
                row.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                row.status === 'out_of_stock' ? "bg-brand/10 text-brand border border-brand/20" :
                "bg-gray-500/10 text-gray-500 border border-gray-500/20"
              )}>
                {row.status.replace('_', ' ')}
              </span>
            )
          },
        ]} 
        data={products} 
        actions={() => (
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-500 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      />
    </div>
  );
}
