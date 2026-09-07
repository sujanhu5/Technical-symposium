import React, { useState, useEffect } from 'react';
import { FestProvider, useFest } from './context/FestContext';
import { Navbar } from './components/Navbar';
import { OpeningDiffusionHero } from './components/OpeningDiffusionHero';
import { SilverJubileeTimeline } from './components/SilverJubileeTimeline';
import { EventsShowcase } from './components/EventsShowcase';
import { LiveUpdatesSection } from './components/LiveUpdatesSection';
import { Footer } from './components/Footer';
import { EventDetailModal } from './components/EventDetailModal';
import { RegistrationModal } from './components/RegistrationModal';
import { ParticipantPassModal } from './components/ParticipantPassModal';
import { AdminPortal } from './components/AdminPortal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { GraphicalDock } from './components/GraphicalDock';
import { QuickPassLookupModal } from './components/QuickPassLookupModal';
import { GlobalVoxelBlockBackground } from './components/GlobalVoxelBlockBackground';
import { FestEvent, RegistrationRecord, DepartmentCode } from './types';

const FestApp: React.FC = () => {
  const { 
    selectedEvent, 
    setSelectedEvent, 
    registeringEvent, 
    setRegisteringEvent, 
    viewingPass, 
    setViewingPass,
    setActiveDeptFilter 
  } = useFest();

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPassLookupOpen, setIsPassLookupOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('opening');

  // Track active section via scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['opening', 'events', 'anniversary', 'updates'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDepartment = (dept: DepartmentCode) => {
    setActiveDeptFilter(dept);
    scrollToSection('events');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative pb-20 overflow-x-hidden">
      {/* Global Voxel Block Field Dissolving Across the Whole Website Background */}
      <GlobalVoxelBlockBackground />

      {/* Sticky Transparent Navbar */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        onNavigate={scrollToSection}
        activeSection={activeSection}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPassLookup={() => setIsPassLookupOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Cinematic Opening Canopy: Monumental Event Name Hero Section */}
        <section id="opening">
          <OpeningDiffusionHero
            onSelectDept={handleSelectDepartment}
            onExploreEvents={() => scrollToSection('events')}
          />
        </section>

        {/* Departments Grid & Competitions Showcase */}
        <EventsShowcase
          onOpenEventDetail={(event: FestEvent) => setSelectedEvent(event)}
          onOpenRegistration={(event: FestEvent) => setRegisteringEvent(event)}
        />

        {/* 25th Silver Jubilee Interactive Timeline & College Details */}
        <SilverJubileeTimeline />

        {/* Live Notification & Automated Broadcast Updates Stream */}
        <LiveUpdatesSection />
      </main>

      {/* Floating Transparent Navigation Dock */}
      <GraphicalDock
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPassLookup={() => setIsPassLookupOpen(true)}
      />

      {/* Modern Cyber Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        onNavigate={scrollToSection}
      />

      {/* MODALS */}
      {/* 1. Global Spotlight Command Palette (⌘K) */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEvent={(event: FestEvent) => {
          setSelectedEvent(event);
        }}
        onSelectDept={(dept: DepartmentCode) => {
          setActiveDeptFilter(dept);
          scrollToSection('events');
        }}
        onNavigateSection={scrollToSection}
      />

      {/* 2. Quick Pass Lookup Modal */}
      <QuickPassLookupModal
        isOpen={isPassLookupOpen}
        onClose={() => setIsPassLookupOpen(false)}
        onViewPass={(record: RegistrationRecord) => setViewingPass(record)}
      />

      {/* 3. Detailed Event Guidelines Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenRegister={(event) => setRegisteringEvent(event)}
        />
      )}

      {/* 4. Registration Form Modal with Multi-step verification & Pass generation */}
      {registeringEvent && (
        <RegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
          onViewPass={(regRecord: RegistrationRecord) => setViewingPass(regRecord)}
        />
      )}

      {/* 5. Official Digital Ticket / Participant Badge Pass Modal */}
      {viewingPass && (
        <ParticipantPassModal
          registration={viewingPass}
          onClose={() => setViewingPass(null)}
        />
      )}

      {/* 6. Administrator & Coordinator Command Center Portal */}
      {isAdminOpen && (
        <AdminPortal
          onClose={() => setIsAdminOpen(false)}
          onViewPass={(regRecord: RegistrationRecord) => setViewingPass(regRecord)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <FestProvider>
      <FestApp />
    </FestProvider>
  );
}
