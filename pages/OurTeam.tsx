import React from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { User } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Carlos E. Tingban, Sr.',
    role: 'Founder & Managing Director',
    bio: 'Former Assistant Minister for Mines, Mineral resource Development and Conservation of Liberia. Leads the strategic vision and operations of the consultancy.',
    image: '/images/Carlos.webp',
  },
];

const technicalAssociates: TeamMember[] = [
  {
    name: 'Koakun Emmanuel Myers',
    role: 'Technical Associate',
    bio: 'Geologist, Holds an MSc in Environmental Science (Distinction), a BSc in Geology, and is pursuing an MBA in Management at the University of Liberia.',
    image: '/images/Koakun Emmanuel Myers.webp',
  },
  {
    name: 'Cyrus Michael Johnson',
    role: 'Technical Associate',
    bio: 'Master of Science in Maritime Affairs with an emphasis in shipping, port management, and logistics.',
    image: '/images/Cyrus Michael Johnson.webp',
  },
  {
    name: 'Gonpa Osundu Dahn',
    role: 'Technical Associate',
    bio: 'Holds a BSc in Accounting, is a Certified Financial Modeler (CFM), and is currently pursuing an MBA in Accounting at the University of Liberia.',
    image: '/images/gonpa-osundu-dahn.webp',
  },
];

const OurTeam: React.FC = () => {
  return (
    <div>
      <SEO
        title="Our Leadership & Experts | GeoMining & Environmental Consultancy"
        description="Meet the multidisciplinary team of experts in geology, mining engineering, and environmental science leading GeoMining & Environmental Consultancy INC."
        keywords="mining experts Liberia, geological consultants Africa, environmental science team, mining leadership"
      />
      <Hero
        title="Our Team"
        category="About Us"
        subtitle="Experts dedicated to excellence in mining and environmental solutions."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
              Leadership & Experts
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our team relies on the expertise of seasoned professionals with
              deep knowledge of the Liberian and West African mining sectors.
            </p>
          </div>

          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="max-w-sm w-full bg-slate-50 border border-slate-100 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-amber-500 shadow-md">
                  {member.image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-amber-600 font-bold text-xs uppercase tracking-wider text-center mb-4">
                  {member.role}
                </p>
                <div className="h-px w-12 bg-slate-200 mx-auto mb-4"></div>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-20 mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
              Technical Associates
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our multidisciplinary experts providing strategic guidance and
              ensuring standard-informed consultancy services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {technicalAssociates.map((member, index) => (
              <div
                key={index}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-amber-500 shadow-md">
                  {member.image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-amber-600 font-bold text-xs uppercase tracking-wider text-center mb-4">
                  {member.role}
                </p>
                <div className="h-px w-12 bg-slate-200 mx-auto mb-4"></div>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
