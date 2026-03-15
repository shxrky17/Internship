import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GalleryCarousel from './GalleryCarousel';
import Marquee from './Marquee';

const LandingView = ({ onOpenSignIn }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleApplyClick = () => {
    if (!user) {
      onOpenSignIn();
    } else {
      navigate('/add-details');
    }
  };

  const handleProfileCardClick = () => {
    if (!user) {
      onOpenSignIn();
    } else {
      navigate('/add-details');
    }
  };

  return (
    <div className="glass-panel overflow-hidden max-w-7xl mx-auto mt-8 py-12 px-8 text-center bg-white/60">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-4 text-primary font-heading font-extrabold tracking-tight">
          Find Your Perfect Internship Match
        </h2>
        <p className="text-lg md:text-xl text-text-muted mb-8 font-medium">
          Stop guessing. Let our AI analyze your skills, location, and education to recommend the best opportunities across India in seconds.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <button onClick={handleApplyClick} className="btn btn-primary text-lg px-8 py-4">
            <i data-lucide="sparkles" className="w-5 h-5"></i> 
            Find Matches Now
          </button>
          <button className="btn btn-secondary text-lg px-8 py-4">
            <i data-lucide="search" className="w-5 h-5"></i> Browse All Rolls
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
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
          <div
            className="glass-panel p-6 cursor-pointer hover:ring-2 hover:ring-primary/40 hover:shadow-lg transition-all duration-200 group"
            onClick={handleProfileCardClick}
          >
            
            <i data-lucide="user-pen" className="text-purple-500 mb-4 w-8 h-8 group-hover:scale-110 transition-transform"></i>
            <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">
              Update Your Profile
            </h3>
            <p className="text-sm text-text-muted">Add your education, skills, and location to get better matches.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Add Details <i data-lucide="arrow-right" className="w-3 h-3"></i>
            </span>
          </div>
        </div>

      </div>
<Marquee />
      {/* About Section */}
      <div id="about" className="mt-24 pt-12 border-t border-slate-200/60 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="flex-1">
            <h2 className="text-3xl font-heading font-bold mb-6 text-primary flex items-center gap-2">
              <i data-lucide="info" className="w-8 h-8"></i>
              About the Scheme
            </h2>
            <p className="text-text-muted mb-4 leading-relaxed">
              The Prime Minister's Internship Scheme aims to provide 1 crore internship opportunities in top companies over 5 years. This portal leverages advanced AI matching to ensure that students are paired with internships that perfectly align with their education, skills, and local preferences.
            </p>
            <p className="text-text-muted leading-relaxed">
              Our mission is to bridge the gap between academic learning and industry requirements, empowering the youth of India with practical experience and professional growth.
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="glass-panel p-2 bg-gradient-to-br from-primary/10 to-secondary/10">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop" 
                alt="About Internship" 
                className="rounded-xl shadow-md grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="mt-24 pt-12 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-3xl font-heading font-bold mb-10 text-primary text-center">Success Gallery</h2>
        <GalleryCarousel />
      </div>

      {/* Contact Section */}
      <div id="contact" className="mt-24 pt-12 mb-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-10 text-primary text-center">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-panel p-8 text-center hover:shadow-xl transition-all border-b-4 border-primary">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="mail" className="text-primary w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Email Us</h3>
            <p className="text-sm text-text-muted">support@pminternship.gov.in</p>
          </div>
          <div className="glass-panel p-8 text-center hover:shadow-xl transition-all border-b-4 border-secondary">
            <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="phone" className="text-secondary w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Call Support</h3>
            <p className="text-sm text-text-muted">+91 012-3456789</p>
          </div>
          <div className="glass-panel p-8 text-center hover:shadow-xl transition-all border-b-4 border-amber-400">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="map-pin" className="text-amber-500 w-6 h-6"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Visit Office</h3>
            <p className="text-sm text-text-muted">New Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
