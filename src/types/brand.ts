import type { Status } from './common';

export type Brand = {
  id: string;
  name: string;
  description: string;
  logo: string;
  productCount: number;
  status: Status;
};
