export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: string[] | Record<string, string[]>;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type PaginatedData<T> = {
  items?: T[];
  pagination: Pagination;
};

export type ListQueryParams = {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
};

export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 12,
  total: 0,
  pages: 0,
};
