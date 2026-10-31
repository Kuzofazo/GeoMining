import React from 'react';
import { Calendar, MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { JobPosting } from '../types/jobs';

interface JobCardProps {
  job: JobPosting;
  onApply: (job: JobPosting) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:border-amber-500 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-100 font-arial-black">
            {job.department}
          </span>
          <span className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-100 flex items-center gap-1 font-arial-black">
            <Clock size={10} />
            {job.type}
          </span>
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-[#2d5a27] transition-colors leading-tight font-arial-black">
          {job.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-700 text-sm font-bold">
            <MapPin size={16} className="text-[#2d5a27]" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 text-sm font-bold">
            <Calendar size={16} className="text-[#2d5a27]" />
            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => onApply(job)}
          className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-[#2d5a27] transition-all flex items-center justify-center gap-2 group/btn"
        >
          Apply Now
          <ArrowRight
            size={18}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
