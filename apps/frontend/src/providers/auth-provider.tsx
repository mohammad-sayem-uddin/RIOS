'use client';

/**
 * RIOS — Auth Provider
 *
 * Owns authentication state (current user, session, auth actions) and restores
 * the session on mount. All network calls are delegated to `authService` so the
 * backend contract lives in exactly one place.
 */

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { getAccessToken, clearTokens, SESSION_EXPIRED_EVENT } from '@/lib/api-client';
import { authService } from '@/lib/auth-service';
import type { User, LoginRequest, RegisterRequest, RegisterResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [sessionId, setSessionId] = useState<string | null>(null);

  /** Fetch the current user from the backend, reconciling local token state. */
  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const data = await authService.getCurrentUser();
      if (data.authenticated && data.user) {
        setState({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      // api-client already attempted a token refresh; a throw here means the
      // session is unrecoverable. Clear to a clean unauthenticated state.
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  /** Authenticate with email/password. */
  const login = useCallback(async (credentials: LoginRequest) => {
    const data = await authService.login(credentials);
    setSessionId(data.session.id);
    setState({ user: data.user, isAuthenticated: true, isLoading: false });
  }, []);

  /** Register a new account (optimistic — see auth-service contract notes). */
  const register = useCallback(async (payload: RegisterRequest) => {
    const data = await authService.register(payload);
    if (data.tokens && data.user) {
      setSessionId(data.session?.id ?? null);
      setState({ user: data.user, isAuthenticated: true, isLoading: false });
    }
    return data;
  }, []);

  /** Revoke the session and clear local state. */
  const logout = useCallback(async () => {
    try {
      await authService.logout(sessionId ?? undefined);
    } finally {
      setSessionId(null);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [sessionId]);

  /** Restore session on mount. */
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  /**
   * Forced logout: the api-client broadcasts this when a token can no longer be
   * refreshed mid-session. Clear local state and route to the session-expired
   * screen so the user is never left staring at failing requests.
   */
  useEffect(() => {
    const handleSessionExpired = (): void => {
      clearTokens();
      setSessionId(null);
      setState({ user: null, isAuthenticated: false, isLoading: false });
      router.replace('/session-expired');
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return (): void => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
