import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8081/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Session not available');
      }

      const data = await response.json();
      const userData = {
        id: data.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email?.trim().toLowerCase() || '',
      };

      if (!userData.email) {
        throw new Error('Invalid user payload');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await fetchCurrentUser();
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    const userData = await fetchCurrentUser();
    if (!userData) {
      throw new Error('Login succeeded, but the session could not be loaded');
    }

    return userData;
  };

  const register = async (payload) => {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Registration failed. Email might already be in use.');
    }

    return response.json();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isInitializing,
    login,
    register,
    logout,
    refetchUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
