import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Home,
  Info,
  Phone,
  Mic,
  Languages,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/button';

const Header = ({ onOpenSignIn, onOpenSignUp }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [hasProfile, setHasProfile] = useState(null);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        alert('Logout failed');
        return;
      }

      if (logout) {
        logout();
      }

      setHasProfile(null);
      alert('Logged out ✅');
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed', err);
      alert('Logout failed');
    }
  };

  const handleCheckSession = async () => {
    try {
      const response = await fetch('http://localhost:8081/me', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        setHasProfile(null);
        window.alert('No active session from /me');
        return;
      }

      const data = await response.json();

      const profileResponse = await fetch('http://localhost:8081/get-profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (profileResponse.status === 200) {
        setHasProfile(true);
      } else if (profileResponse.status === 404) {
        setHasProfile(false);
      } else {
        setHasProfile(null);
        console.error('Unexpected response from /get-profile:', profileResponse.status);
      }

      if (data?.email) {
        window.alert(`Spring Boot /me: ${data.email}`);
      } else {
        window.alert('Spring Boot /me responded without user data');
      }
    } catch (error) {
      console.error('Failed to call Spring Boot', error);
      setHasProfile(null);
      window.alert('Failed to call Spring Boot');
    }
  };

  const checkProfileStatus = async () => {
    try {
      const response = await fetch('http://localhost:8081/get-profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        setHasProfile(true);
      } else if (response.status === 404) {
        setHasProfile(false);
      } else {
        setHasProfile(null);
      }
    } catch (error) {
      console.error('Profile check failed', error);
      setHasProfile(null);
    }
  };

  useEffect(() => {
    if (user) {
      checkProfileStatus();
    } else {
      setHasProfile(null);
    }
  }, [user]);

  return (
    <header className="glass-nav">
      <div className="max-w-8xl mx-auto px-10 h-18 flex justify-between items-center py-4">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl m-0 sm:text-base">PM Internship Scheme</h1>
              <p className="text-xs text-text-muted m-0">AI Matching Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-black font-semibold text-base cursor-pointer hover:text-primary transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">Home</p>
            </div>

            <div
              onClick={() => handleScrollTo('about')}
              className="flex items-center gap-2 text-text-muted font-medium text-base cursor-pointer hover:text-primary transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Info className="w-4 h-4 group-hover:text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">About</p>
            </div>

            <div
              onClick={() => handleScrollTo('contact')}
              className="flex items-center gap-2 text-text-muted font-medium text-base cursor-pointer hover:text-primary transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4 group-hover:text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">Contact</p>
            </div>

            {user && (
              <div>
                {hasProfile === true && (
                  <button
                    onClick={() => navigate('/add-profile')}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Update Profile
                  </button>
                )}

                {hasProfile === false && (
                  <button
                    onClick={() => navigate('/add-profile')}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Add Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary"
            aria-label="Voice Search Search"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary"
            aria-label="Change Language"
          >
            <Languages className="w-5 h-5" />
          </button>

          <Button variant="outline" onClick={handleCheckSession}>
            Check /me
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 rounded-full transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-transparent border border-slate-200 text-text-muted cursor-pointer py-1.5 px-3 rounded-full text-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hidden sm:flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Button variant="secondary" onClick={onOpenSignIn}>
                Sign In
              </Button>
              <Button variant="outline" onClick={onOpenSignUp}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;