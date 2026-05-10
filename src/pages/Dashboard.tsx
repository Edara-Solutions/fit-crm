import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  ArrowUpRight, 
  MoreVertical 
} from 'lucide-react';
import { StatCard, DataTable } from '../components/UI';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 4200 },
  { name: 'Tue', revenue: 5100 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 6200 },
  { name: 'Fri', revenue: 7500 },
  { name: 'Sat', revenue: 8400 },
  { name: 'Sun', revenue: 7800 },
];

const recentOrders = [
  { id: '#7281', customer: 'John Doe', product: 'Whey Protein 2kg', status: 'delivered', total: 59.99 },
  { id: '#7282', customer: 'Sarah Miller', product: 'BCAA 500g', status: 'shipped', total: 29.99 },
  { id: '#7283', customer: 'Mike Ross', product: 'Creatine Monohydrate', status: 'pending', total: 19.50 },
  { id: '#7284', customer: 'Emma Wilson', product: 'Pre-Workout Blast', status: 'delivered', total: 45.00 },
  { id: '#7285', customer: 'David Chen', product: 'Omega-3 Capsules', status: 'cancelled', total: 15.00 },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono tracking-widest uppercase mb-1">
          Root <span className="text-gray-700">/</span> Dashboard
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter italic underline decoration-brand/30 decoration-8 underline-offset-8">
          OVERVIEW
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Monthly Revenue" 
          value="$45,231.89" 
          change="+20.1%" 
          trend="up" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Total Orders" 
          value="1,234" 
          change="+12.5%" 
          trend="up" 
          icon={ShoppingCart} 
        />
        <StatCard 
          title="Session Traffic" 
          value="45.6K" 
          change="+5.2%" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Inventory Assets" 
          value="8,924" 
          change="-2.1%" 
          trend="down" 
          icon={Package} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel p-6 rounded border border-border-subtle shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-white text-sm tracking-tight uppercase">Revenue Performance</h4>
              <p className="text-[10px] text-gray-500 font-mono italic">DATA_STREAM: [REVENUE_V1]</p>
            </div>
            <select className="bg-bg-deep border border-border-subtle text-gray-400 font-mono text-[10px] px-2 py-1 outline-none rounded">
              <option>PERIOD: 7_DAYS</option>
              <option>PERIOD: 30_DAYS</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3141C" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#A3141C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121212', 
                    borderRadius: '4px', 
                    border: '1px solid #262626',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#F5F5F5' }}
                  cursor={{ stroke: '#A3141C', strokeWidth: 1 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'REVENUE']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#A3141C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-panel p-6 rounded border border-border-subtle shadow-sm flex flex-col">
          <h4 className="font-bold text-white text-sm tracking-tight uppercase mb-6">Quick Diagnostics</h4>
          <div className="space-y-6 flex-1">
            {[
              { label: 'Popular Brand', value: 'MuscleTech', sub: '24% LOAD' },
              { label: 'System Health', value: 'OPTIMAL', sub: 'SYNC_STABLE' },
              { label: 'Avg Order Value', value: '$67.64', sub: 'UP_TICK: 5.2%' },
              { label: 'Active Tasks', value: '12_QUEUE', sub: 'LOW_PRIO' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border-l-2 border-brand pl-4 bg-white/5 py-2 pr-2 rounded-r transition-colors hover:bg-white/10 group cursor-default">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{item.label}</p>
                  <p className="text-sm font-black text-white leading-tight uppercase italic">{item.value}</p>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">{item.sub}</p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-brand transition-colors" />
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 bg-brand text-white text-[10px] font-bold rounded-sm hover:bg-brand/80 transition-all uppercase tracking-widest italic shadow-lg shadow-brand/20">
            Full Analytics Run
          </button>
        </div>
      </div>

      <DataTable 
        title="Recent Order Stream" 
        subtitle="Live transactional monitoring system." 
        columns={[
          { key: 'id', header: 'Order ID' },
          { key: 'customer', header: 'Customer' },
          { key: 'product', header: 'Product' },
          { 
            key: 'status', 
            header: 'Status',
            render: (row) => (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[11px] font-bold uppercase",
                row.status === 'delivered' ? "bg-emerald-50 text-emerald-700" :
                row.status === 'pending' ? "bg-amber-50 text-amber-700" :
                row.status === 'shipped' ? "bg-blue-50 text-blue-700" :
                "bg-rose-50 text-rose-700"
              )}>
                {row.status}
              </span>
            )
          },
          { 
            key: 'total', 
            header: 'Total',
            render: (row) => `$${row.total.toFixed(2)}`
          },
        ]} 
        data={recentOrders}
        actions={() => <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><MoreVertical className="w-4 h-4" /></button>}
      />
    </div>
  );
}
