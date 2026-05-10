import type { ApiResponse, ListQueryParams } from '../types/api';
import { ApiError } from './apiError';

export const AUTH_TOKEN_KEY = 'befox_admin_token';
export const AUTH_EVENT = 'befox-auth-expired';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

type RequestOptions = {
  params?: ListQueryParams;
  body?: unknown;
  isFormData?: boolean;
};

function buildUrl(path: string, params?: ListQueryParams) {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || response.statusText || 'Request failed.';
    const errors = 'errors' in (payload ?? {}) ? (payload as { errors?: string[] | Record<string, string[]> }).errors : undefined;

    if (response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT));
    }

    throw new ApiError(message, response.status, errors);
  }

  return (payload as ApiResponse<T>).data;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers();

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !options.isFormData) headers.set('Content-Type', 'application/json');

  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers,
    body: options.body ? (options.isFormData ? (options.body as BodyInit) : JSON.stringify(options.body)) : undefined,
  });

  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, params?: ListQueryParams) => request<T>('GET', path, { params }),
  post: <T>(path: string, body?: unknown, options?: Pick<RequestOptions, 'isFormData'>) => request<T>('POST', path, { body, ...options }),
  patch: <T>(path: string, body?: unknown, options?: Pick<RequestOptions, 'isFormData'>) => request<T>('PATCH', path, { body, ...options }),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
