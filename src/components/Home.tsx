import React from 'react';
import { Leaf, Calendar, HeartPulse, Sparkles, BookOpen, ChevronRight, Activity, ShieldCheck, Award, ShoppingBag, Flame } from 'lucide-react';
import { DEPARTMENTS, PRODUCTS } from '../data/hospitalData';

interface HomeProps {
  setCurrentPage: (page: string) => void;
  setSelectedDoctorId?: (id: string | null) => void;
}

export default function Home({ setCurrentPage, setSelectedDoctorId }: HomeProps) {
  return (
    <div className="space-y-16 pb-20 animate-fade-in font-sans">
      
      {/* 1. Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-shifa-mint/60 via-shifa-mint/20 to-transparent text-shifa-charcoal pt-16 pb-20 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-shifa-green/10">
        {/* Background dynamic ambient light spots */}
        <div className="absolute right-[-10%] top-[-10%] w-[550px] h-[550px] bg-shifa-gold/15 rounded-full blur-[100px] opacity-45 mix-blend-multiply pointer-events-none animate-aurora-slow" />
        <div className="absolute left-[-5%] bottom-[-5%] w-[450px] h-[450px] bg-[#2E5B4E]/10 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none animate-aurora-slow" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center justify-center bg-shifa-green text-shifa-gold w-9 h-9 rounded-2xl border border-shifa-green/10 shadow-md select-none rotate-3 hover:rotate-12 transition-all duration-300" title="Clinical Center">
              <span className="text-sm font-bold leading-none">✚</span>
            </div>
            
            <h1 className="hero-text text-shifa-charcoal tracking-tighter leading-none uppercase font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-shifa-charcoal via-[#1b3b32] to-shifa-green">Healing</span><br />
              <span className="serif italic text-shifa-green font-normal lowercase bg-clip-text text-transparent bg-gradient-to-r from-[#173d32] via-[#2A5246] to-shifa-gold">for modern life.</span>
            </h1>

            <p className="text-sm sm:text-base text-shifa-charcoal/85 leading-relaxed max-w-2xl font-light">
              Welcome to <span className="font-bold text-shifa-green">M/S Shifa Unani Ayurvedic Pharmacy</span>. From deep systemic chronic healing in our specialist clinical chambers to fresh organic herbal biochemistry, we unify the ancient systems of <span className="underline decoration-shifa-gold/80 underline-offset-4 font-bold tracking-wide">Unani-Tibb</span> and <span className="underline decoration-shifa-gold/80 underline-offset-4 font-bold tracking-wide">Ayurvedic Sciences</span> under one modern, robust digital portal.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('booking')}
                className="flex items-center gap-2.5 bg-shifa-green hover:bg-[#112421] text-white font-extrabold px-6 py-4 rounded-xl text-xs uppercase tracking-widest hover:scale-[1.03] transition-all duration-300 active:scale-95 cursor-pointer font-sans luxury-button-glow"
              >
                <Calendar className="w-4 h-4 text-shifa-gold animate-pulse" />
                Schedule Consultation
              </button>
              <button
                onClick={() => setCurrentPage('pharmacy')}
                className="flex items-center gap-2 bg-[#E1ECE7]/45 hover:bg-white text-shifa-charcoal border border-shifa-green/15 hover:border-shifa-green/45 font-bold px-6 py-4 rounded-xl transition duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer text-xs uppercase tracking-widest font-sans shadow-sm"
              >
                <span>Browse Apothecary Shop</span>
                <ChevronRight className="w-4 h-4 text-shifa-green" />
              </button>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-shifa-green/10 text-xs text-shifa-charcoal/75">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-shifa-green">
                <ShieldCheck className="w-4 h-4 text-shifa-gold-dark" />
                <span>100% Certified Herbals</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] text-shifa-green">
                <Award className="w-4 h-4 text-shifa-gold-dark" />
                <span>NABH Clinical Standards</span>
              </div>
            </div>
          </div>

          {/* Hero visual panel - gentled floating with float animation */}
          <div className="lg:col-span-5 relative w-full flex justify-center animate-float">
            <div className="relative p-1 rounded-3xl bg-transparent max-w-sm md:max-w-md w-full">
              {/* Outer decorative golden ring glow layout */}
              <div className="absolute -inset-1 bg-gradient-to-r from-shifa-mint via-shifa-gold/20 to-shifa-mint rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              <div className="rounded-2xl overflow-hidden glass-premium p-6 border border-shifa-green/15 text-center shadow-xl relative backdrop-blur-xl">
                <div className="absolute top-4 left-4 text-shifa-green/10 font-serif text-6xl select-none leading-none animate-pulse">🌿</div>
                
                <h3 className="font-serif text-xl text-shifa-green font-bold mb-2">Empowering Your Vitality</h3>
                <p className="text-[9px] text-shifa-gold-dark uppercase tracking-widest font-extrabold mb-6">Traditional System Diagnosis</p>
                
                {/* Clinical Focus Badge layout */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-white/60 hover:bg-white p-3 rounded-xl hover:translate-x-1.5 transition-all duration-300 text-left border border-shifa-green/5 shadow-sm">
                    <div className="p-2.5 bg-shifa-green rounded-xl text-shifa-gold shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-[#112421] uppercase tracking-widest">Unani Mizaj Diagnosis</h4>
                      <p className="text-[10px] text-shifa-charcoal/75 leading-normal">Analyzing Temperament (Dm, Safra, Balgham, Sauda)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/60 hover:bg-white p-3 rounded-xl hover:translate-x-1.5 transition-all duration-300 text-left border border-shifa-green/5 shadow-sm">
                    <div className="p-2.5 bg-shifa-green rounded-xl text-shifa-gold shrink-0 animate-pulse">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-[#112421] uppercase tracking-widest">hijama center</h4>
                      <p className="text-[10px] text-shifa-charcoal/75 leading-normal">Traditional wet & dry cupping therapy for detox & blood purification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/60 hover:bg-white p-3 rounded-xl hover:translate-x-1.5 transition-all duration-300 text-left border border-shifa-green/5 shadow-sm">
                    <div className="p-2.5 bg-shifa-green rounded-xl text-shifa-gold shrink-0">
                      <HeartPulse className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-[#112421] uppercase tracking-widest">Ayush Patient Portal</h4>
                      <p className="text-[10px] text-shifa-charcoal/75 leading-normal">Live health markers, herbal prescriptions & history</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/60 hover:bg-white p-3 rounded-xl hover:translate-x-1.5 transition-all duration-300 text-left border border-shifa-green/5 shadow-sm">
                    <div className="p-2.5 bg-shifa-green rounded-xl text-shifa-gold shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-[#112421] uppercase tracking-widest">full body massage chair therapy</h4>
                      <p className="text-[10px] text-shifa-charcoal/75 leading-normal">Advanced physical tension relief & systemic circulation boost</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-shifa-green/10 bg-shifa-green/90 -mx-6 -mb-6 p-5 rounded-b-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-shifa-gold/10 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-shifa-gold block">DEMO LIVE PATIENT PROFILE</span>
                  <p className="text-xs text-white mt-1">Logged profile: <strong className="text-shifa-gold font-bold">Faseeh Ahmad</strong></p>
                  <button
                    onClick={() => setCurrentPage('portal')}
                    className="mt-2 text-xs text-white hover:text-shifa-gold hover:underline font-bold flex items-center gap-1 mx-auto transition cursor-pointer"
                  >
                    Open Patient Portal <ChevronRight className="w-3.5 h-3.5 text-shifa-gold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clinical Vital Statistics Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20">
        <div className="glass-premium rounded-3xl p-8 border border-white/50 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-shifa-green/10 premium-glow-emerald">
          <div className="text-center p-2 hover:scale-105 transition-transform duration-300">
            <span className="block text-4xl sm:text-5xl font-extrabold text-shifa-green font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-shifa-green to-[#235c4d]">18,500+</span>
            <span className="text-[9px] sm:text-[10px] text-shifa-gold-dark uppercase tracking-widest font-extrabold mt-2.5 block">Patients Restored</span>
          </div>
          <div className="text-center p-2 pt-6 md:pt-2 hover:scale-105 transition-transform duration-300">
            <span className="block text-4xl sm:text-5xl font-extrabold text-shifa-green font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-shifa-green to-[#235c4d]">12+</span>
            <span className="text-[9px] sm:text-[10px] text-shifa-gold-dark uppercase tracking-widest font-extrabold mt-2.5 block">Super Specialists</span>
          </div>
          <div className="text-center p-2 pt-6 md:pt-2 hover:scale-105 transition-transform duration-300">
            <span className="block text-4xl sm:text-5xl font-extrabold text-shifa-green font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-shifa-green to-[#235c4d]">100%</span>
            <span className="text-[9px] sm:text-[10px] text-shifa-gold-dark uppercase tracking-widest font-extrabold mt-2.5 block">Pure Medicine</span>
          </div>
          <div className="text-center p-2 pt-6 md:pt-2 hover:scale-105 transition-transform duration-300">
            <span className="block text-4xl sm:text-5xl font-extrabold text-shifa-green font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-shifa-green to-[#235c4d]">640+</span>
            <span className="text-[9px] sm:text-[10px] text-shifa-gold-dark uppercase tracking-widest font-extrabold mt-2.5 block">Herbal Formulas</span>
          </div>
        </div>
      </section>

      {/* 3. Core Wellness Philosophy (The Shifa Difference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-shifa-gold-dark bg-shifa-mint px-3.5 py-1 rounded-full border border-shifa-green/10">The Healing Science</span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1A2E2A] leading-tight">
            Harmonizing Clinical Humors & Organic Elements
          </h3>
          <p className="text-shifa-charcoal/75 text-sm leading-relaxed font-light">
            At M/S Shifa, we don't just treat symptoms. We diagnose the baseline biological makeup of the patient. Unani medicine aligns the vital humors (mizaj) while Ayurvedic therapy purifies life-force elements. Together, they create a synergistic biological recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Unani Tibb Panel */}
          <div className="bg-white p-8 rounded-3xl border border-shifa-green/10 shadow-md space-y-6 shifa-card-hover text-left flex flex-col justify-between relative overflow-hidden group">
            {/* Soft decorative background tint on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E8F0ED]/10 to-[#cbb474]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-shifa-green text-shifa-gold flex items-center justify-center font-bold font-serif text-lg rotate-3 group-hover:rotate-12 transition-all duration-300 shadow-sm border border-shifa-gold/25">
                ع
              </div>
              <div>
                <h4 className="text-xl font-bold text-shifa-charcoal font-serif tracking-tight">Unani-Tibb (Humoral Balance)</h4>
                <p className="text-shifa-charcoal/80 font-sans text-xs sm:text-sm leading-relaxed mt-2 font-light">
                  Originated by Hippocrates and refined spectacularly by Ibn Sina (Avicenna), Unani medicine concentrates on the four humors: <strong>Dam</strong> (Blood), <strong>Balgham</strong> (Phlegm), <strong>Safra</strong> (Yellow Bile), and <strong>Sauda</strong> (Black Bile). Health represents a supreme state of humoral luxury and equilibrium.
                </p>
              </div>
            </div>
            
            <ul className="text-xs text-shifa-green space-y-2.5 font-bold font-mono pt-4 border-t border-shifa-green/5 relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Focus on Mizaj (Physiological Temperament)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Regimental Ilaj-bil-Tadbeer & Diet Therapy
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Purifying system detox via clinical Hijama
              </li>
            </ul>
          </div>

          {/* Ayurveda Panel */}
          <div className="bg-white p-8 rounded-3xl border border-shifa-green/10 shadow-md space-y-6 shifa-card-hover text-left flex flex-col justify-between relative overflow-hidden group">
            {/* Soft decorative background tint on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E8F0ED]/10 to-[#cbb474]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-shifa-green text-shifa-gold flex items-center justify-center font-bold font-serif text-lg -rotate-3 group-hover:-rotate-12 transition-all duration-300 shadow-sm border border-shifa-gold/25">
                ॐ
              </div>
              <div>
                <h4 className="text-xl font-bold text-shifa-charcoal font-serif tracking-tight">Ayurveda (Tri-Dosha Balancing)</h4>
                <p className="text-shifa-charcoal/80 font-sans text-xs sm:text-sm leading-relaxed mt-2 font-light">
                  Derived from ancient Vedic knowledge, Ayurveda manages the physical system through three biological energies (Doshas): <strong>Vata</strong> (Air/Ether), <strong>Pitta</strong> (Fire/Water), and <strong>Kapha</strong> (Earth/Water). Harmony of the elements activates the vital fire (Agni) and heals tissue stagnation (Ama).
                </p>
              </div>
            </div>
            
            <ul className="text-xs text-shifa-green space-y-2.5 font-bold font-mono pt-4 border-t border-shifa-green/5 relative z-10">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Restores structural vitality via Panchakarma
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Longevity rejuvenation using Rasayanas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-shifa-gold"></span>
                Customized raw botanical formulas
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Departments Slider Teaser */}
      <section className="bg-gradient-to-b from-[#FAFBF9] via-[#F4F6F3] to-[#FAFBF9] py-20 border-y border-shifa-green/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-shifa-mint/40 rounded-full blur-3xl pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-shifa-green/10">
            <div className="space-y-3 text-left">
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-shifa-gold-dark bg-shifa-mint px-3.5 py-1 rounded-full border border-shifa-green/10">Specialist Care</span>
              <h3 className="text-3xl font-serif font-bold text-shifa-charcoal tracking-tight">Clinical Departments</h3>
              <p className="text-shifa-charcoal/70 max-w-xl text-sm font-light">Explore our fully staffed, highly hygienic clinical hubs equipped with traditional raw herbal chemistry, modern diagnostic checks, and expert practitioners.</p>
            </div>
            <button
              onClick={() => setCurrentPage('departments')}
              className="text-shifa-green hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shrink-0 bg-white hover:bg-shifa-green px-5 py-3 rounded-xl border border-shifa-green/10 shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer font-sans"
            >
              <span>See Detailed Treatments</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.slice(0, 3).map((dept) => (
              <div
                key={dept.id}
                className="bg-white/80 backdrop-blur-sm p-7 rounded-3xl border border-shifa-green/5 shadow-md flex flex-col justify-between shifa-card-hover group text-left relative overflow-hidden transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 bg-shifa-mint text-shifa-green rounded-2xl flex items-center justify-center font-bold text-lg border border-shifa-green/5 shadow-sm group-hover:bg-shifa-green group-hover:text-shifa-gold transition-all duration-500">
                    🌿
                  </div>
                  <h4 className="text-lg font-bold text-shifa-charcoal font-serif leading-snug group-hover:text-shifa-green transition duration-300">
                    {dept.name}
                  </h4>
                  <p className="text-shifa-charcoal/80 text-xs leading-relaxed line-clamp-3 font-light">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-shifa-green/5 flex justify-between items-center text-xs">
                  <span className="text-shifa-gold-dark font-extrabold uppercase tracking-widest text-[9px] bg-shifa-mint/65 px-2.5 py-1 rounded-md border border-shifa-green/5">{dept.specialties.length} Specialties</span>
                  <button
                    onClick={() => {
                      setCurrentPage('departments');
                    }}
                    className="text-shifa-green hover:text-shifa-charcoal font-bold hover:underline flex items-center gap-0.5"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Apothecary Pharmacy Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#123A2F] via-[#102C24] to-[#0A2019] rounded-3xl p-8 md:p-14 text-white border border-shifa-gold/20 relative overflow-hidden text-left shadow-2xl">
          {/* Animated decorative gold shimmer dust and auroras */}
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-shifa-gold/10 rounded-full blur-[120px] pointer-events-none animate-aurora-slow" />
          <div className="absolute left-[-10%] bottom-[-10%] w-[350px] h-[350px] bg-[#9BC4B5]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="absolute right-0 bottom-0 text-9xl text-white/5 font-serif translate-y-10 select-none opacity-20">🫙</div>
          
          <div className="max-w-2xl space-y-7 relative z-10">
            <span className="text-[9px] font-extrabold text-shifa-gold uppercase tracking-widest block bg-[#1A2E2A] w-fit px-3.5 py-1 rounded-full border border-shifa-gold/20 shadow-sm">
              Shifa Quality Standard
            </span>
            <h3 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight tracking-tight text-white">
              Genuine Traditional Alchemy From Our Live Apothecary
            </h3>
            <p className="text-sm text-shifa-mint/95 leading-relaxed font-light max-w-xl">
              We operate an in-house pharmacy preparation chamber. Our authentic Talbina, organic raw Honey, premium Dry Fruits, and specialized botanical Immunity boosters conform strictly to classical wellness recipes yet undergo rigorous sanitary safety tests.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-left">
              <div className="bg-[#1A2E2A]/70 p-4 rounded-xl border border-white/5 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <span className="text-shifa-gold font-extrabold block text-[10px] uppercase tracking-widest">Strict Purity</span>
                <span className="text-[11px] text-shifa-mint/80 mt-1 block">Zero heavy metals</span>
              </div>
              <div className="bg-[#1A2E2A]/70 p-4 rounded-xl border border-white/5 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <span className="text-shifa-gold font-extrabold block text-[10px] uppercase tracking-widest">Fresh Stocks</span>
                <span className="text-[11px] text-shifa-mint/80 mt-1 block">Hand-ground weekly</span>
              </div>
              <div className="bg-[#1A2E2A]/70 p-4 rounded-xl border border-white/5 shadow-sm hover:scale-[1.02] transition-transform duration-300 col-span-2 sm:col-span-1">
                <span className="text-shifa-gold font-extrabold block text-[10px] uppercase tracking-widest">Authentic Recipes</span>
                <span className="text-[11px] text-shifa-mint/80 mt-1 block">Siddha & Unani texts</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setCurrentPage('pharmacy')}
                className="bg-white hover:bg-shifa-mint text-shifa-green font-extrabold px-7 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95 border-0 text-left outline-none select-none luxury-button-glow"
              >
                <ShoppingBag className="w-4 h-4 text-shifa-green animate-bounce" />
                Visit Apothecary Pharmacy Shop
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comprehensive Doctor Finder Teaser */}
      <section className="bg-gradient-to-b from-transparent via-[#F5F7F5] to-transparent py-20 border-t border-shifa-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto text-center">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-shifa-gold-dark bg-shifa-mint px-3.5 py-1 rounded-full border border-shifa-green/10">Holistic Experts</span>
            <h3 className="text-3xl font-serif font-bold text-shifa-charcoal tracking-tight">Consult Our Expert Physicians</h3>
            <p className="text-xs sm:text-sm text-shifa-charcoal/70 font-light leading-relaxed">
              Our traditional practitioners are specialists in both ancient texts and integrated anatomy systems. Receive precise biological diagnostic check-ups, traditional pulse analyses, and optimized treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-7 rounded-3xl border border-shifa-green/5 shadow-md hover:border-shifa-green transition-all duration-300 text-left space-y-5 shifa-card-hover flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="p-3 bg-shifa-mint text-shifa-green w-fit rounded-2xl shadow-sm group-hover:bg-shifa-green group-hover:text-shifa-gold transition-colors duration-500">
                  <Activity className="w-5 h-5 text-shifa-green group-hover:text-shifa-gold" />
                </div>
                <h4 className="text-base font-bold text-shifa-charcoal font-serif tracking-tight">DR MA SUBHAN JAVEED</h4>
                <p className="text-xs text-shifa-charcoal/80 bg-[#FAFBF9]/90 border border-shifa-green/5 p-3 rounded-xl font-light leading-relaxed">
                  BUMS Unani Clinical Specialist. Focuses on safe, highly therapeutic Hijama wet & dry cupping remedies to expel systemic toxins, purify blood, and instantly improve local joint and muscle mobility.
                </p>
              </div>
              <button
                onClick={() => {
                  if (setSelectedDoctorId) setSelectedDoctorId('dr-ma-subhan-javeed-hijama');
                  setCurrentPage('booking');
                }}
                className="text-xs text-shifa-green hover:text-shifa-charcoal font-bold flex items-center gap-1.5 transition-all select-none group-hover:translate-x-1.5 cursor-pointer"
              >
                Schedule Consult <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-shifa-green/5 shadow-md hover:border-shifa-green transition-all duration-300 text-left space-y-5 shifa-card-hover flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="p-3 bg-shifa-mint text-shifa-green w-fit rounded-2xl shadow-sm group-hover:bg-shifa-green group-hover:text-shifa-gold transition-colors duration-500">
                  <Activity className="w-5 h-5 text-shifa-green group-hover:text-shifa-gold" />
                </div>
                <h4 className="text-base font-bold text-shifa-charcoal font-serif tracking-tight">DR MA SUBHAN JAVEED</h4>
                <p className="text-xs text-shifa-charcoal/80 bg-[#FAFBF9]/90 border border-shifa-green/5 p-3 rounded-xl font-light leading-relaxed">
                  Biomechanical & Massage Expert. Specialized in configuring safe orthopedic massage protocols, targeting specific somatic reflex points down the spine and limbs for profound tension release.
                </p>
              </div>
              <button
                onClick={() => {
                  if (setSelectedDoctorId) setSelectedDoctorId('dr-ma-subhan-javeed-massage');
                  setCurrentPage('booking');
                }}
                className="text-xs text-shifa-green hover:text-shifa-charcoal font-bold flex items-center gap-1.5 transition-all select-none group-hover:translate-x-1.5 cursor-pointer"
              >
                Schedule Consult <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-shifa-green/5 shadow-md hover:border-shifa-green transition-all duration-300 text-left space-y-5 shifa-card-hover flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="p-3 bg-shifa-mint text-shifa-green w-fit rounded-2xl shadow-sm group-hover:bg-shifa-green group-hover:text-shifa-gold transition-colors duration-500">
                  <Activity className="w-5 h-5 text-shifa-green group-hover:text-shifa-gold" />
                </div>
                <h4 className="text-base font-bold text-shifa-charcoal font-serif tracking-tight">DR MA SUBHAN JAVEED</h4>
                <p className="text-xs text-shifa-charcoal/80 bg-[#FAFBF9]/90 border border-shifa-green/5 p-3 rounded-xl font-light leading-relaxed">
                  General Healer & Diagnostician. Represents our primary care anchor, diagnosing cold/flu, managing fevers, performing general physical checkups and prescribing customized botanical infusions.
                </p>
              </div>
              <button
                onClick={() => {
                  if (setSelectedDoctorId) setSelectedDoctorId('dr-ma-subhan-javeed-clinical');
                  setCurrentPage('booking');
                }}
                className="text-xs text-shifa-green hover:text-shifa-charcoal font-bold flex items-center gap-1.5 transition-all select-none group-hover:translate-x-1.5 cursor-pointer"
              >
                Schedule Consult <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="pt-6">
            <button
              onClick={() => setCurrentPage('doctors')}
              className="inline-flex items-center gap-2 bg-[#1A2E2A] text-shifa-gold hover:text-white hover:bg-shifa-green font-extrabold px-7 py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 border border-shifa-gold/15 shadow-lg cursor-pointer"
            >
              <span>View Specialist Vaidyas & Hakims</span>
              <ChevronRight className="w-4 h-4 text-shifa-gold animate-bounce" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
