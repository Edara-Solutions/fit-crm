import type { Status } from './common';

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  status: Status;
};
