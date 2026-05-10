import { AlertTriangle, Package, ShoppingCart, Ticket, TrendingUp, Users, Wallet } from 'lucide-react';
import { dashboardStats } from '../../data/mockDashboard';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatNumber } from '../../utils/formatNumber';
import { StatCard } from './StatCard';

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Revenue" value={formatCurrency(dashboardStats.totalRevenue)} change="+18.4%" trend="up" icon={TrendingUp} />
      <StatCard title="Today's Orders" value={dashboardStats.todayOrders} change="+6" trend="up" icon={ShoppingCart} />
      <StatCard title="Pending Orders" value={dashboardStats.pendingOrders} change="-2" trend="down" icon={AlertTriangle} />
      <StatCard title="Total Customers" value={formatNumber(dashboardStats.totalCustomers)} change="+12.5%" trend="up" icon={Users} />
      <StatCard title="Products In Stock" value={dashboardStats.productsInStock} change="stable" icon={Package} />
      <StatCard title="Low Stock Alerts" value={dashboardStats.lowStockAlerts} change="+3" trend="down" icon={AlertTriangle} />
      <StatCard title="Active Coupons" value={dashboardStats.activeCoupons} change="campaign live" icon={Ticket} />
      <StatCard title="Monthly Profit" value={formatCurrency(dashboardStats.monthlyProfit)} change="+22.1%" trend="up" icon={Wallet} />
    </div>
  );
}
