import React from 'react';

const MatchDashboard = ({ profile, onReset }) => {
  // Mock Data mimicking AI Matching Output
  const matches = [
    { id: 1, role: 'Data Entry Operator', company: 'Digital India Corp', location: 'Pune, Maharashtra', stipend: '₹5,000/mo', match: 98, highlight: 'Perfect match for your MS Office skills' },
    { id: 2, role: 'Retail Assistant', company: 'Future Retail', location: 'Remote', stipend: '₹4,500/mo', match: 85, highlight: 'Matches your communication skills' },
    { id: 3, role: 'Field Executive', company: 'AgriTech Ltd', location: 'Nashik, Maharashtra', stipend: '₹6,000/mo', match: 72, highlight: 'Location preference match' },
  ];

  return (
    <div className="mt-8 animate-fade-in delay-200">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4 bg-white/40 p-6 rounded-2xl glass-panel border-none shadow-sm">
         <div>
            <h2 className="text-3xl font-heading font-bold text-text-main mb-2">Recommended Matches</h2>
            <p className="text-text-muted font-medium flex items-center gap-2 flex-wrap">
               <span className="bg-slate-200/50 px-2 py-1 rounded text-sm">{profile.education}</span> • 
               <span className="bg-slate-200/50 px-2 py-1 rounded text-sm"><i data-lucide="map-pin" className="inline w-3 h-3"></i> {profile.location}</span> • 
               <span className="bg-slate-200/50 px-2 py-1 rounded text-sm">{profile.skills.length} skills</span>
            </p>
         </div>
         <button className="btn btn-secondary px-5 py-2 text-sm" onClick={onReset}>
            <i data-lucide="edit-3" className="w-4 h-4"></i> Edit Profile
         </button>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {matches.map((job) => (
          <div key={job.id} className="glass-panel p-6 flex flex-wrap gap-6 justify-between items-center bg-white/70 hover:bg-white/90">
             
             <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                   <h3 className="text-xl font-bold m-0 text-text-main">{job.role}</h3>
                   <span className={`
                     px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1
                     ${job.match > 90 ? 'bg-emerald-100/50 text-emerald-600' : job.match > 80 ? 'bg-amber-100/50 text-amber-600' : 'bg-blue-100/50 text-primary'}
                   `}>
                     <i data-lucide={job.match > 90 ? "zap" : "check"} className="w-3.5 h-3.5"></i>
                     {job.match}% AI Match
                   </span>
                </div>
                <div className="flex gap-6 text-text-muted text-sm mb-4 flex-wrap font-medium">
                   <span className="flex items-center gap-1.5"><i data-lucide="building" className="w-4 h-4 text-slate-400"></i> {job.company}</span>
                   <span className="flex items-center gap-1.5"><i data-lucide="map-pin" className="w-4 h-4 text-slate-400"></i> {job.location}</span>
                   <span className="flex items-center gap-1.5"><i data-lucide="banknote" className="w-4 h-4 text-slate-400"></i> {job.stipend}</span>
                </div>
                <p className="text-sm text-slate-700 flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50 w-fit">
                   <i data-lucide="info" className="w-4 h-4 text-primary"></i> <span className="font-medium">{job.highlight}</span>
                </p>
             </div>

             <div className="flex flex-col gap-3 w-full sm:max-w-[200px]">
                <button className="btn btn-success btn-full py-3 text-sm shadow-md hover:shadow-lg">Quick Apply</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchDashboard;
