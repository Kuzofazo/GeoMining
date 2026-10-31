import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  ChevronDown,
  Briefcase,
  Lock,
} from 'lucide-react';
import Logo from './Logo';

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'About Us',
    href: '/#overview',
    children: [
      { name: 'History', href: '/history' },
      { name: 'Our Team', href: '/our-team' },
      { name: 'Our Vision', href: '/#vision' },
      { name: 'Our Mission & Values', href: '/about-us#values' },
      { name: 'Our Promise', href: '/about-us#promise' },
    ],
  },
  {
    name: 'News',
    href: '/blog',
    children: [
      { name: 'Latest Blog Posts', href: '/blog' },
      { name: 'Mining News Desk', href: '/#news' },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    children: [
      {
        name: 'Environmental Services (EIA)',
        href: '/services/environmental-impact-assessment',
      },
      {
        name: 'Mining & Geological Services',
        href: '/services/mining-geological',
      },
      {
        name: 'Geotechnical & Engineering',
        href: '/services/geotechnical-engineering',
      },
      { name: 'Due Diligence & Client Security', href: '/services#advisory' },
      { name: 'Mining License Packages', href: '/services/mining-licenses' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    name: 'Subsidiaries',
    href: '/subsidiaries',
    children: [
      {
        name: 'Our Operating Companies',
        href: '/subsidiaries#operating-companies',
      },
      {
        name: 'StoneCrest Resource Limited',
        href: '/subsidiaries#stonecrest-resource',
      },
      {
        name: 'StoneCrest Mining Corporation',
        href: '/subsidiaries#stonecrest-mining',
      },
    ],
  },

  {
    name: 'Gallery',
    href: '/gallery',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  // Hardcoded values since we are removing the Admin/Design context
  const logoUrl = ''; // Defaults to Logo component
  const siteTitle = 'GEOMINING & ENVIRONMENTAL CONSULTANCY INC';

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (
      path !== '/' &&
      (location.pathname === path || location.pathname.startsWith(path + '/'))
    )
      return true;
    return false;
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <header className="fixed top-0 z-50 w-full font-sans border-b border-white/10 backdrop-blur-md transform-gpu">
      {/* Top Bar - Responsive layout */}
      <div
        className="bg-[#2d5a27]/90 text-white pb-1.5 px-4 md:px-6 border-b border-white/5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.375rem)' }}
      >
        <div className="max-w-[110rem] mx-auto flex justify-between items-center text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 min-w-0">
            <span className="flex items-center gap-1 text-slate-100 whitespace-nowrap shrink-0">
              <MapPin size={10} className="text-amber-400 shrink-0" />
              Liberia HQ
            </span>
            <span className="text-white/20 hidden sm:inline shrink-0">|</span>
            <span className="text-amber-400 font-medium hidden sm:block truncate">
              Engineering a Sustainable future.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/staff-portal"
              className="inline-flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 hover:border-amber-400/60 transition-all font-bold tracking-normal shadow-sm group"
            >
              <Lock
                size={10}
                className="text-amber-400 group-hover:scale-110 transition-transform"
              />
              <span className="text-[9px] sm:text-[10px] md:text-[11px]">
                Staff Webmail
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white/80 shadow-lg">
        <div className="max-w-[110rem] mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-center w-full h-14 sm:h-16 md:h-20 gap-2">
            {/* Logo Section — shrinks gracefully on small screens */}
            <div className="flex items-center min-w-0 shrink">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/';
                }}
                className="flex items-center gap-2 min-w-0"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteTitle}
                    className="h-9 w-9 sm:h-10 sm:w-10 md:h-14 md:w-14 object-contain shrink-0"
                  />
                ) : (
                  <Logo className="h-9 w-9 sm:h-10 sm:w-10 md:h-14 md:w-14 text-blue-600 shrink-0" />
                )}
                <div className="flex flex-col min-w-0 font-bold tracking-tight text-slate-900 leading-[1.1]">
                  <span className="text-[10px] sm:text-xs md:text-sm lg:text-[15px] truncate">
                    GEOMINING & ENVIRONMENTAL
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-[13px] opacity-80 mt-0.5 truncate">
                    CONSULTANCY INC
                  </span>
                </div>
              </a>
            </div>

            {/* Navigation Right Group — shrink-0 to always stay visible */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Desktop Menu - Hidden on smaller screens */}
              <nav className="hidden lg:flex items-center mr-1">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className="relative group h-full flex items-center"
                  >
                    <Link
                      to={item.href}
                      className={`px-1.5 lg:px-2 xl:px-3 py-2 font-bold text-[11px] lg:text-[12px] 2xl:text-[13px] tracking-normal transition-all flex items-center gap-0.5 lg:gap-1 h-full ${
                        isActive(item.href)
                          ? 'text-[#2d5a27] border-b-[3px] border-[#2d5a27]'
                          : 'text-slate-600 hover:text-[#2d5a27]'
                      }`}
                    >
                      {item.name}
                      {item.children && (
                        <ChevronDown size={12} className="opacity-40" />
                      )}
                    </Link>

                    {item.children && (
                      <div
                        className="absolute top-full left-0 w-56 lg:w-64 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 border-t-[3px] border-[#2d5a27] max-h-[80vh] overflow-y-auto z-[60]"
                        style={{
                          maxHeight: 'calc(100dvh - 160px)',
                          WebkitOverflowScrolling: 'touch',
                        }}
                      >
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="block px-4 py-2.5 text-[13px] font-bold tracking-wide text-slate-600 hover:bg-slate-50 hover:text-[#2d5a27] transition-colors border-b border-slate-50 last:border-0"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Vacancy Button — hidden on mobile, visible on sm+ */}
              <Link
                to="/careers"
                className="hidden sm:flex items-center justify-center bg-[#ff9800] text-slate-900 w-8 h-8 sm:w-10 sm:h-10 rounded-md hover:bg-[#e68900] transition-all shadow-sm hover:shadow-md"
                aria-label="Careers"
              >
                <Briefcase size={18} strokeWidth={2.5} />
              </Link>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all shadow-sm ${
                    isMenuOpen
                      ? 'bg-[#2d5a27] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-[#2d5a27] hover:text-white'
                  }`}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.1)] max-h-[85vh] overflow-y-auto overscroll-contain z-40 animate-in fade-in slide-in-from-top-2 duration-300"
          style={{
            maxHeight: 'calc(100dvh - 5rem)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="px-5 py-6 sm:px-8 space-y-1"
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
            }}
          >
            {navigation.map((item) => (
              <div
                key={item.name}
                className="border-b border-slate-100 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <Link
                    to={item.href}
                    className="block py-4 text-[14px] font-black text-slate-900 uppercase tracking-wider hover:text-[#2d5a27] flex-grow transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      aria-label={`Toggle ${item.name} submenu`}
                      className="p-4 -mr-4 text-slate-400 active:text-[#2d5a27] transition-colors"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180 text-[#2d5a27]' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu with smooth expand */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSubmenu === item.name
                      ? 'max-h-[500px] opacity-100 mb-4'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-slate-50 rounded-2xl p-1.5 sm:p-2 border border-slate-100/50 shadow-inner">
                    {item.children?.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className="block py-3 px-4 text-[11px] font-bold uppercase tracking-widest text-slate-600 hover:text-[#2d5a27] hover:bg-white rounded-xl transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile-only Action Buttons */}
            <div className="pt-6 mt-2 pb-8 space-y-3">
              <Link
                to="/careers"
                className="flex items-center justify-center gap-2 w-full bg-amber-500 text-slate-900 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-md hover:bg-amber-600 transition-all active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase size={16} />
                Vacancies / Careers
              </Link>

              <Link
                to="/staff-portal"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-md hover:bg-slate-800 border border-slate-700/80 transition-all active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock size={16} className="text-amber-400" />
                Staff Webmail Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
