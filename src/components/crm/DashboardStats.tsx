import { AlertTriangle, ClipboardCheck, Package, ShoppingCart, Ticket, TrendingUp, Truck, Users, Wallet } from 'lucide-react';
import type { DashboardOverview } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatNumber } from '../../utils/formatNumber';
import { StatCard } from './StatCard';

export function DashboardStats({ overview }: { overview: DashboardOverview }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Revenue" value={formatCurrency(overview.totalRevenue)} icon={TrendingUp} />
      <StatCard title="Total Shipping Fees" value={formatCurrency(overview.totalShippingFee)} icon={Truck} />
      <StatCard title="Today's Orders" value={overview.todaysOrders} icon={ShoppingCart} />
      <StatCard title="Pending Orders" value={overview.pendingOrders} icon={AlertTriangle} />
      <StatCard title="Awaiting Review" value={overview.awaitingReviewOrders} icon={ClipboardCheck} />
      <StatCard title="Total Customers" value={formatNumber(overview.totalCustomers)} icon={Users} />
      <StatCard title="Products In Stock" value={overview.productsInStock} icon={Package} />
      <StatCard title="Low Stock Alerts" value={overview.lowStockAlerts} icon={AlertTriangle} />
      <StatCard title="Active Coupons" value={overview.activeCoupons} icon={Ticket} />
      <StatCard title="Monthly Revenue" value={formatCurrency(overview.monthlyRevenue)} icon={Wallet} />
      <StatCard title="Monthly Shipping Fees" value={formatCurrency(overview.monthlyShippingFee)} icon={Truck} />
    </div>
  );
}
