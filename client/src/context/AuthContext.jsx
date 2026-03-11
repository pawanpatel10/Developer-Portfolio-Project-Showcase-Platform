import { createContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';

const AUTH_STORAGE_KEY = 'devlink_auth';

export const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch (error) {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);
  const [loading, setLoading] = useState(Boolean(getStoredAuth().token));

  useEffect(() => {
    if (!auth.token) {
      setLoading(false);
      return;
    }

    const hydrateAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        const nextAuth = { token: auth.token, user };
        setAuth(nextAuth);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth({ token: null, user: null });
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, [auth.token]);

  const login = (payload) => {
    setAuth(payload);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (user) => {
    const nextAuth = { ...auth, user };
    setAuth(nextAuth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token && auth.user),
      loading,
      login,
      logout,
      updateUser,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
