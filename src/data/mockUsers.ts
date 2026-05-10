import type { StaffUser } from '../types/user';

export const mockUsers: StaffUser[] = [
  { id: 'usr-1', name: 'Hassan Ali', email: 'hassan@be-fox.com', role: 'Super Admin', status: 'active', lastLogin: '2026-05-10', createdAt: '2025-08-01' },
  { id: 'usr-2', name: 'Salma Nabil', email: 'salma@be-fox.com', role: 'Order Manager', status: 'active', lastLogin: '2026-05-09', createdAt: '2025-10-18' },
  { id: 'usr-3', name: 'Karim Fathy', email: 'karim@be-fox.com', role: 'Inventory Manager', status: 'active', lastLogin: '2026-05-08', createdAt: '2026-01-12' },
  { id: 'usr-4', name: 'Laila Mostafa', email: 'laila@be-fox.com', role: 'Customer Support', status: 'inactive', lastLogin: '2026-04-21', createdAt: '2026-02-04' },
];
