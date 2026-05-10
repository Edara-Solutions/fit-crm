export const roles = [
  'Super Admin',
  'Admin',
  'Inventory Manager',
  'Order Manager',
  'Customer Support',
  'Content Manager',
] as const;

export const INTERNAL_ROLES = ['super_admin', 'admin', 'inventory_manager', 'order_manager', 'customer_support'] as const;

export const roleLabels: Record<(typeof INTERNAL_ROLES)[number], string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  inventory_manager: 'Inventory Manager',
  order_manager: 'Order Manager',
  customer_support: 'Customer Support',
};
