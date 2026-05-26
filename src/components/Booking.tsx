import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, DEMO_PATIENT } from '../data/hospitalData';
import { Appointment } from '../types';
import { Calendar, Clock, Sparkles, CheckCircle2, ChevronRight, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AuthForm from './AuthForm';

interface BookingProps {
  selectedDoctorId: string | null;
  setSelectedDoctorId: (id: string | null) => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  isLoggedIn: boolean;
  setCurrentPage: (page: string) => void;
}

const TIME_SLOTS = [
  { label: 'Morning Slots', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM'] },
  { label: 'Afternoon Slots', slots: ['02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM'] },
  { label: 'Evening Slots', slots: ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'] },
];

export default function Booking({
  selectedDoctorId,
  setSelectedDoctorId,
  appointments,
  setAppointments,
  isLoggedIn,
  setCurrentPage,
}: BookingProps) {
  // Booking Form State
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Custom form validation message (prevents window.alert)
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation Success Popup State
  const [bookedAppt, setBookedAppt] = useState<Appointment | null>(null);

  // Sync state if doctorId is chosen from list
  useEffect(() => {
    if (selectedDoctorId) {
      setDoctorId(selectedDoctorId);
      const chosenDoc = DOCTORS.find((d) => d.id === selectedDoctorId);
      if (chosenDoc) {
        setDepartmentId(chosenDoc.departmentId);
      }
    }
  }, [selectedDoctorId]);

  // Pre-populate input fields if logged in
  useEffect(() => {
    let active = true;
    const fetchUserData = async () => {
      if (isLoggedIn && auth.currentUser) {
        const user = auth.currentUser;
        const isDemoEmail = user.email === 'kfasee877@gmail.com' || (user.email && user.email.startsWith('demo-patient'));
        const defaultName = user.displayName || (isDemoEmail ? 'Faseeh Ahmad' : (user.email?.split('@')[0] || 'Patient'));
        const defaultEmail = user.email || '';
        const defaultPhone = user.phoneNumber || DEMO_PATIENT.phone;

        if (active) {
          setPatientName(defaultName);
          setPatientEmail(defaultEmail);
          setPatientPhone(defaultPhone);
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && active) {
            const data = userDoc.data();
            if (data.name) setPatientName(data.name);
            if (data.phone) setPatientPhone(data.phone || defaultPhone);
            if (data.email) setPatientEmail(data.email || defaultEmail);
          }
        } catch (err) {
          console.error("Error checking user profile document in Booking:", err);
        }
      } else if (active) {
        setPatientName('');
        setPatientPhone('');
        setPatientEmail('');
      }
    };

    fetchUserData();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  // Handle department changes -> auto update doctor list
  const handleDepartmentChange = (deptId: string) => {
    setDepartmentId(deptId);
    setDoctorId(''); // reset doctor
  };

  // Get doctors of the chosen department
  const filteredDoctors = departmentId
    ? DOCTORS.filter((doc) => doc.departmentId === departmentId)
    : DOCTORS;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submit initiation. State values:", {
      doctorId,
      date,
      time,
      patientName,
      patientPhone,
      patientEmail,
      departmentId,
      notes
    });

    if (!doctorId || !date || !time || !patientName || !patientPhone || !patientEmail) {
      console.warn("Validation failed due to missing/empty field(s):", {
        doctorId: !doctorId ? "MISSING" : doctorId,
        date: !date ? "MISSING" : date,
        time: !time ? "MISSING" : time,
        patientName: !patientName ? "MISSING" : patientName,
        patientPhone: !patientPhone ? "MISSING" : patientPhone,
        patientEmail: !patientEmail ? "MISSING" : patientEmail
      });
      setErrorMsg('Please fill out all mandatory clinical fields.');
      return;
    }
    setErrorMsg('');

    const docRef = DOCTORS.find((d) => d.id === doctorId);
    const dept = DEPARTMENTS.find((d) => d.id === (docRef ? docRef.departmentId : departmentId));

    const newAppt: Appointment = {
      id: `SHIFA-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: auth.currentUser?.uid || 'temp-id',
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      doctorName: docRef ? docRef.name : 'Chief Specialist',
      departmentId: docRef ? docRef.departmentId : departmentId,
      departmentName: dept ? dept.name : 'General OPC',
      date,
      time,
      status: 'Scheduled',
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      if (auth.currentUser) {
        // Save to real Firestore DB!
        console.log(`[Firestore] Attempting to write booking to collection 'bookings' with ID ${newAppt.id}:`, newAppt);
        await setDoc(doc(db, 'bookings', newAppt.id), newAppt);
        console.log(`[Firestore] Successfully created booking ${newAppt.id} in collection 'bookings'.`);
      } else {
        // Save locally if offline / fallback
        console.log("[Local Storage] Guest booking created. Saving locally:", newAppt);
        setAppointments([newAppt, ...appointments]);
      }
      setBookedAppt(newAppt);

      // Reset forms except pre-populated records
      if (!isLoggedIn) {
        setPatientName('');
        setPatientPhone('');
        setPatientEmail('');
      }
      setDate('');
      setTime('');
      setNotes('');
      setSelectedDoctorId(null);
    } catch (err) {
      console.error(`[Firestore] Booking write failed for ID ${newAppt.id}:`, err);
      handleFirestoreError(err, OperationType.CREATE, `bookings/${newAppt.id}`);
    }
  };


  // If successfully booked an appointment, render beautiful invoice details
  if (bookedAppt) {
    const docInfo = DOCTORS.find((d) => d.id === bookedAppt.doctorId);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-left animate-scale-in font-sans">
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-shifa-green shadow-xl space-y-6 relative">
          <div className="absolute top-0 right-0 bg-shifa-green text-white text-[10px] tracking-widest uppercase font-bold py-1.5 px-4 rounded-bl-xl rounded-tr-xl">
            Confirmed
          </div>

          <div className="flex items-center gap-4 border-b border-shifa-charcoal/10 pb-5">
            <div className="w-12 h-12 rounded-full bg-shifa-mint text-shifa-green flex items-center justify-center font-bold">
              <CheckCircle2 className="w-8 h-8 text-shifa-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-shifa-charcoal font-serif">Consultation Booked Successfully</h2>
              <p className="text-xs text-shifa-charcoal/60 mt-0.5">Booking Reference ID: <strong className="font-mono text-shifa-green">{bookedAppt.id}</strong></p>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 bg-[#F5F7F5] p-5 rounded-2xl border border-shifa-charcoal/10">
            <div>
              <span className="text-[10px] text-shifa-charcoal/50 font-bold uppercase tracking-widest block">Patient Name</span>
              <span className="text-sm font-bold text-shifa-charcoal">{bookedAppt.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] text-shifa-charcoal/50 font-bold uppercase tracking-widest block">Clinic Specialty</span>
              <span className="text-sm font-bold text-shifa-charcoal">{bookedAppt.departmentName}</span>
            </div>
            <div className="pt-2 border-t border-shifa-charcoal/10">
              <span className="text-[10px] text-shifa-charcoal/50 font-bold uppercase tracking-widest block">Assigned Healer</span>
              <span className="text-sm font-bold text-shifa-green font-serif">{bookedAppt.doctorName}</span>
            </div>
            <div className="pt-2 border-t border-shifa-charcoal/10">
              <span className="text-[10px] text-shifa-charcoal/50 font-bold uppercase tracking-widest block">Session Schedule</span>
              <span className="text-sm font-bold text-shifa-charcoal font-mono">
                {bookedAppt.date} @ {bookedAppt.time}
              </span>
            </div>
          </div>

          {/* Quick Healer bio */}
          {docInfo && (
            <div className="flex gap-4 p-4 rounded-xl border border-shifa-charcoal/10 bg-white shadow-sm">
              <img
                src={docInfo.image}
                alt={docInfo.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-shifa-charcoal/10"
              />
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] uppercase tracking-wider bg-shifa-mint text-shifa-green px-2 py-0.5 rounded font-bold">
                  Your Certified Healer
                </span>
                <p className="font-serif text-sm font-bold text-shifa-charcoal">{docInfo.name}</p>
                <p className="text-[11px] text-shifa-charcoal/60 leading-normal line-clamp-1">{docInfo.title}</p>
              </div>
            </div>
          )}

          {/* Clinical instructions list */}
          <div className="space-y-3 bg-shifa-mint p-5 rounded-2xl border border-shifa-green/10">
            <h4 className="text-xs font-bold text-shifa-green uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <AlertCircle className="w-4 h-4 text-shifa-green" />
              Pre-consultation Guidelines
            </h4>
            <ul className="text-xs text-shifa-charcoal/90 space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
              <li>Arrive strictly 10 minutes prior to your allocated slot for primary health check-in.</li>
              <li>For Ayurveda/Unani diagnosis, avoid heavy caffeine intake or heavy meals 2 hours prior to reading your pulse (Nadi Pariksha) or temperament (Mizaj).</li>
              <li>We preloaded this session into your <strong className="text-shifa-green">Patient Portal</strong> dashboard instantly.</li>
            </ul>
          </div>

          {/* CTA actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setBookedAppt(null);
                setCurrentPage('portal');
              }}
              className="flex-grow bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-3.5 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition shadow cursor-pointer border-0"
            >
              Go To Patient Portal Records
            </button>
            <button
              onClick={() => setBookedAppt(null)}
              className="px-5 py-3.5 border border-shifa-charcoal/10 text-shifa-charcoal hover:bg-[#F5F7F5] font-bold text-xs uppercase tracking-pills rounded-xl transition cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left animate-fade-in font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Booking instructions */}
        <div className="lg:col-span-5 space-y-6">
          <section className="space-y-3 text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-shifa-green">Digital Clinic Desk</span>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-shifa-charcoal leading-tight uppercase">
              Schedule Your Healing Consultation
            </h1>
            <p className="text-sm text-shifa-charcoal/70 leading-relaxed font-light">
              Submit your active symptoms and choose your traditional healer. We synchronize clinic appointments instantly so you experience minimal outpatient waiting times at our physical chambers.
            </p>
          </section>

          {/* Core Support Badging */}
          <div className="bg-shifa-green text-white p-6 rounded-3xl border border-shifa-gold/20 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#1A2E2A] text-shifa-gold px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-shifa-gold" /> Digital AYUSH Gateway
            </div>
            <h3 className="font-serif text-lg font-bold text-shifa-gold">Why Pre-Register Digitally?</h3>
            
            <ul className="text-xs space-y-3 text-shifa-mint/95 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-shifa-gold font-bold shrink-0 mt-0.5">✓</span>
                <span>Get diagnostic preference for pulse testing (Nadi Pariksha) in early non-fatigued hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-shifa-gold font-bold shrink-0 mt-0.5">✓</span>
                <span>Direct prescription persistence in our digital database. Access notes anytime.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-shifa-gold font-bold shrink-0 mt-0.5">✓</span>
                <span>Secure diagnostic temperament reports before physical intake.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: Interactive form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-shifa-charcoal/10 p-6 md:p-8 shadow-sm">
          {!isLoggedIn ? (
            <div className="space-y-6">
              <div className="bg-[#FAFBF9] border border-shifa-green/15 p-5 rounded-2xl space-y-2">
                <span className="text-shifa-green bg-shifa-mint px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Healer Reservation Gate
                </span>
                <p className="text-xs text-shifa-charcoal/80 leading-relaxed font-semibold">
                  We require an authenticated patient account to sync clinical history, elemental analysis, and direct dosage templates. Please login or register below to complete your booking.
                </p>
              </div>
              <AuthForm onSuccess={() => {}} titleText="Consultation Gateway" subText="Sign up or login to finalize your herbal chamber checkup." />
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-shifa-charcoal border-b border-shifa-charcoal/10 pb-3 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-5 h-5 text-shifa-green" />
                Chamber Scheduler
              </h3>

              {/* Custom confirmation errors */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-205 text-red-800 p-3.5 rounded-xl text-xs font-bold font-mono">
                  ⚠️ {errorMsg.toUpperCase()}
                </div>
              )}

              {/* Department Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-shifa-charcoal/60 block">Select Clinical Division *</label>
                <select
                  required
                  value={departmentId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 text-shifa-charcoal focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white transition cursor-pointer"
                >
                  <option value="">-- Choose Division --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection based on department selected */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-shifa-charcoal/60 block">Select Specialist Healer *</label>
                <select
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 text-shifa-charcoal focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white transition cursor-pointer"
                >
                  <option value="">-- Choose Specialist --</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.title.split(',')[1] || doc.title.split('(')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-shifa-charcoal/60 block">Consultation Date *</label>
                <input
                  required
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]} // Prevents back-dated slots
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3 text-shifa-charcoal focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white transition cursor-pointer"
                />
              </div>

              {/* Time Selector */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-shifa-charcoal/60 block">Preferred Session Time *</label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 text-shifa-charcoal focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white transition cursor-pointer"
                >
                  <option value="">-- Choose Time --</option>
                  {TIME_SLOTS.map((category) => (
                    <optgroup key={category.label} label={category.label} className="font-bold text-shifa-charcoal bg-white">
                      {category.slots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Personal Details section */}
            <div className="border-t border-shifa-charcoal/10 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-shifa-green uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-4 h-4 text-shifa-green" />
                Patient Personal details
              </h4>

              {isLoggedIn ? (
                <div className="bg-shifa-mint rounded-2xl p-4 text-xs text-shifa-green border border-shifa-green/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px]">Syncing Registered Account Profile:</p>
                    <span className="font-serif font-black text-sm block text-shifa-charcoal mt-1">{patientName}</span>
                    <span className="text-[10px] text-shifa-charcoal/60 block mt-0.5">{patientEmail} • {patientPhone}</span>
                  </div>
                  <span className="text-[9px] font-bold bg-shifa-green text-white px-3 py-1 uppercase tracking-widest rounded-full shrink-0">
                    Auto Filled
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-[#1A2E2A] bg-shifa-mint/45 p-3.5 rounded-xl text-left font-mono">
                  💡 ENTER NAME TO CONTINUE. REGISTERED PATIENTS LOG IN VIA PORTAL PAGE TO AUTO-FILL.
                </p>
              )}

              {/* Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 transition bg-white"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Phone Contact *</label>
                  <input
                    required
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 99999-55555"
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 transition bg-white"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 transition bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Visit notes field */}
            <div className="space-y-1 text-left border-t border-shifa-charcoal/10 pt-5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-shifa-charcoal/60 block mb-1">Describe symptoms (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly state symptoms, digestive conditions, body temperament, energy level, or current therapies..."
                className="w-full text-xs font-medium border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 transition bg-white text-shifa-charcoal"
              />
            </div>

            {/* Form Actions */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-4 px-6 rounded-xl transition duration-150 transform active:scale-95 shadow-md text-xs uppercase tracking-widest border-0 cursor-pointer"
              >
                Confirm Appointment & Synergize Portal
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
