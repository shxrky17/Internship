import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingView from './components/LandingView';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Marquee from "./components/Marquee";
import AddDetails from "./components/AddDetails";
import ProfileDashboard from "./components/ProfileDashboard";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const [authModal, setAuthModal] = useState(null); // 'signin' or 'signup'
  const [toast, setToast] = useState(null); // { message, type }
  const { user, profile, login, logout, isInitializing } = useAuth();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleLoginSuccess = useCallback((email) => {
    login(email);
    setAuthModal(null);
    showToast(`Welcome back, ${email}!`, 'success');
  }, [login, showToast]);

  const handleLogout = useCallback(() => {
    logout();
    showToast('You have been logged out.', 'warning');
  }, [logout, showToast]);

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
      {/* Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <div>
              <Header
                onOpenSignIn={openSignIn}
                onOpenSignUp={openSignUp}
                onLogout={handleLogout}
              />
              <div className={authModal ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
                
                <LandingView onOpenSignIn={openSignIn} />
              </div>
              <Marquee />
              <Footer />

              {authModal === 'signin' && (
                <SignIn
                  onClose={closeAuthModal}
                  onSwitchToSignUp={openSignUp}
                  onLoginSuccess={handleLoginSuccess}
                  onLoginError={(msg) => showToast(msg, 'error')}
                />
              )}
              {authModal === 'signup' && (
                <SignUp
                  onClose={closeAuthModal}
                  onSwitchToSignIn={openSignIn}
                />
              )}
            </div>
          }
        />

        {/* User Dashboard route — protected */}
        <Route
          path="/dashboard"
          element={
            <div>
              <Header
                onOpenSignIn={openSignIn}
                onOpenSignUp={openSignUp}
                onLogout={handleLogout}
              />
              <ProfileDashboard
                user={user}
                profile={profile}
                isInitializing={isInitializing}
                onOpenSignIn={openSignIn}
                showToast={showToast}
              />
              <Footer />
            </div>
          }
        />

        {/* Add Details route — protected */}
        <Route
          path="/add-details"
          element={
            <AddDetails
              onOpenSignIn={openSignIn}
              showToast={showToast}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;
