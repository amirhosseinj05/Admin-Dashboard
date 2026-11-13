import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * AuthContext - holds the logged-in user and exposes login/logout.
 * Session persistence:
 *   - "Remember me" checked  -> saved in localStorage  (survives browser restart)
 *   - otherwise              -> saved in sessionStorage (closed with the tab)
 * Swap the fake check inside `login()` for a real POST /auth/login call later.
 */
const AuthContext = createContext(null);

const USER_KEY = 'Amir-user';
const EMAIL_KEY = 'Amir-remembered-email';

/** Demo account accepted by the fake login (showed on the login page). */
export const DEMO_CREDENTIALS = { email: 'admin@amir.com', password: '123456' };

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // true once the stored session is read

  // Restore the session once when the app boots (avoids a redirect flash).
  useEffect(() => {
    setUser(readStoredSession());
    setReady(true);
  }, []);

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  /**
   * @param {{email: string, password: string, remember: boolean}} credentials
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  const login = useCallback(async ({ email, password, remember }) => {
    // Simulate a network round-trip to an auth endpoint.
    await new Promise((resolve) => setTimeout(resolve, 600));

    /* ------------------------------------------------------------------
     * TODO(real API): replace this block with a real request, e.g.
     *   const res = await fetch(`${API_BASE}/auth/login`, {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({ email, password }),
     *   });
     *   if (!res.ok) return { ok: false, error: 'Invalid email or password' };
     *   const data = await res.json();  // { token, user }
     * ------------------------------------------------------------------ */
    const isValid =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (!isValid) return { ok: false, error: 'Invalid email or password. Please try again.' };

    const sessionUser = {
      name: 'Sara Mohammadi',
      email: DEMO_CREDENTIALS.email,
      role: 'Administrator',
      avatarText: 'SM',
    };

    clearSession();
    if (remember) {
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(EMAIL_KEY, email);
    } else {
      sessionStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      localStorage.removeItem(EMAIL_KEY);
    }

    setUser(sessionUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  /** Email captured by "Remember me" - used to pre-fill the login form. */
  const rememberedEmail = useMemo(() => {
    try {
      return localStorage.getItem(EMAIL_KEY) || '';
    } catch {
      return '';
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout, rememberedEmail }),
    [user, ready, login, logout, rememberedEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Custom hook: const { user, login, logout } = useAuth(); */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
