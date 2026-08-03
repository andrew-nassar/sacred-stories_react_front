import { apiFetch as centralApiFetch } from '../api/apiClient';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return centralApiFetch<T>(endpoint, options);
}
