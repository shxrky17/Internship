import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    try {
      const response = await fetch('http://localhost:8080/add-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast(profile ? 'Profile updated successfully!' : 'Profile created successfully!', 'success');
        await updateProfile(payload);
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
          <i data-lucide="arrow-left" className="w-4 h-4"></i>
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
            <i data-lucide="user" className="w-5 h-5"></i>
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
              <label className={labelClass}>CV Link (URL)</label>
              <input name="cv" value={form.cv} onChange={handleChange} placeholder="https://drive.google.com/..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <i data-lucide="map-pin" className="w-5 h-5"></i>
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
            <i data-lucide="graduation-cap" className="w-5 h-5"></i>
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
            <i data-lucide="zap" className="w-5 h-5"></i>
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
              <i data-lucide="save" className="w-4 h-4"></i>
            )}
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDetails;
