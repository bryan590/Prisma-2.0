import React, { useRef } from 'react';
import { Linkedin } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TeamMember } from '../types';

const teamMembers: TeamMember[] = [
  { id: 1, name: 'Enrique Quispe', role: 'Founder', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Lazaro Vargas', role: 'CCO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Rodolfo Rebagliati', role: 'Project Manager', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Kimberly Soto', role: 'Administración', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Renzo Carrasco', role: 'Administración', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const Team: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".team-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section id="team" className="py-24 md:py-32 bg-white relative z-50" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-heading font-normal text-center mb-20 text-greta-dark tracking-tight">Nuestro Equipo</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card group relative">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <a href="#" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-[#0077b5] p-2 rounded-full translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 hover:bg-white">
                  <Linkedin size={18} fill="currentColor" />
                </a>
              </div>

              <div className="text-center md:text-left">
                <h3 className="font-heading font-normal text-base md:text-lg text-greta-dark leading-tight mb-1 group-hover:text-greta-green transition-colors">{member.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;