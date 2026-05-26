import React, { useState } from 'react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { ShieldAlert, Sparkles, ChevronRight, ArrowRight, Check, Activity, GraduationCap } from 'lucide-react';
import { Department } from '../types';

interface DepartmentsProps {
  setCurrentPage: (page: string) => void;
  setSelectedDoctorId: (id: string | null) => void;
}

export default function Departments({ setCurrentPage, setSelectedDoctorId }: DepartmentsProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);

  const selectedDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const departmentDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDeptId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left animate-fade-in font-sans">
      {/* Page Header */}
      <section className="space-y-3 max-w-2xl text-left">
        <span className="text-xs uppercase tracking-widest font-bold text-shifa-green">Holistic Roster</span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-shifa-charcoal leading-tight uppercase">
          Specialist Clinical Divisions
        </h1>
        <p className="text-shifa-charcoal/70 text-sm">
          At M/S Shifa, each department is a center of excellence matching traditional formulation frameworks to customized, safe physical interventions.
        </p>
      </section>

      {/* Main Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Vertical Department Selector Tabs */}
        <div className="lg:col-span-4 space-y-3">
          {DEPARTMENTS.map((dept) => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`w-full text-left p-4 rounded-2xl border transition duration-200 flex flex-col items-start gap-2 focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'bg-shifa-green border-shifa-green text-white shadow-sm'
                    : 'bg-white border-shifa-charcoal/10 hover:border-shifa-green text-shifa-charcoal hover:bg-shifa-mint/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-shifa-gold' : 'text-shifa-green'}`}>
                    {dept.id === 'kayachikitsa-moalajat' || dept.id === 'panchakarma-tadbeer' ? 'Premier Div' : 'Core Div'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base leading-snug">
                  {dept.name}
                </h4>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-shifa-mint' : 'text-shifa-charcoal/60'}`}>
                  {dept.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Side: Deep Treatment Details & Specialists available */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-shifa-charcoal/10 shadow-sm space-y-8">
          {/* Department Overview */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-shifa-mint text-shifa-green px-3.5 py-1 rounded-full text-xs font-bold border border-shifa-green/10 uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3.5 h-3.5 text-shifa-green" /> ACTIVE DEPARTMENT PROFILE
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-shifa-charcoal leading-tight">
              {selectedDept.name}
            </h2>
            <p className="text-shifa-charcoal/80 font-sans text-sm sm:text-base leading-relaxed">
              {selectedDept.description}
            </p>
          </div>

          {/* Core Specialties list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3.5">
              <h3 className="font-serif font-bold text-shifa-charcoal border-b border-shifa-charcoal/10 pb-2 flex items-center gap-2 uppercase tracking-wider text-xs">
                <span className="w-1.5 h-4 bg-shifa-green rounded-sm" />
                Speciality Focus
              </h3>
              <ul className="space-y-2.5 text-xs font-sans text-shifa-charcoal/90 font-medium">
                {selectedDept.specialties.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-shifa-green shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Methods Card */}
            <div className="bg-[#F5F7F5] p-5 rounded-2xl border border-shifa-charcoal/10 space-y-3.5">
              <h3 className="font-serif font-bold text-shifa-charcoal flex items-center gap-2 uppercase tracking-wider text-xs border-b border-shifa-charcoal/10 pb-2">
                <span className="w-1.5 h-4 bg-shifa-green rounded-sm" />
                Therapy Protocols
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-shifa-charcoal/80 font-medium">
                {selectedDept.treatmentMethods.map((method, idx) => (
                  <li key={idx} className="flex gap-2.5 items-center bg-white py-2 px-3 rounded-xl border border-shifa-charcoal/10">
                    <span className="text-[10px] bg-shifa-mint text-shifa-green w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Roster of Healers */}
          <div className="space-y-4 pt-4 border-t border-shifa-charcoal/10">
            <div className="flex justify-between items-center bg-shifa-mint py-2.5 px-4 rounded-xl border border-shifa-green/10 font-mono text-[10px]">
              <span className="font-bold text-shifa-green uppercase tracking-wider">
                Practitioners On Duty ({departmentDoctors.length})
              </span>
              <span className="text-shifa-green font-black uppercase">Schedule active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departmentDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-shifa-charcoal/10 hover:border-shifa-green hover:shadow-sm transition duration-200 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border border-shifa-charcoal/10 bg-shifa-mint shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider bg-shifa-mint text-shifa-green font-bold px-2.5 py-0.5 rounded-full">
                        {doc.experienceYears} Yrs Experience
                      </span>
                      <h4 className="font-serif font-bold text-shifa-charcoal text-sm leading-snug">
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-shifa-charcoal/60 font-semibold line-clamp-1 leading-normal">
                        {doc.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-shifa-charcoal/80 line-clamp-2 my-3 italic leading-relaxed">
                    "{doc.bio}"
                  </p>

                  <div className="pt-3 border-t border-shifa-charcoal/10 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-bold text-shifa-green font-mono">★ {doc.rating} RATING</span>
                    <button
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setCurrentPage('booking');
                      }}
                      className="flex items-center gap-1 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold text-[9px] uppercase tracking-wider py-2 px-3.5 rounded-lg transition border-0 cursor-pointer"
                    >
                      Instant Book <ArrowRight className="w-3 h-3 text-shifa-gold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
