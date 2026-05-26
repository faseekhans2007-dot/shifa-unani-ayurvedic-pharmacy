import React, { useState } from 'react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';
import { Search, Filter, Calendar, Award, Star, HeartPulse, User, GraduationCap } from 'lucide-react';

interface DoctorsProps {
  setCurrentPage: (page: string) => void;
  setSelectedDoctorId: (id: string | null) => void;
}

export default function Doctors({ setCurrentPage, setSelectedDoctorId }: DoctorsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  // Search and filter logic
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialties.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDeptId === 'all' || doc.departmentId === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left animate-fade-in font-sans">
      {/* Header */}
      <section className="space-y-3 max-w-2xl text-left">
        <span className="text-xs uppercase tracking-widest font-bold text-shifa-green">Team Shifa</span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-shifa-charcoal leading-tight uppercase">
          Specialist Traditional Healers
        </h1>
        <p className="text-shifa-charcoal/70 text-sm">
          Consult with highly certified clinical practitioners of Unani-Tibb and classical Indian Ayurveda, holding decades of real clinical experience.
        </p>
      </section>

      {/* Filters & Search Control Bar */}
      <div className="bg-[#F5F7F5] p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3.5 text-shifa-charcoal/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, degrees, or disease specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-shifa-charcoal/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-shifa-green focus:border-transparent transition"
          />
        </div>

        {/* Department Dropdown Selector */}
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3.5 top-3.5 text-shifa-charcoal/50 w-4 h-4" />
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-shifa-charcoal/10 text-sm focus:outline-none focus:ring-2 focus:ring-shifa-green focus:border-transparent appearance-none bg-white transition cursor-pointer font-bold text-shifa-charcoal"
          >
            <option value="all">All Specialties & Divisions</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Counter Info text */}
        <div className="md:col-span-3 text-right text-xs text-shifa-charcoal/60 font-bold uppercase tracking-widest px-2">
          FOUND <strong className="text-shifa-green font-mono">{filteredDoctors.length}</strong> PRACTITIONERS
        </div>
      </div>

      {/* Grid of Doctors Card */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-3xl border border-shifa-charcoal/10 max-w-md mx-auto space-y-3">
          <p className="text-lg font-bold text-shifa-charcoal font-serif">No specialists match search terms</p>
          <p className="text-xs text-shifa-charcoal/60">We couldn't locate any clinician for your terms. Try broadening your query or selecting "All specialties".</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDeptId('all');
            }}
            className="text-xs text-shifa-green font-bold uppercase tracking-wider underline border-0 bg-transparent cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const docDept = DEPARTMENTS.find((d) => d.id === doc.departmentId);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-shifa-charcoal/10 overflow-hidden shadow-sm hover:border-shifa-green transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Profile Info background */}
                <div className="p-6 pb-4 space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl border border-shifa-charcoal/10 object-cover bg-[#F5F7F5] shrink-0"
                    />
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] uppercase tracking-wider bg-shifa-mint text-shifa-green font-bold px-2.5 py-0.5 rounded-full inline-block">
                        {docDept ? docDept.name : 'Vaidya / Hakim'}
                      </span>
                      <h3 className="font-serif font-bold text-shifa-charcoal text-base sm:text-lg">
                        {doc.name}
                      </h3>
                      <p className="text-[10px] text-shifa-charcoal/65 font-bold uppercase tracking-wider leading-tight">
                        {doc.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-shifa-charcoal/80 text-xs italic leading-relaxed line-clamp-3">
                    "{doc.bio}"
                  </p>
                </div>

                {/* Performance stats bar */}
                <div className="bg-[#F5F7F5] px-6 py-3 border-y border-shifa-charcoal/10 grid grid-cols-3 gap-1 text-center font-mono">
                  <div>
                    <span className="block text-xs font-bold text-shifa-charcoal">{doc.experienceYears}+ Yrs</span>
                    <span className="text-[9px] text-[#1A2E2A]/50 font-bold uppercase tracking-wider">Experience</span>
                  </div>
                  <div className="border-x border-shifa-charcoal/10">
                    <span className="block text-xs font-bold text-shifa-green">★ {doc.rating}</span>
                    <span className="text-[9px] text-[#1A2E2A]/50 font-bold uppercase tracking-wider">Rating</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-shifa-charcoal">{(doc.patientsServed / 1000).toFixed(1)}k+</span>
                    <span className="text-[9px] text-[#1A2E2A]/50 font-bold uppercase tracking-wider">Outpatients</span>
                  </div>
                </div>

                {/* Specialties Tags & Availability Grid */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-[#1A2E2A]/40 uppercase tracking-widest font-bold block">Specialty Focus</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {doc.specialties.map((spec, sidx) => (
                          <span
                            key={sidx}
                            className="bg-shifa-mint text-shifa-green text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide border border-shifa-green/5"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] text-[#1A2E2A]/40 uppercase tracking-widest font-bold block">Consultation Days</span>
                      <div className="flex gap-1 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                          const isAvailable = doc.availability.includes(d);
                          return (
                            <span
                              key={d}
                              className={`text-[9.5px] px-2 py-0.5 rounded font-bold tracking-wider ${
                                isAvailable
                                  ? 'bg-shifa-green text-white border border-shifa-green/15'
                                  : 'bg-shifa-mint/40 text-shifa-charcoal/30'
                              }`}
                            >
                              {d}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Appt Direct Button */}
                  <div className="pt-4 border-t border-shifa-charcoal/10 mt-4">
                    <button
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setCurrentPage('booking');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition duration-150 transform active:scale-[0.98] cursor-pointer border-0 shadow-md"
                    >
                      <Calendar className="w-4 h-4 text-shifa-gold" />
                      Request Appointment
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
