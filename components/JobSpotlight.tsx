import React, { useState, useEffect } from 'react';
import { JobPosting } from '../types/jobs';
import { ArrowRight, Sparkles, Clock, MapPin } from 'lucide-react';

interface JobSpotlightProps {
  jobs: JobPosting[];
  onApply: (job: JobPosting) => void;
}

const JobSpotlight: React.FC<JobSpotlightProps> = ({ jobs, onApply }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (jobs.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % jobs.length);
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, [jobs.length]);

  if (jobs.length === 0) return null;

  const currentJob = jobs[currentIndex];

  return (
    <div className="relative h-full min-h-[350px] bg-[#2d5a27] rounded-2xl p-8 overflow-hidden group shadow-2xl border border-[#2d5a27]/30 flex flex-col justify-between lg:col-span-2">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>

      <div
        className={`transition-all duration-500 transform ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-white/10 text-white px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <Sparkles size={12} className="animate-pulse text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-arial-black">
              Spotlight Position
            </span>
          </div>
        </div>

        <h3 className="text-3xl font-black text-white mb-4 leading-tight font-arial-black uppercase tracking-tight group-hover:text-amber-400 transition-colors">
          {currentJob.title}
        </h3>

        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={18} className="text-amber-400" />
            <span className="text-sm font-bold font-arial tracking-wide">
              {currentJob.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock size={18} className="text-amber-400" />
            <span className="text-sm font-bold font-arial tracking-wide">
              Deadline: {currentJob.deadline}
            </span>
          </div>
        </div>

        <p className="text-white/90 text-base leading-relaxed mb-8 line-clamp-3 font-arial italic opacity-90">
          "{currentJob.description}"
        </p>
      </div>

      <button
        onClick={() => onApply(currentJob)}
        className="w-full bg-white text-[#2d5a27] font-black py-4 rounded-xl hover:bg-amber-400 hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl group-hover:scale-[1.01] active:scale-95 font-arial-black uppercase text-xs tracking-widest"
      >
        View Details & Apply
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 right-8 flex gap-1">
        {jobs.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-4 bg-amber-400' : 'w-1 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSpotlight;
