/**
 * RIOS — Centralized API Client
 *
 * Handles all HTTP communication with the backend.
 * Features: JWT auth headers, automatic token refresh, error normalization.
 *
 * Backend runs on port 3000; Next.js rewrites proxy /api/* requests.
 */

/** Standard API response shape from the backend */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    correlationId?: string;
    timestamp?: string;
  };
}

/** Normalized API error */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly correlationId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
}

const TOKEN_STORAGE_KEY = 'rios_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'rios_refresh_token';

/** Event broadcast when a session can no longer be refreshed (forced logout). */
export const SESSION_EXPIRED_EVENT = 'rios:session-expired';

/** Notify the app that the session has expired so it can clear state and redirect. */
function broadcastSessionExpired(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

/** Store tokens in localStorage */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

/** Retrieve access token */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/** Retrieve refresh token */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

/** Clear stored tokens */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

/** Attempt to refresh the access token using the refresh token */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const json = (await res.json()) as ApiResponse<{
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    }>;

    if (json.success && json.data) {
      setTokens(json.data.tokens.accessToken, json.data.tokens.refreshToken);
      return json.data.tokens.accessToken;
    }

    clearTokens();
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

/** Build URL with query parameters */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

/** Core fetch wrapper */
async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = buildUrl(path, options.params);

  let res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options.signal,
  });

  // Attempt token refresh on 401
  if (res.status === 401 && !options.skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: options.signal,
      });
    } else {
      // Refresh failed on a request that had a token — the session is no longer
      // valid. Broadcast so the AuthProvider can clear state and redirect.
      broadcastSessionExpired();
    }
  }

  // Handle non-JSON responses
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('UNKNOWN_ERROR', `Request failed with status ${res.status}`, res.status);
    }
    return undefined as T;
  }

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.error?.code ?? 'UNKNOWN_ERROR',
      json.error?.message ?? `Request failed with status ${res.status}`,
      res.status,
      json.meta?.correlationId,
    );
  }

  return json.data as T;
}

/** Public API client methods */
export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options);
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
};
