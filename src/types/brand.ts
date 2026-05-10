import type { Status } from './common';

export type Brand = {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  logo?: string;
  productCount?: number;
  status?: Status;
  isActive?: boolean;
};
