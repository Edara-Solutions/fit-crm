import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardStats } from '../../components/crm/DashboardStats';
import { LowStockProducts } from '../../components/crm/LowStockProducts';
import { RecentOrders } from '../../components/crm/RecentOrders';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { bestSellingProducts, revenueChartData } from '../../data/mockDashboard';
import { mockOrders } from '../../data/mockOrders';
import { mockProducts } from '../../data/mockProducts';
import { formatCurrency } from '../../utils/formatCurrency';

export function DashboardPage() {
  const lowStock = mockProducts.filter((product) => product.stock <= product.lowStockThreshold);

  return (
    <PageContainer>
      <SectionHeader title="Overview" eyebrow="Dashboard" />
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Revenue Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A3141C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#A3141C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                  <Tooltip contentStyle={{ background: '#121212', border: '1px solid #262626', borderRadius: 4 }} formatter={(value) => formatCurrency(Number(value))} />
                  <Area dataKey="revenue" stroke="#A3141C" strokeWidth={3} fill="url(#revenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Best Selling Products</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {bestSellingProducts.map((product) => (
              <div key={product.name} className="border-l-2 border-brand bg-white/5 py-2 pl-4 pr-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase text-white">{product.name}</p>
                  <span className="font-mono text-[10px] text-emerald-400">{product.sold} sold</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-gray-500">{formatCurrency(product.revenue)} revenue</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><RecentOrders orders={mockOrders} /></div>
        <LowStockProducts products={lowStock} />
      </div>
    </PageContainer>
  );
}
