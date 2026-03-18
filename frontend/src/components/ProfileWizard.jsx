import React, { useState } from 'react';
import { Navigation, Check, ArrowRight } from 'lucide-react';

const ProfileWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ education: '', location: '', skills: [] });

  const skillsList = ['MS Office', 'Data Entry', 'Accounting', 'Communication', 'Technical', 'Retail', 'Agriculture'];
  const eduList = ['10th Pass', '12th Pass', 'ITI/Diploma', 'Graduate', 'Post Graduate'];

  const toggleSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(profile);
  };

  return (
    <div className="glass-panel max-w-2xl mx-auto my-8 p-8 bg-white/60">
      <div className="flex justify-between mb-8 text-sm text-text-muted font-semibold">
         <span className={step >= 1 ? 'text-primary' : ''}>1. Education</span>
         <span className={step >= 2 ? 'text-primary' : ''}>2. Location</span>
         <span className={step >= 3 ? 'text-primary' : ''}>3. Skills</span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-text-main">
        {step === 1 && "What is your highest education level?"}
        {step === 2 && "Where do you want to work?"}
        {step === 3 && "What are your top skills?"}
      </h2>

      {step === 1 && (
        <div className="grid gap-3">
          {eduList.map(edu => (
            <button 
              key={edu}
              className={`btn ${profile.education === edu ? 'btn-primary' : 'btn-secondary'} justify-start p-4 text-base transition-colors hover:bg-opacity-90`}
              onClick={() => setProfile({...profile, education: edu})}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${profile.education === edu ? 'border-white' : 'border-slate-300'}`}>
                    {profile.education === edu && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                 </div>
                 {edu}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
           <input 
             type="text" 
             placeholder="Enter State or District (e.g., Maharashtra or Pune)"
             className="glass-panel w-full p-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/80 transition-shadow"
             value={profile.location}
             onChange={(e) => setProfile({...profile, location: e.target.value})}
           />
           <button className="btn btn-secondary justify-start p-4 hover:bg-slate-100 transition-colors" onClick={() => setProfile({...profile, location: 'Current Location'})}>
             <Navigation className="w-5 h-5 text-text-muted" /> Use Current Location
           </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-wrap gap-3">
          {skillsList.map(skill => (
            <button 
              key={skill}
              className={`btn ${profile.skills.includes(skill) ? 'btn-primary' : 'btn-secondary'} px-4 py-2 text-sm font-medium transition-transform active:scale-95`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
              {profile.skills.includes(skill) && <Check className="w-4 h-4 ml-1" />}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-10 pt-6 border-t border-slate-200/50">
        <button 
          className={`btn btn-secondary px-6 py-2 ${step === 1 ? 'invisible' : 'visible'}`} 
          onClick={() => setStep(Math.max(1, step - 1))}
        >
          Back
        </button>
        <button 
          className="btn btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]" 
          onClick={handleNext}
          disabled={
            (step === 1 && !profile.education) || 
            (step === 2 && !profile.location) ||
            (step === 3 && profile.skills.length === 0)
          }
        >
          {step === 3 ? 'Find Matches' : 'Next'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProfileWizard;
