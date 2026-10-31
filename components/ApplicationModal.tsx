import React, { useState, useRef } from 'react';
import { X, Upload, Send, CheckCircle } from 'lucide-react';
import { JobPosting } from '../types/jobs';
import { supabase } from '../lib/supabase';

interface ApplicationModalProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    linkedIn: '',
    coverLetter: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      timer = setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          experience: '',
          skills: '',
          linkedIn: '',
          coverLetter: '',
        });
        setSelectedFile(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) return alert('Full Name is required.');
    if (!formData.email.trim()) return alert('Valid Email is required.');
    if (!formData.phone.trim()) return alert('Phone Number is required.');
    if (!formData.experience)
      return alert('Please select your years of experience.');
    if (!formData.skills.trim())
      return alert('Please list your relevant skills.');
    if (!formData.coverLetter.trim())
      return alert('Important details/Cover letter is required.');
    if (!selectedFile) return alert('Please upload your CV/Resume file.');

    setIsSubmitting(true);

    try {
      // 1. Upload CV to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile);

      if (uploadError)
        throw new Error('Failed to upload CV: ' + uploadError.message);

      // 2. Save Application to Supabase Database
      const { error: dbError } = await supabase.from('applications').insert({
        job_id: job.id, // Ensure this matches the UUID from Supabase jobs table
        job_title: job.title,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        skills: formData.skills,
        linked_in: formData.linkedIn || null,
        cover_letter: formData.coverLetter,
        resume_url: fileName,
        status: 'Pending',
      });

      if (dbError) {
        // If DB insert fails, try to clean up the uploaded file to avoid orphans
        await supabase.storage.from('resumes').remove([fileName]);
        throw new Error('Database Error: ' + dbError.message);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Submission technical error:', error);
      alert(`Submission Failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              Apply for Position
            </h2>
            <p className="text-[#2d5a27] font-bold uppercase tracking-widest text-xs mt-1 font-arial-black">
              {job.title}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle size={48} className="animate-bounce" />
            </div>
            <h3 className="text-2xl font-arial-black text-slate-900 mb-4 uppercase tracking-tight">
              Application Received
            </h3>
            <p className="text-slate-600 font-arial text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Thanks for submitting your application. Our HR team will review
              your CV and contact you shortly.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white font-arial-black py-4 px-10 rounded-xl hover:bg-[#2d5a27] transition-all shadow-lg hover:shadow-xl"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Job Details Section */}
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-normal text-amber-600 mb-3 font-arial-black">
                    Position Summary
                  </h3>
                  <p className="text-slate-800 text-lg leading-relaxed text-justify font-arial">
                    {job.description}
                  </p>
                </div>

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-normal text-amber-600 mb-4 font-arial-black">
                      Key Responsibilities
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {job.responsibilities.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-slate-700 text-lg leading-relaxed font-arial"
                        >
                          <span className="text-amber-500 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-normal text-amber-600 mb-4 font-arial-black">
                      Qualifications and Requirements
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {job.requirements.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-slate-700 text-lg leading-relaxed font-arial"
                        >
                          <span className="text-amber-500 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-6"
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="full-name"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    id="full-name"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email-address"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    id="email-address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone-number"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    id="phone-number"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+231..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="experience-select"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                  >
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="experience"
                    id="experience-select"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-4">2-4 years</option>
                    <option value="5-8">5-8 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="relevant-skills"
                  className="text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  Relevant Skills <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="skills"
                  id="relevant-skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. GIS, Project Management"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  LinkedIn Profile URL (Optional)
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Upload CV/Resume (PDF/DOC){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  name="resume"
                  aria-label="Upload Resume"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer group ${selectedFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-amber-500'}`}
                >
                  <Upload
                    size={32}
                    className={`mx-auto mb-2 ${selectedFile ? 'text-emerald-500' : 'text-slate-300 group-hover:text-amber-500'}`}
                  />
                  <p
                    className={`text-sm font-bold ${selectedFile ? 'text-emerald-700' : 'text-slate-500'}`}
                  >
                    {selectedFile
                      ? selectedFile.name
                      : 'Click or drag and drop to upload'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      : 'Max file size: 5MB'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="important-details"
                  className="text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  Cover Letter / Important Details{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="coverLetter"
                  id="important-details"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share any important details we should know..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-[#2d5a27] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Submit Application <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
