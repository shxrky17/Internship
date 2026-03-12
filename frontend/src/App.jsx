import React, { useState } from 'react';
import Header from './components/Header';
import LandingView from './components/LandingView';
import ProfileWizard from './components/ProfileWizard';
import MatchDashboard from './components/MatchDashboard';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Marquee from "./components/Marquee";

const App = () => {
  const [authModal, setAuthModal] = useState(null); // 'signin' or 'signup'
  const [user, setUser] = useState(null); // logged-in user info

  const handleLoginSuccess = (email) => {
    setUser({ email });
    setAuthModal(null);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <Header 
        onOpenSignIn={() => setAuthModal('signin')} 
        onOpenSignUp={() => setAuthModal('signup')} 
        user={user}
        onLogout={handleLogout}
      />
      
      <div className={authModal ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <LandingView />
        <Marquee/>
      </div>

      {/* Render Authentication Modals */}
      {authModal === 'signin' && (
        <SignIn 
          onClose={() => setAuthModal(null)} 
          onSwitchToSignUp={() => setAuthModal('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {authModal === 'signup' && (
        <SignUp 
          onClose={() => setAuthModal(null)} 
          onSwitchToSignIn={() => setAuthModal('signin')} 
        />
      )}
    </div>
  );
};

export default App;
