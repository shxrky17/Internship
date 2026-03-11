const App = () => {
  const [currentView, setCurrentView] = React.useState('landing');
  const [userProfile, setUserProfile] = React.useState({
    education: '',
    location: '',
    skills: []
  });

  const handleStartMatching = () => {
    setCurrentView('profile');
  };

  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      <Header />
      <main className="container animate-fade-in delay-100">
        {currentView === 'landing' && <LandingView onStart={handleStartMatching} />}
        {currentView === 'profile' && <ProfileWizard onComplete={handleProfileComplete} />}
        {currentView === 'dashboard' && <MatchDashboard profile={userProfile} onReset={() => setCurrentView('landing')} />}
      </main>
    </div>
  );
};

// Sub-components definitions

const Header = () => {
  return (
    <header className="glass-nav">
      <div className="container header-wrapper">
        <div className="logo-section">
          <div className="logo-circle">
            <i data-lucide="briefcase"></i>
          </div>
          <div className="logo-text">
            <h1>PM Internship Scheme</h1>
            <p>AI Matching Portal</p>
          </div>
        </div>
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Voice Search Search">
            <i data-lucide="mic"></i>
          </button>
          <button className="icon-btn" aria-label="Change Language">
            <i data-lucide="languages"></i>
          </button>
          <button className="btn btn-secondary hide-mobile">
             Login
          </button>
        </div>
      </div>
    </header>
  );
};

const LandingView = ({ onStart }) => {
  return (
    <div className="hero-section glass-panel" style={{ marginTop: '2rem', padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          Find Your Perfect Internship Match
        </h2>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Stop guessing. Let our AI analyze your skills, location, and education to recommend the best opportunities across India in seconds.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
           <button onClick={onStart} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
             <i data-lucide="sparkles"></i> Find Matches Now
           </button>
           <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
             <i data-lucide="search"></i> Browse All Rolls
           </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
           <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <i data-lucide="target" style={{ color: 'var(--primary)', marginBottom: '1rem', width: '32px', height: '32px' }}></i>
              <h3 style={{ marginBottom: '0.5rem' }}>Smart Matching</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get personalized recommendations based on your unique profile.</p>
           </div>
           <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <i data-lucide="map-pin" style={{ color: 'var(--secondary)', marginBottom: '1rem', width: '32px', height: '32px' }}></i>
              <h3 style={{ marginBottom: '0.5rem' }}>Local Opportunities</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Find internships near your home or preferred district easily.</p>
           </div>
           <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <i data-lucide="check-circle" style={{ color: '#f59e0b', marginBottom: '1rem', width: '32px', height: '32px' }}></i>
              <h3 style={{ marginBottom: '0.5rem' }}>Simple Process</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No complex forms. Just tell us what you know, and we do the hard work.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileWizard = ({ onComplete }) => {
  const [step, setStep] = React.useState(1);
  const [profile, setProfile] = React.useState({ education: '', location: '', skills: [] });

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
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>
         <span style={{ color: step >= 1 ? 'var(--primary)' : '' }}>1. Education</span>
         <span style={{ color: step >= 2 ? 'var(--primary)' : '' }}>2. Location</span>
         <span style={{ color: step >= 3 ? 'var(--primary)' : '' }}>3. Skills</span>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>
        {step === 1 && "What is your highest education level?"}
        {step === 2 && "Where do you want to work?"}
        {step === 3 && "What are your top skills?"}
      </h2>

      {step === 1 && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {eduList.map(edu => (
            <button 
              key={edu}
              className={`btn ${profile.education === edu ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', padding: '1rem' }}
              onClick={() => setProfile({...profile, education: edu})}
            >
              {edu}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
           <input 
             type="text" 
             placeholder="Enter State or District (e.g., Maharashtra or Pune)"
             className="glass-panel"
             style={{ width: '100%', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem' }}
             value={profile.location}
             onChange={(e) => setProfile({...profile, location: e.target.value})}
           />
           <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => setProfile({...profile, location: 'Current Location'})}>
             <i data-lucide="navigation"></i> Use Current Location
           </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {skillsList.map(skill => (
            <button 
              key={skill}
              className={`btn ${profile.skills.includes(skill) ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleSkill(skill)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setStep(Math.max(1, step - 1))}
          style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
        >
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={
            (step === 1 && !profile.education) || 
            (step === 2 && !profile.location) ||
            (step === 3 && profile.skills.length === 0)
          }
        >
          {step === 3 ? 'Find Matches' : 'Next'} <i data-lucide="arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

const MatchDashboard = ({ profile, onReset }) => {
  // Mock Data mimicking AI Matching Output
  const matches = [
    { id: 1, role: 'Data Entry Operator', company: 'Digital India Corp', location: 'Pune, Maharashtra', stipend: '₹5,000/mo', match: 98, highlight: 'Perfect match for your MS Office skills' },
    { id: 2, role: 'Retail Assistant', company: 'Future Retail', location: 'Remote', stipend: '₹4,500/mo', match: 85, highlight: 'Matches your communication skills' },
    { id: 3, role: 'Field Executive', company: 'AgriTech Ltd', location: 'Nashik, Maharashtra', stipend: '₹6,000/mo', match: 72, highlight: 'Location preference match' },
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
         <div>
            <h2 style={{ fontSize: '1.875rem' }}>Your Recommended Matches</h2>
            <p style={{ color: 'var(--text-muted)' }}>Analyzed based on {profile.education} • {profile.location} • {profile.skills.length} skills</p>
         </div>
         <button className="btn btn-secondary" onClick={onReset}>
            <i data-lucide="edit-3"></i> Edit Profile
         </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
        {matches.map((job) => (
          <div key={job.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
             
             <div style={{ flex: '1 1 250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                   <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{job.role}</h3>
                   <span style={{ 
                     background: job.match > 90 ? 'rgba(16, 185, 129, 0.1)' : job.match > 80 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                     color: job.match > 90 ? 'var(--match-high)' : job.match > 80 ? 'var(--match-med)' : 'var(--primary)',
                     padding: '0.25rem 0.75rem', 
                     borderRadius: '9999px', 
                     fontSize: '0.875rem', 
                     fontWeight: '700',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.25rem'
                   }}>
                     <i data-lucide={job.match > 90 ? "zap" : "check"} style={{ width: '14px', height: '14px' }}></i>
                     {job.match}% AI Match
                   </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i data-lucide="building" style={{ width: '16px' }}></i> {job.company}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i data-lucide="map-pin" style={{ width: '16px' }}></i> {job.location}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><i data-lucide="banknote" style={{ width: '16px' }}></i> {job.stipend}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <i data-lucide="info" style={{ width: '16px', color: 'var(--primary)' }}></i> {job.highlight}
                </p>
             </div>

             <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '200px' }}>
                <button className="btn btn-success btn-full">Quick Apply</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
