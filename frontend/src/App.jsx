import React, { useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LandingView from './components/home/LandingView';
import Marquee from './components/home/Marquee';
import Footer from './components/layout/Footer';
import Signin from './components/layout/user/Signin';
import Signup from './components/layout/user/Signup';
import Profile from './components/layout/user/Profile';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const [authModal, setAuthModal] = useState(null);
  const { isInitializing } = useAuth();

  const openSignIn = useCallback(() => setAuthModal('signin'), []);
  const openSignUp = useCallback(() => setAuthModal('signup'), []);
  const closeAuthModal = useCallback(() => setAuthModal(null), []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Header
                onOpenSignIn={openSignIn}
                onOpenSignUp={openSignUp}
              />

              <div
                className={
                  authModal
                    ? 'blur-sm transition-all duration-300'
                    : 'transition-all duration-300'
                }
              >
                <LandingView />
                <Marquee />
                <Footer />
              </div>

              {authModal === 'signin' && (
                <Signin
                  onClose={closeAuthModal}
                  onSwitchToSignUp={openSignUp}
                />
              )}

              {authModal === 'signup' && (
                <Signup
                  onClose={closeAuthModal}
                  onSwitchToSignIn={openSignIn}
                />
              )}
            </div>
          }
        />

        <Route
          path="/add-profile"
          element={
            <div>
              <Header
                onOpenSignIn={openSignIn}
                onOpenSignUp={openSignUp}
              />
              <Profile />
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;