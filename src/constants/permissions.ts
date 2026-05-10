export const permissionModules = [
  'Users',
  'Customers',
  'Products',
  'Categories',
  'Brands',
  'Orders',
  'Coupons',
  'Inventory',
  'Reports',
  'Settings',
];

export const permissionActions = [
  'View',
  'Create',
  'Edit',
  'Delete',
  'Export',
  'Approve',
  'Change Status',
];

export const routePermissions = {
  dashboard: ['super_admin', 'admin', 'inventory_manager'],
  users: ['super_admin', 'admin'],
  customers: ['super_admin', 'admin', 'customer_support'],
  orders: ['super_admin', 'admin', 'order_manager'],
  payments: ['super_admin', 'admin', 'order_manager'],
  products: ['super_admin', 'admin', 'inventory_manager'],
  categories: ['super_admin', 'admin'],
  brands: ['super_admin', 'admin'],
  coupons: ['super_admin', 'admin'],
  inventory: ['super_admin', 'admin', 'inventory_manager'],
  reports: ['super_admin', 'admin'],
  settings: ['super_admin', 'admin', 'inventory_manager', 'order_manager', 'customer_support'],
} as const;

export type PermissionKey = keyof typeof routePermissions;
