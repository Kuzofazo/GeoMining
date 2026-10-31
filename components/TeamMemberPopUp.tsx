import React from 'react';
import { User } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface TeamMemberPopUpProps {
  member: TeamMember;
}

const TeamMemberPopUp: React.FC<TeamMemberPopUpProps> = ({ member }) => {
  return (
    <div className="group relative inline-block cursor-pointer">
      <span className="font-bold text-slate-900 border-b-2 border-amber-400 hover:border-amber-600 transition-colors duration-200">
        {member.name}
      </span>

      {/* Pop-up Card */}
      <div className="absolute left-1/2 bottom-full mb-4 w-72 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 z-50">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-2xl relative">
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-r border-b border-slate-200 rotate-45"></div>

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-amber-500 shadow-lg shrink-0">
              {member.image ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} />
              )}
            </div>

            <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">
              {member.name}
            </h4>

            <p className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mb-3">
              {member.role}
            </p>

            <div className="h-px w-8 bg-slate-200 mb-3"></div>

            <p className="text-slate-600 text-xs leading-relaxed line-clamp-4">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPopUp;
