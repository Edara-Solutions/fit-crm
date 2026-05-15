import { useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardStats } from '../../components/crm/DashboardStats';
import { PageContainer } from '../../components/layout/PageContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Select } from '../../components/ui/Select';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { RevenuePeriod } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatCurrency';

export function DashboardPage() {
  const { overview, revenue, bestSellingProducts, period, loading, error, fetchDashboard, setPeriod } = useDashboardStore();

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !overview) {
    return <PageContainer><SectionHeader title="Overview" eyebrow="Dashboard" /><LoadingSkeleton lines={10} /></PageContainer>;
  }

  return (
    <PageContainer>
      <SectionHeader title="Overview" eyebrow="Dashboard" />
      {error && (
        <div className="border border-brand/40 bg-brand/10 p-4 text-sm text-red-100">
          {error}
          <Button className="ml-3" variant="secondary" onClick={() => void fetchDashboard()}>Retry</Button>
        </div>
      )}
      {overview && <DashboardStats overview={overview} />}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>Revenue Performance</CardTitle><Select className="w-24 cursor-pointer" value={period} onChange={(event) => void setPeriod(event.target.value as RevenuePeriod)}><option value="year">Year</option><option value="month">Month</option><option value="week">Week</option></Select></div></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue}>
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
            {bestSellingProducts.length === 0 && <p className="text-sm text-gray-500">No best-selling products yet.</p>}
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
    </PageContainer>
  );
}
