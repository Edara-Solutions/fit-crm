export class ApiError extends Error {
  status: number;
  errors: string[] | Record<string, string[]> | undefined;

  constructor(message: string, status = 0, errors?: string[] | Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
