import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Logo } from './Logo';
// Images will be served from /public/images/

const Operations: React.FC = () => {
  return (
    <section id="structure" className="pt-4 sm:pt-6 pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8 sm:mb-12 max-w-3xl mx-auto text-center">
          <h2 className="text-amber-500 font-black tracking-tight text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
            Group Structure
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight">
            An Integrated Mining Value Chain
          </h3>
          <p className="text-slate-600 leading-relaxed text-lg sm:text-xl">
            GEOMINING & ENVIRONMENTAL CONSULTANCY INC operates as a parent
            holding and strategic company, overseeing two specialized
            subsidiaries that together deliver integrated solutions from
            exploration to production.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* Parent Company */}
          <div className="h-full bg-[#2d6130] text-white p-8 sm:p-10 rounded-sm relative overflow-hidden group">
            <div className="relative z-10">
              <Link
                to="/"
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 p-1 hover:scale-105 transition-transform"
              >
                <Logo className="w-full h-full" />
              </Link>
              <h4 className="text-xl sm:text-2xl font-bold mb-2">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC
              </h4>
              <p className="text-amber-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
                Parent Company
              </p>
              <p className="text-white text-base sm:text-lg mb-6 leading-relaxed">
                Provides strategic leadership, technical oversight, and
                environmental governance. Serves as the foundation for all
                subsidiary operations.
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▪</span> Geological
                  consultancy & Feasibility
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▪</span> Environmental &
                  Social Impact (ESIA)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▪</span> Regulatory
                  Compliance (EPA)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▪</span> ESG Policy &
                  Community Relations
                </li>
              </ul>
            </div>
          </div>

          {/* Subsidiary 1: StoneCrest Resource Limited */}
          <Link to="/subsidiaries/stonecrest-resource" className="block h-full">
            <div className="h-full bg-[#f6bc15] border border-slate-200 p-8 sm:p-10 rounded-sm relative overflow-hidden group hover:border-amber-500 transition-colors cursor-pointer">
              <div className="relative z-10">
                <div className="h-16 mb-6 flex items-center">
                  <img
                    loading="lazy"
                    decoding="async"
                    src="/images/Resource.webp"
                    alt="StoneCrest Resource Limited Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  StoneCrest Resource Limited
                </h4>
                <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
                  Exploration & Resource Development
                </p>
                <p className="text-slate-900 text-base sm:text-lg mb-6 leading-relaxed font-medium">
                  Focuses on identifying, evaluating, and advancing mineral
                  resources through early-stage development and geological
                  surveys.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-black">
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">▪</span> Mineral
                    exploration & surveys
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">▪</span> Mapping, sampling
                    & data analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">▪</span> Resource
                    estimation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-1">▪</span> Early project
                    development
                  </li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Subsidiary 2: StoneCrest Mining Corporation */}
          <Link to="/subsidiaries/stonecrest-mining" className="block h-full">
            <div className="h-full bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-sm relative overflow-hidden group hover:border-amber-500 transition-colors cursor-pointer">
              <div className="relative z-10">
                <div className="h-16 mb-6 flex items-center">
                  <img
                    loading="lazy"
                    decoding="async"
                    src="/images/Mining.webp"
                    alt="StoneCrest Mining Corporation Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  StoneCrest Mining Corporation
                </h4>
                <p className="text-amber-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
                  Mining Operations & Production
                </p>
                <p className="text-slate-900 text-base sm:text-lg mb-6 leading-relaxed font-medium">
                  Responsible for mine development and production, translating
                  exploration success into operational projects safely and
                  responsibly.
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">▪</span> Mine
                    development & planning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">▪</span> Mining &
                    processing operations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">▪</span> HSE
                    management
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">▪</span> Site
                    rehabilitation & closure
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Operations;
