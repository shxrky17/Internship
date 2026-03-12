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

  return (
    <div>
      <Header 
        onOpenSignIn={() => setAuthModal('signin')} 
        onOpenSignUp={() => setAuthModal('signup')} 
      />
      
      {/* Conditionally render LandingView OR blur it? The requirement asks to blur the landing view, so the modal overlay will naturally cover it. */}
      {/* If you wanted to blur the specific background element strictly, we could add a dynamic class here, but overlay handles it elegantly. */}
      <div className={authModal ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <LandingView />
        <Marquee/>
      </div>

      {/* Render Authentication Modals */}
      {authModal === 'signin' && (
        <SignIn 
          onClose={() => setAuthModal(null)} 
          onSwitchToSignUp={() => setAuthModal('signup')} 
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
