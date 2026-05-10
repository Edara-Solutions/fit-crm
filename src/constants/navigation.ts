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

export const navigationItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Orders', href: '/orders', icon: ShoppingCart },
  { title: 'Products', href: '/products', icon: Package },
  { title: 'Categories', href: '/categories', icon: Tags },
  { title: 'Brands', href: '/brands', icon: Building2 },
  { title: 'Customers', href: '/customers', icon: UserCircle },
  { title: 'Users / Staff', href: '/users', icon: Users },
  { title: 'Coupons', href: '/coupons', icon: Ticket },
  { title: 'Inventory', href: '/inventory', icon: Boxes },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
];
