import React from 'react';
import { Button } from '@/components/ui/button';



const Header = ({ onOpenSignIn, onOpenSignUp }) => {
  return (
    <header className="glass-nav">
      <div className="max-w-8xl mx-auto px-10 h-18 flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
            <i data-lucide="briefcase" className="w-5 h-5"></i>
          </div>
          <div>
            <h1 className="text-xl m-0 sm:text-base">PM Internship Scheme</h1>
            <p className="text-xs text-text-muted m-0">AI Matching Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary" aria-label="Voice Search Search">
            <i data-lucide="mic" className="w-5 h-5"></i>
          </button>
          <button className="bg-transparent border-none text-text-muted cursor-pointer p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:bg-slate-100 hover:text-primary" aria-label="Change Language">
            <i data-lucide="languages" className="w-5 h-5"></i>
          </button>
          <button onClick={onOpenSignIn} className="btn btn-signin hidden sm:inline-flex py-2 px-4 ">
             Sign In
          </button>
          <Button onClick={onOpenSignUp} variant="default" className="hidden sm:inline-flex py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full">
             Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
