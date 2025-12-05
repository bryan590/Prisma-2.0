import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 h-[89px] py-[14px] ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-[61px]">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group">
            <img src="/logo-greta.png" alt="Greta" className="w-[111px] h-[61px] object-contain group-hover:opacity-80 transition-opacity" />
          </div>

          {/* Desktop CTA & Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button className="w-[217px] h-[36px] flex items-center bg-white border border-gray-200 rounded-full hover:shadow-md hover:border-greta-green/30 transition-all group pl-1 pr-4 justify-between">
              <span className="bg-[linear-gradient(45deg,#4CB9B9,#00FF75)] text-white rounded-full w-7 h-7 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
              <span className="text-greta-dark text-[16px] font-medium group-hover:text-greta-green transition-colors">Contáctanos Ahora</span>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
            >
              <Menu className="text-greta-dark" size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)} className="p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-fade-in">
          {/* Header inside Menu */}
          <div className="max-w-[1400px] w-full mx-auto px-6 py-6 md:py-8 flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(false)}>
              <img src="/logo-greta.png" alt="Greta" className="w-[111px] h-[61px] object-contain" />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-[217px] h-[36px] flex items-center bg-white border border-gray-200 rounded-full hover:shadow-md hover:border-greta-green/30 transition-all group pl-1 pr-4 justify-between">
                <span className="bg-[linear-gradient(45deg,#4CB9B9,#00FF75)] text-white rounded-full w-7 h-7 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                </span>
                <span className="text-greta-dark text-[16px] font-medium group-hover:text-greta-green transition-colors">Contáctanos Ahora</span>
              </button>

              <button onClick={() => setIsOpen(false)} className="p-2 text-greta-dark hover:bg-gray-50 rounded-full transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Menu Links */}
          <div className="flex-1 flex flex-col justify-center items-center gap-8 md:gap-10">
            {[
              { label: 'Servicios', href: '#services' },
              { label: 'Metodologías', href: '#frameworks' },
              { label: 'Productos', href: '#products' },
              { label: 'Casos de estudio', href: '#' }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-4xl md:text-5xl font-heading font-normal text-greta-dark hover:text-greta-green transition-colors tracking-tight text-center cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="max-w-[1400px] w-full mx-auto px-6 pb-10 md:pb-12 flex justify-between items-end">
            <span className="text-gray-500 font-medium text-sm">Contacto</span>
            <div className="flex gap-5">
              <Facebook size={20} className="text-greta-dark hover:text-greta-green cursor-pointer transition-colors" strokeWidth={1.5} />
              <Instagram size={20} className="text-greta-dark hover:text-greta-green cursor-pointer transition-colors" strokeWidth={1.5} />
              <Twitter size={20} className="text-greta-dark hover:text-greta-green cursor-pointer transition-colors" strokeWidth={1.5} />
              <Linkedin size={20} className="text-greta-dark hover:text-greta-green cursor-pointer transition-colors" strokeWidth={1.5} />
              <Youtube size={20} className="text-greta-dark hover:text-greta-green cursor-pointer transition-colors" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;