import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  UserPen, 
  GraduationCap, 
  Sparkles, 
  Contact, 
  Map, 
  FileText, 
  FileCheck, 
  FileBadge 
} from 'lucide-react';

const ProfileDashboard = ({ user, profile, isInitializing, onOpenSignIn, showToast }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return; 

    if (!user) {
      showToast('Please login to view your dashboard.', 'warning');
      navigate('/');
      onOpenSignIn();
    } else if (!profile) {
      showToast('No profile found. Please add your details first.', 'info');
      navigate('/add-details');
    }
  }, [user, profile, navigate, onOpenSignIn, showToast, isInitializing]);



  const sectionClass = "glass-panel p-6 rounded-2xl border border-white/40 shadow-sm mb-6";
  const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block";
  const valueClass = "text-slate-800 font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {(user.firstName || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {user.firstName ? `${user.firstName} ${user.lastName}'s Profile` : 'Professional Profile'}
              </h1>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/add-details')}
            className="btn btn-primary px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <UserPen className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About Me
              </h3>
              <p className="text-slate-600 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                "{profile.bio}"
              </p>
            </div>

            {/* Education */}
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className={labelClass}>Qualification</span>
                  <p className={valueClass}>{profile.highestQualification}</p>
                </div>
                <div>
                  <span className={labelClass}>Field of Study</span>
                  <p className={valueClass}>{profile.fieldOfStudy}</p>
                </div>
                <div>
                  <span className={labelClass}>Institution</span>
                  <p className={valueClass}>{profile.clgName}</p>
                </div>
                <div>
                  <span className={labelClass}>Batch of</span>
                  <p className={valueClass}>{profile.gradYear}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Skills & Languages
              </h3>
              <div className="space-y-4">
                <div>
                  <span className={labelClass}>Technical & Soft Skills</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skills ? profile.skills.split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10">
                        {skill.trim()}
                      </span>
                    )) : <span className="text-slate-400 text-xs italic">No skills added</span>}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>Languages</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.languages ? profile.languages.split(',').map((lang, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                        {lang.trim()}
                      </span>
                    )) : <span className="text-slate-400 text-xs italic">No languages added</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Contact className="w-5 h-5 text-secondary" />
                Contact Info
              </h3>
              <div className="space-y-4">
                <div>
                  <span className={labelClass}>Phone</span>
                  <p className={valueClass}>{profile.phoneNumber}</p>
                </div>
                <div>
                  <span className={labelClass}>Date of Birth</span>
                  <p className={valueClass}>{profile.dob}</p>
                </div>
                <div>
                  <span className={labelClass}>Gender</span>
                  <p className={valueClass}>{profile.gender}</p>
                </div>
              </div>
            </div>

            <div className={sectionClass}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-amber-500" />
                Location
              </h3>
              <div className="space-y-4">
                <div>
                  <span className={labelClass}>District</span>
                  <p className={valueClass}>{profile.district}</p>
                </div>
                <div>
                  <span className={labelClass}>State</span>
                  <p className={valueClass}>{profile.state}</p>
                </div>
              </div>
            </div>

            {profile.cv && (
              <a 
                href={`http://localhost:8080${profile.cv}`} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                View CV / Resume
              </a>
            )}

            {profile.marksheet10 && (
              <a 
                href={`http://localhost:8080${profile.marksheet10}`} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <FileCheck className="w-4 h-4 inline-block mr-2 text-primary" />
                10th Marksheet
              </a>
            )}

            {profile.marksheet12ITI && (
              <a 
                href={`http://localhost:8080${profile.marksheet12ITI}`} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <FileBadge className="w-4 h-4 inline-block mr-2 text-secondary" />
                12th / ITI Marksheet
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
