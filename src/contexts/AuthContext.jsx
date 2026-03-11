import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to load from local storage
  const loadInitialUser = () => {
    try {
      const stored = localStorage.getItem('cmc_incubator_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse user from local storage', e);
    }
    return null;
  };

  const [currentUser, setCurrentUser] = useState(loadInitialUser());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cmc_incubator_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cmc_incubator_user');
    }
  }, [currentUser]);

  const login = async (identifier, password) => {
    // identifier can be CEF or Email depending on role
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = USERS.find(u => 
      (u.cef === identifier || u.email === identifier) && u.password === password
    );

    if (user) {
      // Don't store password in state/localstorage normally, doing it here for mock is fine enough but let's strip it
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Identifiants incorrects' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole: currentUser?.role || null,
      isAuthenticated: !!currentUser,
      login,
      logout
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
