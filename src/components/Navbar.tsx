import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  onOpenAdmin?: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenSearch?: () => void;
  onOpenPassLookup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    soundEffects.navClick();
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'opening', label: 'Home' },
    { id: 'events', label: 'Departments & Events' },
    { id: 'anniversary', label: 'Silver Jubilee' },
    { id: 'updates', label: 'Live Updates' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 transform-gpu ${
        isScrolled 
          ? 'translate-y-0 opacity-100 bg-black/95 border-white/[0.12] shadow-2xl backdrop-blur-2xl pointer-events-auto' 
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* College Logo + Event Name */}
        <button
          type="button"
          onClick={() => handleNavClick('opening')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group py-1 bg-transparent border-0 p-0 focus:outline-none text-left"
          id="brand-logo-button"
          aria-label="SJB Institute of Technology - Technical Symposium 2K26"
          title="Technical Symposium 2K26 - SJBIT"
        >
          <img 
            src="/sjbit-logo.png"
            alt="SJBIT Logo"
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain select-none filter drop-shadow-[0_2px_8px_rgba(235,102,43,0.35)] group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs sm:text-sm md:text-base tracking-wide text-white group-hover:text-cyan-200 transition-colors whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">SYMPOSIUM</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/[0.08] text-cyan-300 border border-white/10 shrink-0">
                2K26
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden xs:inline leading-tight">
              SJB Institute of Technology • Bengaluru
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={() => soundEffects.hoverTick()}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-white/[0.06] border border-white/15'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent REGISTER CTA */}
          <button
            onClick={() => handleNavClick('events')}
            id="header-register-cta-btn"
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <span>REGISTER</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-nav-toggle-btn"
            className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950/98 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  activeSection === link.id
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                handleNavClick('events');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register for Competitions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
