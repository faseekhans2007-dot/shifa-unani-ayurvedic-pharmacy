import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, DEMO_PATIENT } from '../data/hospitalData';
import { Appointment, HealthMetric, Prescription, ConsultationNote } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import AuthForm from './AuthForm';
import {
  LifeBuoy,
  User,
  HeartPulse,
  Activity,
  FileText,
  Calendar,
  Lock,
  LogOut,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Search,
  ClipboardList
} from 'lucide-react';

interface PatientPortalProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setCurrentPage: (page: string) => void;
}

export default function PatientPortal({
  isLoggedIn,
  setIsLoggedIn,
  appointments,
  setAppointments,
  setCurrentPage,
}: PatientPortalProps) {
  // Login credentials state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Daily symptom logger form state in portal
  const [symptomText, setSymptomText] = useState('');
  const [digestionScore, setDigestionScore] = useState('Excellent');
  const [sleepLevel, setSleepLevel] = useState('8 Hours');
  const [dailyStatusMessage, setDailyStatusMessage] = useState('');

  // Active dashboard tab state inside portal
  const [activeTab, setActiveTab] = useState<'summary' | 'metrics' | 'prescriptions' | 'notes' | 'appointments'>('summary');

  // ADMIN FORM STATES
  const [adminPatientName, setAdminPatientName] = useState('');
  const [adminPatientEmail, setAdminPatientEmail] = useState('');
  const [adminPatientPhone, setAdminPatientPhone] = useState('');
  const [adminDeptId, setAdminDeptId] = useState(DEPARTMENTS[0]?.id || '');
  const [adminDocId, setAdminDocId] = useState('');
  const [adminDate, setAdminDate] = useState('');
  const [adminTime, setAdminTime] = useState('09:00 AM');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // ADMIN FILTER STATES
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'All' | 'Scheduled' | 'Completed' | 'Cancelled'>('All');
  const [adminDocFilter, setAdminDocFilter] = useState('All');

  // Trigger when adminDeptId changes to auto-select the right doctor
  useEffect(() => {
    const matchedDocs = DOCTORS.filter(d => d.departmentId === adminDeptId);
    if (matchedDocs.length > 0) {
      setAdminDocId(matchedDocs[0].id);
    } else {
      setAdminDocId('');
    }
  }, [adminDeptId]);

  // Handle clinical booking deletion
  const handleDeleteAppointment = async (apptId: string) => {
    try {
      console.log(`[Firestore] Attempting to delete booking with ID ${apptId} from collection 'bookings'`);
      await deleteDoc(doc(db, 'bookings', apptId));
      console.log(`[Firestore] Successfully deleted booking with ID ${apptId} from collection 'bookings'`);
      setAdminSuccessMsg(`OPD Token ${apptId} has been successfully deleted.`);
      setTimeout(() => setAdminSuccessMsg(''), 6000);
    } catch (err: any) {
      console.error(`[Firestore] Deletion failed for booking ID ${apptId}:`, err);
      setAdminErrorMsg(err.message || 'Deletion failed.');
    }
  };

  // Handle clinical booking status change
  const handleUpdateStatus = async (apptId: string, status: 'Scheduled' | 'Completed' | 'Cancelled') => {
    try {
      console.log(`[Firestore] Attempting to update status of booking ${apptId} to '${status}' in collection 'bookings'`);
      await updateDoc(doc(db, 'bookings', apptId), { status });
      console.log(`[Firestore] Successfully updated status of booking ${apptId} in collection 'bookings'`);
      setAdminSuccessMsg(`OPD Token ${apptId} status updated to ${status}.`);
      setTimeout(() => setAdminSuccessMsg(''), 6000);
    } catch (err: any) {
      console.error(`[Firestore] Status update failed for booking ID ${apptId}:`, err);
      setAdminErrorMsg(err.message || 'Status update failed.');
    }
  };

  // Handle registering a new clinical booking on behalf of patient
  const handleAdminAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMsg('');
    setAdminSuccessMsg('');
    setAdminSubmitting(true);

    if (!adminPatientName || !adminPatientEmail || !adminPatientPhone || !adminDeptId || !adminDocId || !adminDate || !adminTime) {
      setAdminErrorMsg('Please fill out all mandatory fields.');
      setAdminSubmitting(false);
      return;
    }

    const docRef = DOCTORS.find((d) => d.id === adminDocId);
    const deptRef = DEPARTMENTS.find((d) => d.id === adminDeptId);

    const tokenID = `SHIFA-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppt: Appointment = {
      id: tokenID,
      userId: auth.currentUser?.uid || 'faseekhans2007-admin',
      patientName: adminPatientName,
      patientPhone: adminPatientPhone,
      patientEmail: adminPatientEmail,
      doctorId: adminDocId,
      doctorName: docRef ? docRef.name : 'Specialist Healer',
      departmentId: adminDeptId,
      departmentName: deptRef ? deptRef.name : 'Ayush Chamber',
      date: adminDate,
      time: adminTime,
      status: 'Scheduled',
      notes: adminNotes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      console.log(`[Firestore Admin] Attempting to write booking to collection 'bookings' with ID ${newAppt.id}:`, newAppt);
      await setDoc(doc(db, 'bookings', newAppt.id), newAppt);
      console.log(`[Firestore Admin] Successfully created booking ${newAppt.id} in collection 'bookings'.`);
      setAdminSuccessMsg(`New OPD Token successfully created: ${tokenID}`);
      
      // Reset form fields
      setAdminPatientName('');
      setAdminPatientEmail('');
      setAdminPatientPhone('');
      setAdminNotes('');
      setAdminDate('');
    } catch (err: any) {
      console.error(`[Firestore Admin] Booking creation failed for ID ${newAppt.id}:`, err);
      handleFirestoreError(err, OperationType.CREATE, `bookings/${newAppt.id}`);
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Handle clinical login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === DEMO_PATIENT.email.toLowerCase() || email.trim() === 'kfasee877@gmail.com') {
      setIsLoggedIn(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Unauthorized profile credentials. For evaluation, please click the "Auto Fill Demographics" button below.');
    }
  };

  // Perform quick automated demo login
  const triggerDemoLogin = () => {
    setEmail(DEMO_PATIENT.email);
    setPhone(DEMO_PATIENT.phone);
    setIsLoggedIn(true);
    setErrorMsg('');
  };

  // Handle recording new daily logger
  const handleLogSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setDailyStatusMessage(
      `Daily wellness records updated successfully. Humoral balance analysis indicates: calm metabolic Pitta rhythm, stable Sleep parameters (${sleepLevel}), and highly active digestion digestive fire (Deepti Agni).`
    );
    setSymptomText('');
    setTimeout(() => {
      setDailyStatusMessage('');
    }, 10000);
  };

  // Render Login interface if user is not authenticated
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-left animate-fade-in font-sans">
        <AuthForm onSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // Get active user details
  const activeUser = auth.currentUser;
  const isDemoEmail = activeUser?.email === 'kfasee877@gmail.com' || (activeUser?.email && activeUser.email.startsWith('demo-patient'));
  const patientDisplayName = activeUser?.displayName || (isDemoEmail ? 'Faseeh Ahmad' : (activeUser?.email?.split('@')[0] || 'Patient'));
  const patientEmail = activeUser?.email || DEMO_PATIENT.email;
  const patientPhoneValue = activeUser?.phoneNumber || DEMO_PATIENT.phone;

  // Calculate upcoming appointments
  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled');

  const isAdmin = activeUser?.email === 'faseekhans2007@gmail.com';

  if (isAdmin) {
    // Filter appointments dynamically
    const filteredAppts = appointments.filter((appt) => {
      const matchSearch =
        appt.patientName.toLowerCase().includes(adminSearch.toLowerCase()) ||
        appt.patientEmail.toLowerCase().includes(adminSearch.toLowerCase()) ||
        appt.patientPhone.includes(adminSearch) ||
        appt.id.toLowerCase().includes(adminSearch.toLowerCase());

      const matchStatus = adminStatusFilter === 'All' || appt.status === adminStatusFilter;
      const matchDoc = adminDocFilter === 'All' || appt.doctorId === adminDocFilter;

      return matchSearch && matchStatus && matchDoc;
    });

    const statusCounts = {
      all: appointments.length,
      scheduled: appointments.filter(a => a.status === 'Scheduled').length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    };

    return (
      <div id="shifa-admin-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left animate-fade-in space-y-8 font-sans">
        
        {/* Admin Header Code block */}
        <div className="bg-[#102A25] rounded-3xl p-6 md:p-8 text-white border-2 border-shifa-gold/30 flex flex-col md:flex-row md:justify-between md:items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-shifa-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#0a1b18] text-shifa-gold px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-shifa-gold/20">
              <Sparkles className="w-3.5 h-3.5 text-shifa-gold animate-pulse" /> Traditional Shifa Apothecary Admin Panel
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight text-white uppercase flex items-center gap-2">
              Clinical Manager Console
            </h1>
            <p className="text-xs text-shifa-mint/90 leading-relaxed max-w-xl font-medium uppercase tracking-wider text-[10px] font-mono">
              Signed in as: <strong className="text-shifa-gold">{activeUser?.email}</strong> (Hospital Admin)
            </p>
          </div>

          <button
            onClick={async () => {
              await signOut(auth);
              setIsLoggedIn(false);
              setCurrentPage('home');
            }}
            className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/60 font-bold uppercase text-[10px] tracking-widest py-2.5 px-4 rounded-xl h-fit w-fit transition shrink-0 active:scale-95 cursor-pointer z-10"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Sign Out Admin
          </button>
        </div>

        {/* Global Notifications */}
        {adminSuccessMsg && (
          <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between shadow-sm font-semibold max-w-4xl animate-slide-in">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wide font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> {adminSuccessMsg}
            </span>
            <button
              onClick={() => setAdminSuccessMsg('')}
              className="text-xs text-emerald-600 hover:text-emerald-900 font-bold uppercase bg-transparent border-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {adminErrorMsg && (
          <div className="bg-red-50 text-red-800 border-2 border-red-500/20 p-4 rounded-2xl flex items-center justify-between shadow-sm font-semibold max-w-4xl animate-slide-in">
            <span className="flex items-center gap-2 text-xs uppercase tracking-wide font-mono">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" /> {adminErrorMsg}
            </span>
            <button
              onClick={() => setAdminErrorMsg('')}
              className="text-xs text-red-600 hover:text-red-900 font-bold uppercase bg-transparent border-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Multi-Bento Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm transition hover:shadow duration-200">
            <p className="text-[10px] font-bold text-shifa-charcoal/50 uppercase tracking-widest leading-none">Total Bookings</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-serif font-black text-shifa-charcoal">{statusCounts.all}</span>
              <span className="text-[10px] uppercase font-bold text-[#1E4D40]/70 font-mono">OPD slots</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm transition hover:shadow duration-200">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Active Queue</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-serif font-black text-amber-600">{statusCounts.scheduled}</span>
              <span className="text-[10px] uppercase font-bold text-amber-600/80 font-mono">Scheduled</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm transition hover:shadow duration-200">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Completed Visits</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-serif font-black text-emerald-600">{statusCounts.completed}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-600/80 font-mono">Archived</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm transition hover:shadow duration-200">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none">Cancelled</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-3xl font-serif font-black text-red-600">{statusCounts.cancelled}</span>
              <span className="text-[10px] uppercase font-bold text-red-600/80 font-mono">Tokens</span>
            </div>
          </div>
        </div>

        {/* Workspace Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Add New Booking Form */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-shifa-charcoal/10 shadow-lg space-y-6">
            <div className="border-b border-shifa-charcoal/10 pb-4">
              <h2 className="text-lg font-serif font-black text-shifa-charcoal uppercase tracking-tight">Register New Patient</h2>
              <p className="text-[10px] text-shifa-charcoal/60 uppercase font-black tracking-wider mt-1">Manual OPD Room Dispatch Form</p>
            </div>

            <form onSubmit={handleAdminAddBooking} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={adminPatientName}
                  onChange={(e) => setAdminPatientName(e.target.value)}
                  placeholder="e.g. Faseeh Ahmad"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Patient Email *
                </label>
                <input
                  type="email"
                  required
                  value={adminPatientEmail}
                  onChange={(e) => setAdminPatientEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Patient Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={adminPatientPhone}
                  onChange={(e) => setAdminPatientPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Clinical Division *
                </label>
                <select
                  required
                  value={adminDeptId}
                  onChange={(e) => setAdminDeptId(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white font-mono"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Traditional Healer (Doctor) *
                </label>
                <select
                  required
                  value={adminDocId}
                  onChange={(e) => setAdminDocId(e.target.value)}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white font-mono"
                >
                  {DOCTORS.filter((d) => d.departmentId === adminDeptId).map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                    Session Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={adminDate}
                    onChange={(e) => setAdminDate(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                    Session Time *
                  </label>
                  <select
                    required
                    value={adminTime}
                    onChange={(e) => setAdminTime(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-shifa-green focus:outline-none bg-white font-mono"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                  Chief Symptoms / Clinical Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. chronic indigestion, humoral balancing advice"
                  rows={3}
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#1A2E2A] hover:bg-shifa-green text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition duration-155 cursor-pointer shadow-md disabled:opacity-50 border-0"
              >
                {adminSubmitting ? 'Registering Booking...' : 'Create Clinical Token'}
                <PlusCircle className="w-4 h-4 text-shifa-gold" />
              </button>
            </form>
          </div>

          {/* RIGHT: Active OPD Consultation Queue */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filtering Controls */}
            <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm space-y-4">
              <div className="font-serif font-black text-shifa-charcoal text-base uppercase tracking-wider pb-2 border-b border-shifa-charcoal/5 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-shifa-gold" /> Filter OPD Queue
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Search Token or Patient</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Name, Phone, ID..."
                      className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl pl-9 pr-3.5 py-2.5 focus:ring-2 focus:ring-shifa-green bg-white placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Status selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Select Status State</span>
                  <select
                    value={adminStatusFilter}
                    onChange={(e: any) => setAdminStatusFilter(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-shifa-green bg-white font-mono"
                  >
                    <option value="All">All States</option>
                    <option value="Scheduled">Scheduled (Active Queue)</option>
                    <option value="Completed">Completed (Archived)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Practitoner selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">Select Healer</span>
                  <select
                    value={adminDocFilter}
                    onChange={(e) => setAdminDocFilter(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-shifa-green bg-white font-mono"
                  >
                    <option value="All">All Healers</option>
                    {DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List of Bookings */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] uppercase tracking-widest font-black text-[#1E4D40] font-mono">
                  Matching Records: <strong>{filteredAppts.length}</strong>
                </span>
              </div>

              {filteredAppts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-shifa-charcoal/10 border-dashed space-y-4 shadow-sm">
                  <p className="text-sm font-serif font-black text-shifa-charcoal uppercase tracking-widest pt-4 animate-pulse">No Clinical Bookings Found</p>
                  <p className="text-xs text-shifa-charcoal/50 max-w-xs mx-auto pb-4">
                    Modify your filter requirements or create a new token on the left panel.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className={`bg-white rounded-3xl p-6 border transition-all duration-200 relative space-y-4 shadow-sm text-left ${
                        appt.status === 'Scheduled'
                          ? 'border-2 border-amber-400'
                          : appt.status === 'Completed'
                          ? 'border border-emerald-500/30'
                          : 'border border-slate-300 opacity-75 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-shifa-charcoal/10 pb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-[#F5F7F5] text-shifa-charcoal/70 border border-shifa-charcoal/10 py-0.5 px-2 rounded">
                              OPD Token: {appt.id}
                            </span>
                            {appt.status === 'Scheduled' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" title="Active Booking" />
                            )}
                          </div>
                          <h4 className="font-serif font-black text-shifa-charcoal text-lg mt-2 uppercase">
                            Patient: {appt.patientName}
                          </h4>
                          <span className="text-[10px] text-shifa-charcoal/60 uppercase tracking-widest font-semibold block mt-1">
                            {appt.patientEmail} • {appt.patientPhone}
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-sm font-black text-shifa-charcoal block font-mono">{appt.date}</span>
                          <span className="text-xs font-bold text-shifa-green block mt-1 font-mono uppercase bg-shifa-mint/40 py-1 px-3 rounded-md w-fit md:ml-auto">
                            {appt.time}
                          </span>
                        </div>
                      </div>

                      {/* Detail Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <span className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">Treatment Practitioner & Room</span>
                          <p className="font-bold text-shifa-charcoal mt-1 text-sm">{appt.doctorName}</p>
                          <p className="text-[11px] uppercase font-bold text-shifa-green mt-0.5">{appt.departmentName}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">Reported Chief Symptoms</span>
                          <p className="text-xs text-shifa-charcoal/80 font-medium italic mt-1 leading-relaxed">
                            {appt.notes ? `"${appt.notes}"` : 'No custom clinical issues mentioned.'}
                          </p>
                        </div>
                      </div>

                      {/* Bottom action rows */}
                      <div className="pt-4 border-t border-shifa-charcoal/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-extrabold flex-wrap">
                          <span className="text-slate-400">Current Token Status:</span>
                          <span
                            className={`font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                              appt.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : appt.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {appt.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                                className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg border-0 cursor-pointer shadow-sm uppercase tracking-widest font-mono"
                              >
                                Mark Completed
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                                className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-3 rounded-lg border-0 cursor-pointer shadow-sm uppercase tracking-widest font-mono"
                              >
                                Cancel Slot
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(appt.id)}
                            className="text-[10px] bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-lg cursor-pointer shadow-sm uppercase tracking-widest font-mono"
                          >
                            Remove Token
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left animate-fade-in space-y-8 font-sans">
      
      {/* Portal Header Block */}
      <div className="bg-shifa-green rounded-3xl p-6 md:p-8 text-white border border-shifa-gold/20 flex flex-col md:flex-row md:justify-between md:items-center gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#122421] text-shifa-gold px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-shifa-gold" /> Shifa Medical Records System
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-white uppercase">
            Portal Gateway: Greetings, {patientDisplayName}
          </h1>
          <p className="text-xs text-shifa-mint/90 leading-relaxed max-w-xl font-medium">
            Review diagnostics logs, custom apothecary medicine doses, and rebalancing treatments. Registered Patient ID: <strong className="font-mono text-shifa-gold">{activeUser ? activeUser.uid.substring(0, 8).toUpperCase() : DEMO_PATIENT.patientId}</strong>
          </p>
        </div>

        <button
          onClick={async () => {
            await signOut(auth);
            setIsLoggedIn(false);
          }}
          className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/60 font-bold uppercase text-[10px] tracking-widest py-2.5 px-4 rounded-xl h-fit w-fit transition shrink-0 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Secure Exit
        </button>
      </div>

      {/* Main Grid: Left side metrics, Right side tab contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Summary Demographics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Demographics Card */}
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-shifa-charcoal pb-2 border-b border-shifa-charcoal/10 flex items-center gap-2 text-base uppercase tracking-wider">
              <User className="w-5 h-5 text-shifa-green" />
              Patient Metrics
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-shifa-charcoal/40 block uppercase tracking-widest text-[9px] font-bold">Age / Gender</span>
                <span className="text-shifa-charcoal font-black">{DEMO_PATIENT.age} Years / {DEMO_PATIENT.gender}</span>
              </div>
              <div>
                <span className="text-shifa-charcoal/40 block uppercase tracking-widest text-[9px] font-bold">Blood Group</span>
                <span className="text-red-700 font-black">{DEMO_PATIENT.bloodGroup}</span>
              </div>
              <div className="pt-2 border-t border-shifa-charcoal/10">
                <span className="text-shifa-charcoal/40 block uppercase tracking-widest text-[9px] font-bold">Contact</span>
                <span className="text-shifa-charcoal font-bold block truncate">{patientPhoneValue}</span>
              </div>
              <div className="pt-2 border-t border-shifa-charcoal/10">
                <span className="text-shifa-charcoal/40 block uppercase tracking-widest text-[9px] font-bold">Primary Email</span>
                <span className="text-shifa-charcoal font-bold block truncate leading-normal">{patientEmail}</span>
              </div>
            </div>


            {/* Temperament Banner */}
            <div className="bg-[#F5F7F5] p-4 rounded-2xl border border-shifa-charcoal/15 text-xs text-left">
              <h4 className="font-serif font-bold text-shifa-charcoal flex items-center gap-1 mb-1 uppercase tracking-wide text-xs">
                <HeartPulse className="w-4 h-4 text-shifa-green" />
                Baseline Temperament (Mizaj)
              </h4>
              <p className="text-shifa-charcoal/80 leading-relaxed font-sans text-[11px] font-semibold">
                Diagnosed baseline: <span className="font-bold text-shifa-green">Pitta Dominant</span> temperament. Showing secondary traits of dry Vata dryness in musculoskeletal tissues. Highly active liver bile parameters (Safra).
              </p>
            </div>
          </div>

          {/* Daily Quick Wellness Logger Form */}
          <div className="bg-white p-5 rounded-3xl border border-shifa-charcoal/10 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-shifa-charcoal pb-2 border-b border-shifa-charcoal/10 flex items-center gap-2 text-base uppercase tracking-wider">
              <PlusCircle className="w-5 h-5 text-shifa-green" />
              Log System Vitality
            </h3>

            <form onSubmit={handleLogSymptom} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-shifa-charcoal/50 uppercase tracking-widest block">Today's Symptoms or Digestion</label>
                <input
                  type="text"
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g. Mild bloating after meals"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl px-3.5 py-3 bg-[#F5F7F5] focus:outline-none focus:ring-1 focus:ring-shifa-green placeholder-slate-450"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-shifa-charcoal/50 uppercase block">Digestive Fire (Agni)</label>
                  <select
                    value={digestionScore}
                    onChange={(e) => setDigestionScore(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 bg-white rounded-lg p-2 focus:outline-none"
                  >
                    <option value="Excellent">Strong / Teekshna</option>
                    <option value="Average">Balanced / Sama</option>
                    <option value="Weak">Slow / Manda</option>
                    <option value="Irregular">Irregular / Vishama</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-shifa-charcoal/50 uppercase block">Sleep (Nidra)</label>
                  <select
                    value={sleepLevel}
                    onChange={(e) => setSleepLevel(e.target.value)}
                    className="w-full text-xs font-bold border border-shifa-charcoal/10 bg-white rounded-lg p-2 focus:outline-none"
                  >
                    <option value="8 Hours">Deep (&gt;7 hours)</option>
                    <option value="6 Hours">Light (5-6 hours)</option>
                    <option value="Disrupted">Disrupted / Insomnia</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider border-0 cursor-pointer"
              >
                Log Vitality Entry
              </button>
            </form>

            {dailyStatusMessage && (
              <div className="bg-[#E8F0ED] p-3.5 rounded-xl border border-shifa-green/10 text-[10px] text-shifa-green font-bold leading-relaxed font-mono">
                {dailyStatusMessage.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tabular content view */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-shifa-charcoal/10 shadow-sm overflow-hidden">
          {/* Main Tab Controls */}
          <div className="bg-[#F5F7F5] border-b border-shifa-charcoal/10 flex flex-nowrap overflow-x-auto">
            {[
              { id: 'summary', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
              { id: 'metrics', label: 'Vital History', icon: <Activity className="w-4 h-4" /> },
              { id: 'prescriptions', label: 'Apothecary Doses', icon: <HeartPulse className="w-4 h-4" /> },
              { id: 'notes', label: 'Consultation Logs', icon: <FileText className="w-4 h-4" /> },
              { id: 'appointments', label: `Scheduled (${upcomingAppointments.length})`, icon: <Calendar className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-4 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-150 whitespace-nowrap focus:outline-none cursor-pointer ${
                    isActive
                      ? 'border-shifa-green text-shifa-green bg-white font-black'
                      : 'border-transparent text-shifa-charcoal/50 hover:text-shifa-charcoal hover:bg-shifa-mint/40'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Viewport Contents */}
          <div className="p-6 md:p-8">
            {/* TAB: SUMMARY / OVERVIEW */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="space-y-1 text-left">
                  <h3 className="font-serif font-black text-shifa-charcoal text-lg uppercase tracking-wide">Active Clinical Overview</h3>
                  <p className="text-xs text-shifa-charcoal/60">A rapid birds-eye snapshot of current prescriptions and physical logs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prescriptions Preview card */}
                  <div className="bg-[#F5F7F5] p-5 rounded-2xl border border-shifa-charcoal/10 space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-shifa-charcoal/10">
                      <span className="text-xs font-bold text-shifa-charcoal uppercase tracking-wider">Current Ayurvedic Rx</span>
                      <span className="text-[9px] text-shifa-green font-bold bg-shifa-mint px-2 py-0.5 rounded-full border border-shifa-green/10">Active</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-shifa-charcoal font-serif">Rasayana Chyawanprash Supreme</h4>
                      <p className="text-[11px] text-[#1A2E2A]/80 font-semibold leading-relaxed">Take 1 tablespoon with lukewarm cow milk early morning before meals.</p>
                      <span className="text-[10px] text-shifa-charcoal/40 block font-bold uppercase tracking-wide">Prescribed by Dr. Anand Sharma</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className="text-xs text-shifa-green font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5 mt-2 border-0 bg-transparent cursor-pointer"
                    >
                      View All Prescriptions <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Humoral Vitality status box */}
                  <div className="bg-[#F5F7F5] p-5 rounded-2xl border border-shifa-charcoal/10 space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-shifa-charcoal/10">
                      <span className="text-xs font-bold text-shifa-charcoal uppercase tracking-wider">Patient Humoral Ratios</span>
                      <span className="text-[9px] text-shifa-green font-bold bg-shifa-mint px-2 py-0.5 rounded-full border border-shifa-green/10">Stable</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold font-mono pt-1">
                      <div className="bg-white p-2 rounded-xl border border-shifa-charcoal/10">
                        <span className="text-shifa-charcoal/40 text-[9px] block uppercase">Pitta/Safra</span>
                        <strong className="text-shifa-green">High (62%)</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-shifa-charcoal/10">
                        <span className="text-shifa-charcoal/40 text-[9px] block uppercase">Vata/Sauda</span>
                        <strong className="text-shifa-charcoal/80">Balanced (21%)</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-shifa-charcoal/10">
                        <span className="text-shifa-charcoal/40 text-[9px] block uppercase">Kapha/Balgh</span>
                        <strong className="text-shifa-charcoal/80">Calm (17%)</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-shifa-charcoal/10">
                        <span className="text-shifa-charcoal/40 text-[9px] block uppercase">Prakriti</span>
                        <strong className="text-shifa-charcoal/80">Vata-Pitta</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient alerts message widget */}
                <div className="bg-[#E8F0ED] text-shifa-green border border-shifa-green/10 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed text-left">
                  <CheckCircle2 className="w-5 h-5 text-shifa-green shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Clinical Advisor Memo:</strong>
                    <span className="font-medium text-shifa-charcoal/90">"Faseeh, your diagnostic blood temperature reports have improved beautifully by 12% over the last 30 days due to the cooling Arq e Shahtara. Please keep consuming light watermelons and avoid direct raw garlic or pungent acidic curries for the upcoming fortnight."</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VITAL TRACKER HISTORY CHART */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <div className="space-y-1 text-left">
                  <h3 className="font-serif font-black text-shifa-charcoal text-lg uppercase tracking-wide">Historic Biostatistics & Vitals</h3>
                  <p className="text-xs text-shifa-charcoal/60">Digital records tracking blood pressure, pulse, weights and elemental states.</p>
                </div>

                {/* Pure SVG line chart */}
                <div className="bg-[#F5F7F5] p-4 rounded-3xl border border-shifa-charcoal/10 space-y-4">
                  <div className="flex justify-between items-center px-2 text-left">
                    <span className="text-xs font-bold text-shifa-charcoal uppercase tracking-wider">Pulse Velocity (bpm Index over Time)</span>
                    <span className="text-[10px] text-shifa-charcoal/50 font-bold uppercase tracking-widest font-mono">3 Clinical Evaluations</span>
                  </div>

                  <div className="w-full relative h-48 bg-white rounded-2xl border border-shifa-charcoal/10 p-4">
                    {/* SVG GRAPH */}
                    <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="10" y1="20" x2="390" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="10" y1="60" x2="390" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="10" y1="100" x2="390" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Line connecting points */}
                      <polyline
                        fill="none"
                        stroke="var(--shifa-green)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        points="50,102 200,82 350,62"
                      />

                      {/* Pulse coordinate nodes */}
                      <g className="cursor-pointer group">
                        <circle cx="50" cy="102" r="5" fill="var(--shifa-gold)" stroke="var(--shifa-green)" strokeWidth="2" />
                        <text x="50" y="118" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="700">Mar 02 (82 bpm)</text>
                      </g>

                      <g className="cursor-pointer">
                        <circle cx="200" cy="82" r="5" fill="var(--shifa-gold)" stroke="var(--shifa-green)" strokeWidth="2" />
                        <text x="200" y="118" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="700">Apr 15 (78 bpm)</text>
                      </g>

                      <g className="cursor-pointer">
                        <circle cx="350" cy="62" r="5" fill="var(--shifa-gold)" stroke="var(--shifa-green)" strokeWidth="2" />
                        <text x="350" y="118" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="700">May 20 (72 bpm - Optimal)</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Metric breakdown chart */}
                <div className="space-y-4 text-left">
                  <h4 className="text-[10px] font-bold text-shifa-charcoal/50 uppercase tracking-widest font-sans">Historical Screenings Record</h4>
                  
                  <div className="overflow-x-auto rounded-2xl border border-shifa-charcoal/10">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F5F7F5] text-shifa-charcoal border-b border-shifa-charcoal/10 uppercase font-bold text-[9px] tracking-wider">
                        <tr>
                          <th className="p-4">Consultation Date</th>
                          <th className="p-4">Blood Pressure</th>
                          <th className="p-4">Pulse Rhythm</th>
                          <th className="p-4">Body Weight</th>
                          <th className="p-4">Elemental Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-shifa-charcoal/10 text-shifa-charcoal/80 font-medium">
                        {DEMO_PATIENT.metricsHistory.map((metric, idx) => (
                          <tr key={idx} className="hover:bg-[#F5F7F5]/50">
                            <td className="p-4 font-bold text-shifa-charcoal">{metric.date}</td>
                            <td className="p-4 font-mono">{metric.bp} mmHg</td>
                            <td className="p-4 font-mono">{metric.pulse} bpm</td>
                            <td className="p-4 font-mono">{metric.weight} kg</td>
                            <td className="p-4">
                              <span className="bg-shifa-mint text-shifa-green font-bold px-2.5 py-1 rounded-md border border-shifa-green/10 text-[9px] uppercase tracking-wide">
                                {metric.doshaDominance}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PRESCRIPTIONS LIST */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-shifa-charcoal text-lg uppercase tracking-wide">Pharmacopoeia Active Formulations ({DEMO_PATIENT.prescriptions.length})</h3>
                    <p className="text-xs text-shifa-charcoal/60">Approved botanical formulations with rigorous dosing parameters.</p>
                  </div>
                  <button
                    onClick={() => setCurrentPage('pharmacy')}
                    className="text-xs bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-2.5 px-4 rounded-xl transition uppercase tracking-widest border-0 cursor-pointer shadow"
                  >
                    Apothecary Shop
                  </button>
                </div>

                <div className="space-y-4">
                  {DEMO_PATIENT.prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="bg-white p-5 rounded-2xl border border-shifa-charcoal/10 hover:border-shifa-green transition-colors space-y-4 shadow-sm text-left"
                    >
                      <div className="flex justify-between items-start border-b border-shifa-charcoal/10 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-widest font-bold bg-shifa-mint text-shifa-green px-2.5 py-0.5 rounded mr-2">
                            {rx.type} System
                          </span>
                          <span className="text-[10px] text-shifa-charcoal/40 font-bold">Rx ID: {rx.id}</span>
                          <h4 className="font-serif font-black text-shifa-charcoal text-base mt-2">{rx.medicineName}</h4>
                        </div>
                        <span className="text-xs font-bold text-shifa-charcoal/50">{rx.date}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                        <div>
                          <strong className="text-[#1A2E2A]/40 text-[9px] uppercase font-bold block">Classical Dosage Rate</strong>
                          <span className="text-shifa-charcoal font-bold">{rx.dosage}</span>
                        </div>
                        <div>
                          <strong className="text-[#1A2E2A]/40 text-[9px] uppercase font-bold block">Therapeutic Duration</strong>
                          <span className="text-shifa-charcoal font-bold">{rx.duration}</span>
                        </div>
                        <div>
                          <strong className="text-[#1A2E2A]/40 text-[9px] uppercase font-bold block">Prescribed Healer</strong>
                          <span className="text-shifa-green font-black font-serif">{rx.doctorName}</span>
                        </div>
                      </div>

                      <div className="bg-[#F5F7F5] p-3.5 rounded-xl border border-shifa-charcoal/10 text-[11px] text-shifa-charcoal/90 leading-relaxed font-semibold">
                        <strong className="text-shifa-green block mb-0.5 uppercase tracking-wide text-[9px]">Apothecary Instructions:</strong>
                        "{rx.instructions}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CLINIC CONSULTATION NOTES LOGS */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="space-y-1 text-left">
                  <h3 className="font-serif font-black text-shifa-charcoal text-lg uppercase tracking-wide">Clinical Consultation Summaries</h3>
                  <p className="text-xs text-shifa-charcoal/60">Historical records of diagnosed symptoms, humoral classifications, and herbal therapy programs.</p>
                </div>

                <div className="space-y-6 text-left">
                  {DEMO_PATIENT.consultationNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-shifa-charcoal/10 rounded-3xl p-6 relative space-y-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center border-b border-shifa-charcoal/10 pb-3">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider bg-[#F5F7F5] text-shifa-charcoal/70 font-bold px-2 py-0.5 rounded border border-shifa-charcoal/10">
                            RECORD TOKEN: {note.id}
                          </span>
                          <h4 className="font-serif font-black text-shifa-charcoal text-base mt-2">
                            {note.departmentName} CHECK LOG
                          </h4>
                        </div>
                        <span className="text-xs text-shifa-charcoal/50 font-bold">{note.date}</span>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed font-sans text-left">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-shifa-charcoal/40 tracking-widest block">Observed Clinical Symptoms</span>
                          <div className="flex gap-1.5 flex-wrap pt-1">
                            {note.symptoms.map((sym, sidx) => (
                              <span key={sidx} className="bg-[#F5F7F5] text-shifa-charcoal/80 px-2 py-1 rounded border border-shifa-charcoal/10 font-bold text-[10px]">
                                {sym}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-shifa-charcoal/5">
                          <span className="text-[9px] uppercase font-bold text-shifa-charcoal/40 tracking-widest block">Diagnosis Framework</span>
                          <p className="text-shifa-charcoal font-bold">{note.diagnosis}</p>
                        </div>

                        <div className="pt-2 border-t border-shifa-charcoal/5 bg-shifa-mint p-3 rounded-xl border border-shifa-green/10 text-shifa-green">
                          <span className="text-[9px] uppercase font-bold text-shifa-green tracking-widest block">Coordinated Treatment Program</span>
                          <p className="text-shifa-charcoal font-bold mt-1 font-serif text-xs leading-relaxed">{note.treatmentPlan}</p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-shifa-charcoal/10 flex justify-between text-[11px] text-shifa-charcoal/50 font-bold uppercase tracking-wider pl-1">
                        <span>Lead Clinician: <strong>{note.doctorName}</strong></span>
                        <span className="text-shifa-green">Signed Digitally</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BOOKED APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F5F7F5] py-3.5 px-4 rounded-xl border border-shifa-charcoal/10 gap-3 text-left">
                  <div className="space-y-0.5">
                    <h3 className="font-serif font-black text-shifa-charcoal text-sm uppercase tracking-wide">Scheduled Consultations ({upcomingAppointments.length})</h3>
                    <p className="text-[11px] text-shifa-charcoal/60 leading-relaxed font-medium">Live token numbers for physical clinic chambers.</p>
                  </div>
                  <button
                    onClick={() => setCurrentPage('booking')}
                    className="text-xs bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-2 px-3.5 rounded-lg transition border-0 cursor-pointer shadow uppercase tracking-widest"
                  >
                    Quick Book New
                  </button>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-shifa-charcoal/10 border-dashed space-y-2">
                    <p className="text-sm font-bold text-shifa-charcoal font-serif pt-4">No Active Tokens Booked</p>
                    <p className="text-xs text-shifa-charcoal/50 max-w-xs mx-auto pb-4">You do not have any upcoming clinical consultation sessions booked at this moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    {upcomingAppointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="bg-white rounded-2xl p-5 border-2 border-shifa-green text-left relative space-y-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-shifa-mint text-shifa-green border border-shifa-green/10 py-1 px-2.5 rounded">
                              OPD Token: {appt.id}
                            </span>
                            <h4 className="font-serif font-black text-shifa-charcoal text-base mt-2 uppercase">
                              {appt.doctorName}
                            </h4>
                            <p className="text-[11px] text-shifa-charcoal/60 uppercase font-black mt-0.5">{appt.departmentName}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-shifa-charcoal block">{appt.date}</span>
                            <span className="text-xs font-bold text-shifa-green block mt-1 font-mono">{appt.time}</span>
                          </div>
                        </div>

                        {appt.notes && (
                          <p className="text-xs bg-[#F5F7F5] p-3 rounded-lg text-shifa-charcoal/80 font-medium italic border border-shifa-charcoal/5">
                            "Reported Symptoms: {appt.notes}"
                          </p>
                        )}
                        
                        <div className="pt-3 border-t border-shifa-charcoal/10 flex justify-between items-center text-[9.5px] uppercase font-black text-shifa-charcoal/40 tracking-widest pl-1">
                          <span>Status: <strong className="text-shifa-green">Scheduled</strong></span>
                          <span>Consultation Room: <strong className="text-shifa-charcoal">Cabin 4B, Shifa Plaza</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
