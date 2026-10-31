import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    partnershipType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save to Supabase Database
      const { error: dbError } = await supabase.from('partners').insert([
        {
          name: formData.name,
          organization: formData.organization,
          email: formData.email,
          partnership_type: formData.partnershipType,
          message: formData.message,
        },
      ]);

      if (dbError) {
        console.error('Supabase error:', dbError);
        // We log the error but still try to send the email
      }

      // 2. Send Email via FormSubmit
      const submissionData = new FormData();
      submissionData.append('Full Name', formData.name);
      submissionData.append('Organization', formData.organization);
      submissionData.append('Email', formData.email);
      submissionData.append('Partnership Type', formData.partnershipType);
      submissionData.append('Message', formData.message);

      // Reliable Submission to FormSubmit (info@geominingec.com)
      submissionData.append(
        '_subject',
        `PARTNER INQUIRY: ${formData.organization} - ${formData.name}`
      );
      submissionData.append('_replyto', formData.email);

      // Perform reliable submission
      const response = await fetch(
        'https://formsubmit.co/ajax/info@geominingec.com',
        {
          method: 'POST',
          body: submissionData,
          headers: { Accept: 'application/json' },
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            name: '',
            organization: '',
            email: '',
            partnershipType: '',
            message: '',
          });
        }, 5000);
      } else {
        throw new Error('Partnership inquiry email declined');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      alert(
        `Inquiry Failed: ${err.message || 'Please check your connection and try again.'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl max-h-[calc(100dvh-2rem)] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-white font-black uppercase tracking-widest text-sm">
              Partnership Inquiry
            </h3>
            <p className="text-amber-500 text-[10px] font-bold uppercase tracking-wider mt-1">
              Join the GEOMINING Ecosystem
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center animate-in zoom-in-90 duration-500">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                Inquiry Received
              </h4>
              <p className="text-slate-600 max-w-xs mx-auto">
                Thank you for your interest. Our partnership team will review
                your details and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="organization"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                  >
                    Organization
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="partnershipType"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  Partnership Type
                </label>
                <select
                  id="partnershipType"
                  name="partnershipType"
                  required
                  value={formData.partnershipType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                >
                  <option value="" disabled>
                    Select partnership type
                  </option>
                  <option value="technical">Technical Consultancy</option>
                  <option value="development">Project Development</option>
                  <option value="research">Research Collaboration</option>
                  <option value="investment">Strategic Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  Collaboration Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we work together?"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2d5a27] text-white py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-slate-900 transition-all transform hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerModal;
