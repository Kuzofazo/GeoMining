import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const Footer: React.FC = () => {
  // Hardcoded values
  const socialLinks = {
    facebook: 'https://www.facebook.com/profile.php?id=61586556572882',
    twitter: 'https://x.com/GeominingEC',
    linkedin:
      'https://www.linkedin.com/company/geo-mining-environmental-consultancy-inc/',
    instagram: 'https://www.instagram.com/geominingec',
  };

  const siteTitle = 'GEOMINING & ENVIRONMENTAL CONSULTANCY INC';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append('Newsletter Subscription', formData.email);
      submissionData.append('_subject', 'NEW NEWSLETTER SUBSCRIPTION');

      const response = await fetch(
        'https://formsubmit.co/ajax/info@geominingec.com',
        {
          method: 'POST',
          body: submissionData,
          headers: { Accept: 'application/json' },
        }
      );

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Newsletter submission failed');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t-4 border-[#2d5a27]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Company Info */}
          <div className="sm:col-span-1 lg:col-span-3">
            <Link
              to="/"
              className="flex items-center gap-4 mb-6 hover:opacity-80 transition-opacity"
            >
              <Logo className="w-16 h-16 shadow-lg" />
              <div className="flex flex-col">
                <h3 className="text-base font-black tracking-tighter uppercase leading-tight">
                  GEOMINING & ENVIRONMENTAL
                </h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                  CONSULTANCY INC
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A specialized consultancy bridging geology, mining, and
              environmental science. Engineering a Sustainable future.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-slate-800 p-2.5 rounded-full hover:bg-[#2d5a27] text-slate-400 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Facebook size={18} />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="bg-slate-800 p-2.5 rounded-full hover:bg-[#2d5a27] text-slate-400 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Twitter size={18} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="bg-slate-800 p-2.5 rounded-full hover:bg-[#2d5a27] text-slate-400 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-slate-800 p-2.5 rounded-full hover:bg-[#2d5a27] text-slate-400 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links and Services - 2 Columns on Mobile */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:col-span-1 lg:col-span-4">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 leading-tight">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-slate-300 font-medium">
                <li>
                  <Link
                    to="/about-us"
                    className="hover:text-amber-500 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subsidiaries"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Subsidiaries
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Media Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sustainability"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/governance"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Governance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 leading-tight">
                Our Services
              </h4>
              <ul className="space-y-3 text-sm text-slate-300 font-medium">
                <li>
                  <Link
                    to="/services/mining-geological"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Mining & Geological
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/environmental-impact-assessment"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Environmental Impact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/geotechnical-engineering"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Geotechnical Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#advisory"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Advisory & Strategy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Mining &amp; EIA FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter/Quick Inquiry and Contact Info */}
          <div className="sm:col-span-2 lg:col-span-5 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 items-start">
            <div className="lg:col-span-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden group max-w-[340px] w-full">
              {/* Subtle hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a27]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <h4 className="text-white font-black text-lg mb-3 leading-tight flex items-center gap-2 tracking-tight">
                  <Mail size={18} className="text-amber-500" />
                  Stay Informed
                </h4>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                  Subscribe for the latest news on mining projects and
                  environmental consultancy.
                </p>
                {submitted ? (
                  <div className="bg-[#2d5a27]/20 border border-[#2d5a27] p-4 rounded-xl text-center">
                    <p className="text-xs text-white font-bold uppercase tracking-widest">
                      Successfully Subscribed
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-slate-900/50 border border-slate-700 text-white text-xs px-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute right-2 top-2 p-1.5 bg-amber-500 text-slate-900 rounded-lg hover:bg-[#2d5a27] hover:text-white transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-3 h-3 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                        ) : (
                          <Send size={14} />
                        )}
                      </button>
                    </div>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">
                      Direct inquiries to info@geominingec.com
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-lg mb-6 leading-tight">
                Contact Info
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-[#2d5a27] mt-0.5 shrink-0"
                  />
                  <a
                    href="https://maps.app.goo.gl/nxqYCJKp6PUGRfzs7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-500 transition-colors leading-relaxed"
                  >
                    Cheeseman Avenue, Airfield New Road
                    <br />
                    Sinkor, Monrovia, Liberia
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#2d5a27] shrink-0" />
                  <a
                    href="tel:+231777772778"
                    className="hover:text-amber-500 transition-colors"
                  >
                    +231 77 777 2778
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#2d5a27] shrink-0" />
                  <a
                    href="mailto:info@geominingec.com"
                    className="hover:text-amber-500 transition-colors"
                  >
                    info@geominingec.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium gap-4 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs opacity-80 leading-normal max-w-none">
            &copy; {new Date().getFullYear()} GEOMINING & ENVIRONMENTAL
            CONSULTANCY INC. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs opacity-75 tracking-wider">
            Powered by{' '}
            <span className="text-amber-400 font-bold">AfriVertex</span>
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/staff-portal"
              className="hover:text-emerald-400 transition-colors"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
