import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Home, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Mic, 
  Languages, 
  LogOut 
} from 'lucide-react';

const Header = ({ onOpenSignIn, onOpenSignUp, onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      // Wait for navigation and then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="glass-nav">
      <div className="max-w-8xl mx-auto px-10 h-18 flex justify-between items-center py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl m-0 sm:text-base">PM Internship Scheme</h1>
              <p className="text-xs text-text-muted m-0">AI Matching Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div onClick={() => navigate('/')} className="flex items-center gap-2 text-black font-semibold text-base cursor-pointer hover:text-primary transition-all group">
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">Home</p>
            </div>

            <div onClick={() => handleScrollTo('about')} className="flex items-center gap-2 text-text-muted font-medium text-base cursor-pointer hover:text-primary transition-all group">
              <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Info className="w-4 h-4 group-hover:text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">About</p>
            </div>
            <div onClick={() => handleScrollTo('contact')} className="flex items-center gap-2 text-text-muted font-medium text-base cursor-pointer hover:text-primary transition-all group">
              <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4 group-hover:text-primary" />
              </div>
              <p className="m-0 group-hover:text-primary">Contact</p>
            </div>

            {user && (
              <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-black font-semibold text-base cursor-pointer hover:text-primary transition-all group">
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                <p className="m-0 group-hover:text-primary">Dashboard</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary" aria-label="Voice Search Search">
            <Mic className="w-5 h-5" />
          </button>
          <button className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary" aria-label="Change Language">
            <Languages className="w-5 h-5" />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2 p-1 rounded-full transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="bg-transparent border border-slate-200 text-text-muted cursor-pointer py-1.5 px-3 rounded-full text-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hidden sm:flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={onOpenSignIn} className="btn btn-signin hidden sm:inline-flex py-2 px-4">
                Sign In
              </button>
              <Button onClick={onOpenSignUp} variant="default" className="hidden sm:inline-flex py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full">
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
