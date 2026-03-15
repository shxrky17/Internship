import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingView from './components/LandingView';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Marquee from "./components/Marquee";
import AddDetails from "./components/AddDetails";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const [authModal, setAuthModal] = useState(null); // 'signin' or 'signup'
  const [toast, setToast] = useState(null); // { message, type }
  const { user, login, logout, isInitializing } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (email) => {
    login(email);
    setAuthModal(null);
    showToast(`Welcome back, ${email}!`, 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.', 'warning');
  };

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
                onOpenSignIn={() => setAuthModal('signin')}
                onOpenSignUp={() => setAuthModal('signup')}
                onLogout={handleLogout}
              />
              <div className={authModal ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
                
                <LandingView onOpenSignIn={() => setAuthModal('signin')} />
                <Marquee />
                <Footer />
              </div>

              {authModal === 'signin' && (
                <SignIn
                  onClose={() => setAuthModal(null)}
                  onSwitchToSignUp={() => setAuthModal('signup')}
                  onLoginSuccess={handleLoginSuccess}
                  onLoginError={(msg) => showToast(msg, 'error')}
                />
              )}
              {authModal === 'signup' && (
                <SignUp
                  onClose={() => setAuthModal(null)}
                  onSwitchToSignIn={() => setAuthModal('signin')}
                />
              )}
            </div>
          }
        />

        {/* Add Details route — protected */}
        <Route
          path="/add-details"
          element={
            <AddDetails
              onOpenSignIn={() => setAuthModal('signin')}
              showToast={showToast}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;
