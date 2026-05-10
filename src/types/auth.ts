export type InternalRole = 'super_admin' | 'admin' | 'inventory_manager' | 'order_manager' | 'customer_support';

export type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: InternalRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: AuthUser;
  token: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
