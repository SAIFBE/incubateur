import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

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
      const stored = localStorage.getItem('cmc_incubator_user');
      const token = localStorage.getItem('cmc_incubator_token');
      if (stored && token) {
        return { user: normalizeUserRole(JSON.parse(stored)), token };
      }
      localStorage.removeItem('cmc_incubator_user');
      localStorage.removeItem('cmc_incubator_token');
    } catch (e) {
      console.error('Failed to parse user from local storage', e);
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
        localStorage.removeItem('cmc_incubator_user');
        localStorage.removeItem('cmc_incubator_token');
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
      localStorage.setItem('cmc_incubator_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cmc_incubator_user');
      localStorage.removeItem('cmc_incubator_token');
    }
  }, [currentUser, loading]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      // Determine if it's admin (email) or stagiaire (cef)
      const isEmail = identifier.includes('@');

      const payload = isEmail
        ? { email: identifier, password: password }
        : { cef: identifier, password: password };

      const response = await api.post('/login', payload);

      const { token, user } = response.data;

      if (token && user) {
        const normalizedUser = normalizeUserRole(user);

        localStorage.setItem('cmc_incubator_token', token);
        setCurrentUser(normalizedUser);
        setLoading(false);
        return { success: true, user: normalizedUser };
      }

      setLoading(false);
      return { success: false, message: 'Format de rÃ©ponse invalide' };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Identifiants incorrects ou erreur rÃ©seau';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      // Optional: call backend logout to invalidate token
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('cmc_incubator_user');
      localStorage.removeItem('cmc_incubator_token');
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
