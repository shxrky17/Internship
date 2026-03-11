import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const LandingView = ({ onStart }) => {
  return (
    <div className="glass-panel max-w-7xl mx-auto mt-8 py-12 px-8 text-center bg-white/60">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-4 text-primary font-heading font-extrabold tracking-tight">
          Find Your Perfect Internship Match
        </h2>
        <p className="text-lg md:text-xl text-text-muted mb-8 font-medium">
          Stop guessing. Let our AI analyze your skills, location, and education to recommend the best opportunities across India in seconds.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap mb-12">
           <button onClick={onStart} className="btn btn-primary text-lg px-8 py-4">
             <i data-lucide="sparkles" className="w-5 h-5"></i> Find Matches Now
           </button>
           <button className="btn btn-secondary text-lg px-8 py-4">
             <i data-lucide="search" className="w-5 h-5"></i> Browse All Rolls
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div className="glass-panel p-6">
              <i data-lucide="target" className="text-primary mb-4 w-8 h-8"></i>
              <h3 className="mb-2 text-xl font-bold">Smart Matching</h3>
              <p className="text-sm text-text-muted">Get personalized recommendations based on your unique profile.</p>
           </div>
           <div className="glass-panel p-6">
              <i data-lucide="map-pin" className="text-secondary mb-4 w-8 h-8"></i>
              <h3 className="mb-2 text-xl font-bold">Local Opportunities</h3>
              <p className="text-sm text-text-muted">Find internships near your home or preferred district easily.</p>
           </div>
           <div className="glass-panel p-6">
              <i data-lucide="check-circle" className="text-amber-500 mb-4 w-8 h-8"></i>
              <h3 className="mb-2 text-xl font-bold">Simple Process</h3>
              <p className="text-sm text-text-muted">No complex forms. Just tell us what you know, and we do the hard work.</p>
            
           </div>
           
        </div>
        
      </div>
    </div>
    
  );
};

export default LandingView;
