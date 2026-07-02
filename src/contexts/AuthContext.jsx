import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const AUTH_USER_KEY = 'cmc_incubator_user';
const AUTH_TOKEN_KEY = 'cmc_incubator_token';

const clearStoredSession = () => {
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);

  // Clean old persistent sessions from previous versions.
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const normalizeUserRole = (user) => {
  if (!user) return user;

  const isReadOnlyAdmin = user.role === 'admin_viewer';

  return {
    ...user,
    backendRole: user.role,
    role: user.role === 'stagiaire' ? 'trainee' : isReadOnlyAdmin ? 'admin' : user.role,
    isReadOnlyAdmin,
  };
};

export const AuthProvider = ({ children }) => {
  const loadStoredSession = () => {
    try {
      const stored = sessionStorage.getItem(AUTH_USER_KEY);
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);

      if (stored && token) {
        return { user: normalizeUserRole(JSON.parse(stored)), token };
      }
      clearStoredSession();
    } catch (e) {
      console.error('Failed to parse user from session storage', e);
      clearStoredSession();
    }
    return { user: null, token: null };
  };

  const [storedSession] = useState(loadStoredSession);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(storedSession.token));

  useEffect(() => {
    if (!storedSession.token) return;

    api.get('/me')
      .then((response) => {
        setCurrentUser(normalizeUserRole(response.data.user));
      })
      .catch(() => {
        clearStoredSession();
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, [storedSession.token]);

  useEffect(() => {
    const handleUnauthorized = () => setCurrentUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (currentUser) {
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    } else {
      clearStoredSession();
    }
  }, [currentUser, loading]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const isEmail = identifier.includes('@');

      const payload = isEmail
        ? { email: identifier, password: password }
        : { cef: identifier, password: password };

      const response = await api.post('/login', payload);

      const { token, user } = response.data;

      if (token && user) {
        const normalizedUser = normalizeUserRole(user);

        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        setCurrentUser(normalizedUser);
        setLoading(false);
        return { success: true, user: normalizedUser };
      }

      setLoading(false);
      return { success: false, message: 'Format de reponse invalide' };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Identifiants incorrects ou erreur reseau';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setCurrentUser(null);
      clearStoredSession();
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole: currentUser?.role || null,
      isAuthenticated: !!currentUser,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
