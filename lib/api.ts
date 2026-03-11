// The API base URL — set via EXPO_PUBLIC_API_URL in your .env file (dev)
// or in eas.json env blocks (EAS builds).
// Android emulator loopback (10.0.2.2) is the default for local dev.
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://10.0.2.2:8080';


// ─── Token Storage ────────────────────────────────────────────────────────────
// We keep token in memory for quick access; SecureStore is the persistent backing store
let _token: string | null = null;

export function setToken(token: string | null) {
  _token = token;
}

export function getToken(): string | null {
  return _token;
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const err = await response.json() as any;
      message = err.message ?? err.error ?? message;
    } catch {
      // ignore parse failure
    }
    throw new Error(message);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ─── Convenience Methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => apiRequest<T>(path, 'GET'),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, 'POST', body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>(path, 'PUT', body),
  delete: <T>(path: string) => apiRequest<T>(path, 'DELETE'),
};
