import type { Status } from './common';

export type Category = {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  status?: Status;
  isActive?: boolean;
};
