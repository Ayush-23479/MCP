import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';

const api: AxiosInstance = axios.create({
  baseURL: config.SPRING_API_BASE,
  timeout: 10000,
});

let storedToken: string | null = null;
let storedUserData: any = null;

function getAuthHeaders(): Record<string, string> | null {
  if (!storedToken) return null;
  return { Authorization: `Bearer ${storedToken}` };
}

export async function makeApiCall<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  requireAuth: boolean = true
): Promise<{ data: T | null; error: string | null }> {
  try {
    if (requireAuth && !storedToken) {
      return { data: null, error: 'Not authenticated. Please login first.' };
    }

    const headers = requireAuth ? getAuthHeaders() : {};
    const config = headers ? { headers } : {};
    let response;

    if (method === 'GET') {
      response = await api.get<T>(endpoint, config);
    } else if (method === 'POST') {
      response = await api.post<T>(endpoint, data, config);
    } else if (method === 'PUT') {
      response = await api.put<T>(endpoint, data, config);
    } else if (method === 'DELETE') {
      response = await api.delete<T>(endpoint, { ...config, data });
    } else {
      return { data: null, error: 'Invalid HTTP method' };
    }

    return { data: response.data as T, error: null };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = (error.response?.data as any)?.message || error.message;
      return { data: null, error: errorMessage };
    }
    return { data: null, error: 'An unexpected error occurred' };
  }
}

export function setToken(token: string, userData: any): void {
  storedToken = token;
  storedUserData = userData;
}

export function clearToken(): void {
  storedToken = null;
  storedUserData = null;
}

export function getUser(): any {
  return storedUserData;
}

export function isAuthenticated(): boolean {
  return !!storedToken;
}

export { api };