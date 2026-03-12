import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDetails = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    district: '',
    state: '',
    qualification: '',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    skills: '',
    languages: '',
    experience: '',
    bio: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend integration to be added later
    alert('Profile details saved! (Backend integration coming soon)');
    navigate('/');
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';
  const sectionClass = 'mb-8';
  const sectionHeadingClass =
    'text-base font-bold text-primary mb-4 pb-2 border-b border-slate-200 flex items-center gap-2';

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
        {/* Personal Information */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <i data-lucide="user" className="w-5 h-5"></i>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
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
              <input name="district" value={form.district} onChange={handleChange} placeholder="e.g. Pune" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="e.g. Maharashtra" className={inputClass} />
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
              <select name="qualification" value={form.qualification} onChange={handleChange} className={inputClass}>
                <option value="">Select qualification</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="diploma">Diploma</option>
                <option value="ug">Under Graduate (UG)</option>
                <option value="pg">Post Graduate (PG)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} placeholder="e.g. Computer Science" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Institution Name</label>
              <input name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. IIT Bombay" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Graduation Year</label>
              <input name="graduationYear" type="number" min="2000" max="2030" value={form.graduationYear} onChange={handleChange} placeholder="e.g. 2025" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <i data-lucide="zap" className="w-5 h-5"></i>
            Skills & Languages
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Skills <span className="text-xs font-normal text-slate-400">(comma separated)</span></label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, Excel, Communication" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Languages Known <span className="text-xs font-normal text-slate-400">(comma separated)</span></label>
              <input name="languages" value={form.languages} onChange={handleChange} placeholder="e.g. Hindi, English, Marathi" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Experience / Internships</label>
              <select name="experience" value={form.experience} onChange={handleChange} className={inputClass}>
                <option value="">Select experience level</option>
                <option value="none">No experience (Fresher)</option>
                <option value="1-3">1–3 months</option>
                <option value="3-6">3–6 months</option>
                <option value="6-12">6–12 months</option>
                <option value="1+">More than 1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className={sectionHeadingClass}>
            <i data-lucide="file-text" className="w-5 h-5"></i>
            About You
          </h2>
          <div>
            <label className={labelClass}>Short Bio <span className="text-xs font-normal text-slate-400">(max 300 chars)</span></label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={300}
              rows={4}
              placeholder="Tell us a bit about yourself, your goals, and what kind of internship you're looking for..."
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-slate-400 text-right mt-1">{form.bio.length}/300</p>
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
            className="btn btn-primary px-8 py-3 text-sm font-semibold"
          >
            <i data-lucide="save" className="w-4 h-4"></i>
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDetails;
