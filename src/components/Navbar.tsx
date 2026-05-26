import React, { useState } from 'react';
import { Leaf, Menu, X, Calendar, User, ShoppingBag, PhoneCall, Key } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  patientName: string;
  isAdmin?: boolean;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  onLogout,
  patientName,
  isAdmin = false,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'pharmacy', label: 'Herbal Pharmacy' },
    { id: 'portal', label: isAdmin ? 'Admin Suite' : 'Patient Portal' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-premium text-shifa-charcoal border-b border-shifa-green/10">
      {/* Top Utility Bar */}
      <div className="bg-shifa-green/90 backdrop-blur-md px-4 py-2 text-xs text-white flex justify-between items-center sm:px-6 lg:px-8 border-b border-shifa-green/25 relative overflow-hidden">
        {/* Decorative gold shimmer line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-shifa-gold to-transparent opacity-65" />
        
        <div className="flex items-center gap-4 relative z-10">
          <span className="flex items-center gap-1.5 font-medium font-mono text-[10px] sm:text-[11px] tracking-wide text-shifa-mint">
            <PhoneCall className="w-3.5 h-3.5 text-shifa-gold animate-bounce" /> Emergency support: <span className="text-white font-bold font-sans">+91 1800-419-7860</span>
          </span>
          <span className="hidden md:inline font-mono opacity-80 text-[10px] tracking-wider">🕒 CHAMBER HOURS: Mon - Sat: 8:00 AM - 8:00 PM</span>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-shifa-gold flex items-center gap-1 bg-shifa-charcoal/40 px-2.5 py-0.5 rounded-full border border-shifa-gold/20 shadow-sm">
            <span>Approved</span>
            <span className="text-emerald-400 font-extrabold animate-pulse">✚</span>
          </span>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {patientName}
              </span>
              <button
                onClick={onLogout}
                className="text-[10px] uppercase font-bold tracking-widest bg-[#1A2E2A] text-shifa-gold hover:text-white hover:bg-shifa-green px-3 py-1 rounded-full transition-all duration-300 border border-shifa-gold/15 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('portal')}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider hover:text-shifa-gold transition-colors text-white cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-shifa-gold" /> Portal Check-In
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setCurrentPage('home');
              setIsOpen(false);
            }}
          >
            <div className="p-2.5 bg-shifa-green rounded-2xl border border-shifa-gold/30 transition-all duration-300 group-hover:rotate-6 group-hover:scale-105 shadow-md relative overflow-hidden group-hover:border-shifa-gold">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000" />
              <Leaf className="w-5.5 h-5.5 text-shifa-gold" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-black tracking-tight text-shifa-charcoal flex items-center gap-0.5 leading-none group-hover:text-shifa-green transition-colors duration-300">
                M/S SHIFA
              </h1>
              <p className="text-[9px] tracking-widest text-shifa-gold-dark uppercase leading-none font-extrabold mt-1">
                Apothecary & Clinics
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative rounded-lg cursor-pointer ${
                    isActive
                      ? 'text-shifa-green bg-shifa-mint/50 font-extrabold'
                      : 'text-[#1A2E2A]/70 hover:text-shifa-green hover:bg-shifa-mint/45'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-3.5 right-3.5 h-0.5 bg-shifa-green rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Booking Button CTA Desktop */}
          <div className="hidden lg:flex items-center">
            <button
              id="cta-nav-booking"
              onClick={() => setCurrentPage('booking')}
              className="flex items-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 luxury-button-glow active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-shifa-gold" />
              Book Consultation
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-shifa-mint transition-colors focus:outline-none focus:ring-2 focus:ring-shifa-green text-shifa-charcoal"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden glass-premium border-t border-shifa-green/10 animate-fade-in">
          <div className="px-3 pt-3 pb-6 space-y-1.5 sm:px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'text-shifa-green bg-shifa-mint/90 font-extrabold shadow-sm'
                    : 'text-[#1A2E2A]/70 hover:text-shifa-green hover:bg-shifa-mint/40'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 mt-3 border-t border-shifa-green/10 px-4">
              <button
                onClick={() => {
                  setCurrentPage('booking');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 luxury-button-glow active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-shifa-gold animate-pulse" />
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
