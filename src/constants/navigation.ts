import {
  BarChart3,
  Boxes,
  Building2,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Ticket,
  UserCircle,
  Users,
} from 'lucide-react';
import type { PermissionKey } from './permissions';

export const navigationItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { title: 'Orders', href: '/orders', icon: ShoppingCart, permission: 'orders' },
  { title: 'Products', href: '/products', icon: Package, permission: 'products' },
  { title: 'Categories', href: '/categories', icon: Tags, permission: 'categories' },
  { title: 'Brands', href: '/brands', icon: Building2, permission: 'brands' },
  { title: 'Customers', href: '/customers', icon: UserCircle, permission: 'customers' },
  { title: 'Users / Staff', href: '/users', icon: Users, permission: 'users' },
  { title: 'Coupons', href: '/coupons', icon: Ticket, permission: 'coupons' },
  { title: 'Inventory', href: '/inventory', icon: Boxes, permission: 'inventory' },
  { title: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports' },
  { title: 'Settings', href: '/settings', icon: Settings, permission: 'settings' },
] satisfies Array<{ title: string; href: string; icon: typeof LayoutDashboard; permission: PermissionKey }>;
