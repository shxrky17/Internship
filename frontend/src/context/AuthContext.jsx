import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const cachedProfile = localStorage.getItem('cached_profile');
    try {
      return cachedProfile ? JSON.parse(cachedProfile) : null;
    } catch (e) {
      console.error('Error parsing cached profile:', e);
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return null;
        }

        const { email, firstName, lastName, profile: profileData } = data || {};
        if (email) {
          const userData = { 
            email: email.trim().toLowerCase(),
            firstName: firstName || '',
            lastName: lastName || ''
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          if (profileData) {
            // Cache full profile for immediate dashboard rendering
            localStorage.setItem('cached_profile', JSON.stringify(profileData));
          } else {
             localStorage.removeItem('cached_profile');
          }
          setProfile(profileData || null);
          return { ...userData, profile: profileData || null };
        }
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
    const userData = { email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    await fetchProfile();
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cached_profile');
  };

  const updateProfile = async (newProfileData) => {
    setProfile(prev => ({ ...(prev || {}), ...newProfileData }));
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
