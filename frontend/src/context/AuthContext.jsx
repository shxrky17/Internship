import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const { email, profile: profileData } = await response.json();
        setUser({ email });
        setProfile(profileData);
        return { email, profile: profileData };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  };

  const checkSession = async () => {
    try {
      await fetchProfile();
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email) => {
    setUser({ email });
    await fetchProfile();
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (newProfileData) => {
    setProfile(newProfileData);
    // Optionally refetch from server to be sure
    await fetchProfile();
  };

  const value = {
    user,
    profile,
    isInitializing,
    login,
    logout,
    updateProfile,
    refetchProfile: fetchProfile,
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
