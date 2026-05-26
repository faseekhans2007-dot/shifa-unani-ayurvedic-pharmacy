import React from 'react';
import { Leaf, Award, ShieldAlert, HeartPulse } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#122421] border-t-4 border-shifa-gold text-shifa-mint/80 pt-16 pb-8 text-left font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-shifa-green rounded-lg border border-shifa-gold/20 shrink-0">
              <Leaf className="w-5 h-5 text-shifa-gold" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white font-serif leading-none tracking-wider uppercase">M/S SHIFA</h4>
              <span className="text-[9px] uppercase tracking-widest text-[#937a40] font-black block mt-0.5">Apothecary & Clinics</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-shifa-mint/70 font-medium">
            Dedicated preserve of authentic Unani and Ayurvedic clinical therapeutics since 2000. Rebalancing humoral pathways and biological elements with premium organic botanicals.
          </p>
          <div className="flex gap-2 text-[9px] text-[#937a40] font-black tracking-widest font-mono">
            <span>REG ID: HHDSK00021</span>
          </div>
        </div>

        {/* Navigation Quicklinks */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
            Clinical Gateways
          </h4>
          <ul className="space-y-2.5 font-bold uppercase tracking-wider text-[10px]">
            <li>
              <button onClick={() => setCurrentPage('home')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                Home Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('about')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                About Our Vision
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('departments')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                Treatments & Specialties
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('doctors')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                Vaidyas & Hakims
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('pharmacy')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                Herbal Apothecary Shop
              </button>
            </li>

            <li>
              <button onClick={() => setCurrentPage('portal')} className="hover:text-shifa-gold transition cursor-pointer border-0 bg-transparent p-0">
                Wasia Patient Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
            Chamber Hours
          </h4>
          <ul className="space-y-2.5 text-shifa-mint/70 leading-normal font-medium">
            <li className="flex justify-between">
              <span>Monday - Friday</span>
              <span className="text-white font-mono font-black">08:00 AM - 08:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday OPD</span>
              <span className="text-white font-mono font-black">09:00 AM - 06:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sundays</span>
              <span className="text-[#ff6b6b] uppercase font-black text-[9px] tracking-widest">Chambers Closed</span>
            </li>
            <li className="border-t border-white/5 pt-2 text-[10px] text-shifa-mint/50">
              * Emergency pharmaceutical dispensary counter is open 24/7 on call.
            </li>
          </ul>
        </div>

        {/* Physical Location Coordinates */}
        <div className="space-y-4 text-left">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
            Physical Chambers
          </h4>
          <p className="leading-relaxed text-[11px] text-shifa-mint/70 font-semibold">
            M/S Shifa Unani Ayurvedic Pharmacy,<br />
            osmania masjid beside brilliant talent school,<br />
            yellareddy, dist kamareddy, Telangana,<br />
            India
          </p>
          <div className="space-y-1 font-bold text-[#937a40] text-[10px] tracking-wide mt-2">
            <span className="block">📧 contact@shifa-apothecary.in</span>
            <span className="block">☎️ +91 1800-419-7860 (Helpline)</span>
          </div>
        </div>
      </div>

      {/* Corporate compliance bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-shifa-mint/40 gap-4">
        <p>© {year} M/S Shifa Unani Ayurvedic Pharmacy. All Rights Reserved throughout India.</p>
        <div className="flex items-center gap-4 text-shifa-mint/40 uppercase font-black tracking-widest text-[9px]">
          <span>Licensed under Drug & Cosmetic Act 1940</span>
          <span>•</span>
          <span>Approved under GMP Guidelines</span>
        </div>
      </div>
    </footer>
  );
}
