import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import OfficeMap from '../components/OfficeMap';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pkgParam = searchParams.get('package');
  const subjectParam = searchParams.get('subject');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service:
      pkgParam || subjectParam ? 'Mining License & Regulatory Compliance' : '',
    message: pkgParam
      ? `Hello, I would like to inquire about the ${pkgParam}. Please provide details on regulatory compliance, statutory timelines, and onboarding requirements.`
      : subjectParam
        ? `Hello, I would like to schedule a consultation regarding Mining Support Services and License Compliance.`
        : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const services = [
    'Mining License & Regulatory Compliance',
    'Geological Consultancy',
    'Mining Operations',
    'Environmental Impact',
    'Resource Exploration',
    'Strategic Planning',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase Database
      const { error: dbError } = await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
        },
      ]);

      if (dbError) {
        console.error('Supabase error:', dbError);
        // We log the error but still try to send the email
      }

      // 2. Direct Submission to FormSubmit (info@geominingec.com)
      const submissionData = new FormData();
      submissionData.append('Name', formData.name);
      submissionData.append('Email', formData.email);
      submissionData.append('Phone', formData.phone);
      submissionData.append('Service Requested', formData.service);
      submissionData.append('Message', formData.message);
      submissionData.append('_subject', `GENERAL INQUIRY: ${formData.name}`);
      submissionData.append('_replyto', formData.email);

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
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(
        'There was an error sending your message. Please check your connection or email info@geominingec.com directly.'
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
    <div className="bg-white">
      <SEO
        title="Contact Us | GeoMining & Environmental Consultancy"
        description="Get in touch with GeoMining & Environmental Consultancy INC. Our experts in geological and mining services are ready to assist you. Visit our office in Monrovia, Liberia."
      />

      <Hero
        title="Contact Us"
        category="Global Reach"
        subtitle="Partner with Liberia's most trusted geological and environmental consultants. We are here to support your resource development goals."
        showButtons={false}
        isFullHeight={false}
      />

      {/* Main Contact Section */}
      <section
        id="contact-form-section"
        className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left Column: Get in Touch */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-6 sm:mb-8 uppercase tracking-widest flex items-center gap-4">
              Get in Touch
              <div className="h-1 flex-grow bg-slate-100"></div>
            </h2>

            <p className="text-lg text-slate-600 mb-12 max-w-md">
              Whether you have a specific project inquiry or want to learn more
              about our services, our team in Monrovia is ready to connect.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 shrink-0">
                  <MapPin size={24} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    Office Address
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Cheeseman Avenue, Airfield New Road
                    <br />
                    Sinkor, Monrovia, Liberia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 shrink-0">
                  <Phone size={24} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    Call Us
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    +231 77 777 2778
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 shrink-0">
                  <MessageSquare size={24} className="text-[#25D366]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    WhatsApp
                  </h4>
                  <a
                    href="https://wa.me/231777772778"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-amber-500 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    Connect Instantly <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 shrink-0">
                  <Mail size={24} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    Email Address
                  </h4>
                  <a
                    href="mailto:info@geominingec.com"
                    className="text-slate-600 hover:text-amber-500 transition-colors font-medium"
                  >
                    info@geominingec.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-slate-50 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 shrink-0">
                  <Clock size={24} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    Business Hours
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Monday - Friday: 8:00 AM - 5:00 PM
                    <br />
                    Saturday: By Appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-slate-50 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl">
            <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+231..."
                    className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Select Service
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    aria-label="Select Service"
                    className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-sm appearance-none"
                  >
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us about your project or inquiry..."
                  className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${
                  submitted
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-amber-500'
                }`}
              >
                {isSubmitting ? (
                  'Sending Inquiry...'
                ) : submitted ? (
                  <>Message Sent Successfully!</>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Full Width Map Section */}
      <section className="bg-slate-50 border-t border-slate-100">
        <OfficeMap />
      </section>
    </div>
  );
};

export default Contact;
