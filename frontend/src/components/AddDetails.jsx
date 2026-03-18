import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  GraduationCap, 
  Zap, 
  Save, 
  Check, 
  Upload, 
  FileCheck 
} from 'lucide-react';

const AddDetails = ({ onOpenSignIn, showToast }) => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    dob: '',
    phone: '',
    gender: '',
    district: '',
    state: '',
    cv: '',
    qualification: '',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    skills: '',
    languages: '',
    bio: '',
  });

  const [files, setFiles] = useState({
    resume: null,
    marksheet10: null,
    marksheet12ITI: null,
  });

  const [uploadingStates, setUploadingStates] = useState({
    resume: { idle: true },
    marksheet10: { idle: true },
    marksheet12ITI: { idle: true },
  });

  useEffect(() => {
    // Auth Guard
    if (!user) {
      showToast('Please login first to add profile details.', 'warning');
      navigate('/');
      onOpenSignIn();
    }
  }, [user, navigate, onOpenSignIn, showToast]);

  useEffect(() => {
    // Pre-fill form if profile exists (Edit Mode)
    if (profile) {
      setForm({
        dob: profile.dob || '',
        phone: profile.phoneNumber || '',
        gender: profile.gender || '',
        district: profile.district || '',
        state: profile.state || '',
        cv: profile.cv || '',
        qualification: profile.highestQualification || '',
        fieldOfStudy: profile.fieldOfStudy || '',
        institution: profile.clgName || '',
        graduationYear: profile.gradYear || '',
        skills: profile.skills || '',
        languages: profile.languages || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const fieldName = e.target.name;
    const file = e.target.files[0];
    setFiles({ ...files, [fieldName]: file });
    // Reset status when file changes
    setUploadingStates(prev => ({ ...prev, [fieldName]: { idle: true } }));
  };

  const handleInstantUpload = async (fieldName) => {
    const file = files[fieldName];
    if (!file) {
      showToast('Please select a file first.', 'warning');
      return;
    }

    setUploadingStates(prev => ({ ...prev, [fieldName]: { loading: true } }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', fieldName);

    try {
      const response = await fetch('http://localhost:8080/upload-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        showToast('Document uploaded successfully!', 'success');
        setUploadingStates(prev => ({ ...prev, [fieldName]: { success: true } }));
        // Optionally update the context profile path
        const filePath = await response.text();
        
        // Sync form state
        if (fieldName === 'resume') setForm(prev => ({ ...prev, cv: filePath }));
        
        // Merge with existing profile or create new shell
        const updatedProfile = { ...(profile || {}) };
        if (fieldName === 'resume') updatedProfile.cv = filePath;
        else if (fieldName === 'marksheet10') updatedProfile.marksheet10 = filePath;
        else if (fieldName === 'marksheet12ITI') updatedProfile.marksheet12ITI = filePath;
        updateProfile(updatedProfile);
      } else {
        const error = await response.text();
        showToast(`Upload failed: ${error}`, 'error');
        setUploadingStates(prev => ({ ...prev, [fieldName]: { idle: true } }));
      }
    } catch (error) {
      showToast('Connection error during upload.', 'error');
      setUploadingStates(prev => ({ ...prev, [fieldName]: { idle: true } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      dob: form.dob,
      phoneNumber: form.phone,
      gender: form.gender,
      district: form.district,
      state: form.state,
      cv: form.cv,
      highestQualification: form.qualification,
      fieldOfStudy: form.fieldOfStudy,
      clgName: form.institution,
      gradYear: form.graduationYear,
      skills: form.skills,
      languages: form.languages,
      bio: form.bio,
    };

    const formData = new FormData();
    formData.append('profile', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    
    if (files.resume) formData.append('resume', files.resume);
    if (files.marksheet10) formData.append('marksheet10', files.marksheet10);
    if (files.marksheet12ITI) formData.append('marksheet12ITI', files.marksheet12ITI);

    try {
      const response = await fetch('http://localhost:8080/add-details', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        showToast(profile ? 'Profile updated successfully!' : 'Profile created successfully!', 'success');
        // Merge current form data with existing profile to ensure paths aren't lost
        await updateProfile({ ...(profile || {}), ...payload });
        navigate('/');
      } else {
        const errorText = await response.text();
        showToast(`Failed to save: ${errorText || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showToast('Cannot connect to server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';
  const sectionHeadingClass =
    'text-base font-bold text-primary mb-4 pb-2 border-b border-slate-200 flex items-center gap-2';

  if (!user) return null; // Don't render if redirecting

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 py-10 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors bg-white/70 border border-slate-200 rounded-full px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Build Your Profile</h1>
          <p className="text-sm text-slate-500">Fill in your details to get better internship matches</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Personal & Contact */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <User className="w-5 h-5" />
            Personal & Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Resume / CV (PDF)</label>
              <div className="flex gap-2">
                <input name="resume" type="file" accept=".pdf" onChange={handleFileChange} className={inputClass} />
                <button 
                  type="button" 
                  onClick={() => handleInstantUpload('resume')}
                  disabled={uploadingStates.resume.loading || !files.resume}
                  className={`px-4 rounded-xl border font-bold text-xs transition-all flex items-center gap-1 shrink-0 ${
                    uploadingStates.resume.success 
                      ? 'bg-green-50 border-green-200 text-green-600' 
                      : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
                  }`}
                >
                  {uploadingStates.resume.loading ? (
                    <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                  ) : uploadingStates.resume.success ? (
                    <><Check className="w-3 h-3" /> Done</>
                  ) : (
                    <><Upload className="w-3 h-3" /> Upload</>
                  )}
                </button>
              </div>
              {profile?.cv && <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1"><FileCheck className="w-3 h-3" /> Previously uploaded</p>}
            </div>

            <div>
              <label className={labelClass}>10th Marksheet (PDF)</label>
              <div className="flex gap-2">
                <input name="marksheet10" type="file" accept=".pdf" onChange={handleFileChange} className={inputClass} />
                <button 
                  type="button" 
                  onClick={() => handleInstantUpload('marksheet10')}
                  disabled={uploadingStates.marksheet10.loading || !files.marksheet10}
                  className={`px-4 rounded-xl border font-bold text-xs transition-all flex items-center gap-1 shrink-0 ${
                    uploadingStates.marksheet10.success 
                      ? 'bg-green-50 border-green-200 text-green-600' 
                      : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
                  }`}
                >
                  {uploadingStates.marksheet10.loading ? (
                    <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                  ) : uploadingStates.marksheet10.success ? (
                    <><Check className="w-3 h-3" /> Done</>
                  ) : (
                    <><Upload className="w-3 h-3" /> Upload</>
                  )}
                </button>
              </div>
              {profile?.marksheet10 && <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1"><FileCheck className="w-3 h-3" /> Previously uploaded</p>}
            </div>

            <div>
              <label className={labelClass}>12th / ITI Marksheet (PDF)</label>
              <div className="flex gap-2">
                <input name="marksheet12ITI" type="file" accept=".pdf" onChange={handleFileChange} className={inputClass} />
                <button 
                  type="button" 
                  onClick={() => handleInstantUpload('marksheet12ITI')}
                  disabled={uploadingStates.marksheet12ITI.loading || !files.marksheet12ITI}
                  className={`px-4 rounded-xl border font-bold text-xs transition-all flex items-center gap-1 shrink-0 ${
                    uploadingStates.marksheet12ITI.success 
                      ? 'bg-green-50 border-green-200 text-green-600' 
                      : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
                  }`}
                >
                  {uploadingStates.marksheet12ITI.loading ? (
                    <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                  ) : uploadingStates.marksheet12ITI.success ? (
                    <><Check className="w-3 h-3" /> Done</>
                  ) : (
                    <><Upload className="w-3 h-3" /> Upload</>
                  )}
                </button>
              </div>
              {profile?.marksheet12ITI && <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1"><FileCheck className="w-3 h-3" /> Previously uploaded</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <MapPin className="w-5 h-5" />
            Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>District</label>
              <input name="district" value={form.district} onChange={handleChange} placeholder="e.g. Pune" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="e.g. Maharashtra" className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <GraduationCap className="w-5 h-5" />
            Education
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Highest Qualification</label>
              <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} placeholder="e.g. Computer Science" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Institution/College Name</label>
              <input name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. IIT Bombay" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Graduation Year</label>
              <input name="graduationYear" type="number" min="2000" max="2030" value={form.graduationYear} onChange={handleChange} placeholder="e.g. 2025" className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Skills & Bio */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <Zap className="w-5 h-5" />
            Skills & Bio
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Skills <span className="text-xs font-normal text-slate-400">(comma separated)</span></label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, Excel, Communication" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Languages Known <span className="text-xs font-normal text-slate-400">(comma separated)</span></label>
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="e.g. Hindi, English" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>About You (Bio)</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={300}
                rows={4}
                placeholder="Tell us about yourself..."
                className={`${inputClass} resize-none`}
                required
              />
              <p className="text-xs text-slate-400 text-right mt-1">{form.bio.length}/300</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pb-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold bg-white/70 hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDetails;
