/**
 * API Client for ApnoSe REST Backend
 * Handles standard JSON fetch, automatic Bearer JWT injection, and refresh token rotation
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class ApiClient {
  private getAccessToken(): string | null {
    return localStorage.getItem('apnose_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('apnose_refresh_token');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('apnose_access_token', accessToken);
    localStorage.setItem('apnose_refresh_token', refreshToken);
  }

  public clearTokens(): void {
    localStorage.removeItem('apnose_access_token');
    localStorage.removeItem('apnose_refresh_token');
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let res = await fetch(url, { ...options, headers });

      // Handle 401 token expiration and automatic refresh
      if (res.status === 401 && this.getRefreshToken() && !endpoint.includes('/auth/')) {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.getRefreshToken() }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            this.setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            res = await fetch(url, { ...options, headers });
          }
        } else {
          this.clearTokens();
        }
      }

      const json: ApiResponse<T> = await res.json();
      return json;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'नेटवर्क त्रुटि (Network error). कृपया कनेक्शन जांचें।',
        error: { code: 'NETWORK_ERROR' },
      };
    }
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString()
      : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
