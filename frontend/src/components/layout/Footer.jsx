import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Send 
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

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
    <footer className="footer-gradient pt-16 pb-8 px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                PM Internship
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Empowering India's youth through AI-driven internship matching in top companies across the nation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-slate-900 font-heading">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => navigate('/')} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Home</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('about')} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">About Us</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('gallery')} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Success Stories</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('contact')} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Contact Us</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-slate-900 font-heading">For Candidates</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Application Guide</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Eligibility Criteria</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">FAQ's</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Help Desk</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-slate-900 font-heading">Sign Up for Updates</h4>
            <p className="text-sm text-text-muted mb-4 font-medium">Stay informed about new internship opportunities.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm flex-1 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md group">
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs font-medium">
            © 2026 Prime Minister's Internship Scheme. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-text-muted hover:text-primary transition-colors text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-text-muted hover:text-primary transition-colors text-xs font-medium">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
