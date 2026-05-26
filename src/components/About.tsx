import React from 'react';
import { Leaf, Award, Compass, ShieldCheck, CheckCircle2, HeartPulse, UserCheck } from 'lucide-react';

export default function About() {
  const principles = [
    {
      icon: <Compass className="w-6 h-6 text-shifa-green" />,
      title: "Hijama Specialist",
      desc: "Our center specializes in certified, clinical Hijama (cupping therapy) administered by certified practitioners under strict sterilization and safety standards to effectively extract stagnation and purify blood humors."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-shifa-green" />,
      title: "Homeopathic Medicine and Treatment",
      desc: "We offer professional, clinical homeopathic treatments using natural remedies prepared through systematic dilution to stimulate the body's self-healing mechanisms and handle chronic issues gracefully."
    },
    {
      icon: <Award className="w-6 h-6 text-shifa-green" />,
      title: "Modern Lab Screenings",
      desc: "Every raw herbal harvest is carefully screened for pesticide residues, yeast content, and heavy metal concentrations to ensure absolute safety alongside classic potency."
    }
  ];

  const milestones = [
    { year: "2000", event: "Founded as a traditional Unani and Ayurvedic clinical center, specializing in botanical extracts and specialized natural healing therapeutics." },
    { year: "2008", event: "Expanded diagnostic methodologies to incorporate certified, ultra-sterile clinical Hijama cupping therapies and specialized treatment chambers." },
    { year: "2016", event: "Established a dedicated homeopathic department, integrating natural dilution solutions and customized chronic health plans." },
    { year: "2026", event: "Currently running as a unified digital healthcare platform, offering clean online consult notes, integrated clinical bookings, and doctor consult pathways." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left animate-fade-in font-sans">
      {/* 1. Introductory Header with Elegant Dual Badging */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-shifa-mint text-shifa-green px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-shifa-green/10">
          <Leaf className="w-3.5 h-3.5 text-shifa-green" /> Since 2000 • Shifa Legacy
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-shifa-charcoal leading-tight uppercase">
          Where Ancient Wisdom Unifies with Modern Medicine
        </h1>
        <p className="text-shifa-charcoal/80 font-sans text-sm sm:text-base leading-relaxed">
          M/S Shifa Unani Ayurvedic Pharmacy is a premier healthcare institution committed to restoring natural bodily balance. We combine the botanical science of Arabic/Persian <strong>Unani-Tibb</strong> with the Sanskrit-written bio-energies of <strong>Ayurveda</strong>, offering comprehensive clinical specialist treatment and trusted herbal pharmacopoeia under one unified roof.
        </p>
      </section>

      {/* 2. Philosophy & Quality Pillars */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="bg-shifa-green rounded-3xl p-8 text-white space-y-6 border border-shifa-gold/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 text-7xl text-white/5 opacity-30 select-none">🍯</div>
            <h3 className="font-serif text-2xl text-shifa-gold font-bold">The Gold Seal of Purity</h3>
            <p className="text-xs text-shifa-mint leading-relaxed font-light">
              Unlike generic commercial brands which heat formulations to accelerate productivity, our apothecary maintains strict classical speeds. Decocting cold processes, low-temperature herb infusion, and pestle-grinding keep herbal structural properties intact.
            </p>
            <div className="space-y-4 pt-2 font-medium">
              <div className="flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-shifa-gold shrink-0 mt-0.5" />
                <span>Herbs sourced organically from sustainable western Himalayan farms and high dry organic fields.</span>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-shifa-gold shrink-0 mt-0.5" />
                <span>Zero chemical active binders, industrial synthetic flavors, or artificial chemical color dyes in our Churna.</span>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-shifa-gold shrink-0 mt-0.5" />
                <span>Supervised directly by certified Vaidyas and Hakims with multiple clinical accolades.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-2xl font-serif font-bold text-shifa-charcoal">Our Core Clinical Pillars</h3>
          <div className="grid grid-cols-1 gap-6">
            {principles.map((p, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-shifa-mint/40 border border-shifa-charcoal/10 transition">
                <div className="p-3 bg-white rounded-lg h-fit text-shifa-green border border-shifa-charcoal/10 shadow-sm">
                  {p.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-shifa-charcoal font-serif text-base">{p.title}</h4>
                  <p className="text-xs text-shifa-charcoal/80 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Unyielding Legacy timeline */}
      <section className="bg-[#F5F7F5] p-8 rounded-3xl border border-shifa-charcoal/10">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h3 className="text-2xl font-serif font-bold text-shifa-charcoal">Milestones of Shifa Preservation</h3>
          <p className="text-xs text-shifa-charcoal/60 uppercase font-bold tracking-widest">How we grew standard clinical services over three golden decades.</p>
        </div>

        <div className="relative border-l-2 border-shifa-green md:ml-24 max-w-4xl mx-auto space-y-8 pl-6 md:pl-8 py-2">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative">
              {/* timeline bubble */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-shifa-green border-4 border-white shadow-sm" />
              
              <div className="flex flex-col md:flex-row md:gap-6 items-start">
                <span className="font-sans font-black text-xl text-shifa-green leading-none mb-1 md:w-20 shrink-0 md:pt-1">
                  {m.year}
                </span>
                <div className="space-y-1">
                  <p className="text-xs text-shifa-charcoal/80 leading-relaxed font-sans mt-0.5">
                    {m.event}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Patients Testimony Spotlight */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-shifa-charcoal text-center">Spreading Shifa (Cure) • Recovery Stories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-shifa-charcoal/10 shadow-sm relative space-y-4 hover:border-shifa-green transition">
            <span className="text-6xl text-shifa-green/10 leading-none absolute -top-4 left-4 font-serif select-none">“</span>
            <p className="text-xs text-shifa-charcoal/80 italic pt-4 relative z-10 leading-relaxed">
              "I suffered from terrible gastrointestinal acidity and recurring physical exhaustion for six years. Dr. Yasmin Khan carefully analysed my constitutional humor (Mizaj) and discovered excess heat buildup in my gut. Following their customized herbal diet adjustments and twice-daily Arq-e-Shahtara, my digestive tract is fully healed."
            </p>
            <div className="border-t border-shifa-charcoal/10 pt-3 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-shifa-charcoal">Ahmad Raza</span>
                <span className="text-[10px] text-shifa-charcoal/60">Treated for Safra Gut Acidity</span>
              </div>
              <span className="text-[10px] bg-shifa-mint text-shifa-green px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Unani Care</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-shifa-charcoal/10 shadow-sm relative space-y-4 hover:border-shifa-green transition">
            <span className="text-6xl text-shifa-green/10 leading-none absolute -top-4 left-4 font-serif select-none">“</span>
            <p className="text-xs text-shifa-charcoal/80 italic pt-4 relative z-10 leading-relaxed">
              "Heavy physical stiffness in my back restricted my daily movement. My spine health has completely recovered after undergoing Shirodhara and customized Basti treatments at Shifa. Dr. Ramdas Iyer has given me a new lease of life. The patient portal is exceptionally clean and helped me track my Dosha transition easily."
            </p>
            <div className="border-t border-shifa-charcoal/10 pt-3 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-shifa-charcoal">Siddharth Sen</span>
                <span className="text-[10px] text-shifa-charcoal/60">Treated for Spinal Sciatica</span>
              </div>
              <span className="text-[10px] bg-shifa-mint text-shifa-green px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Ayurveda Care</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
