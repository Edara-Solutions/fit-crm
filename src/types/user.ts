import type { Status } from './common';

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Inventory Manager'
  | 'Order Manager'
  | 'Customer Support'
  | 'Content Manager';

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  lastLogin: string;
  createdAt: string;
};
