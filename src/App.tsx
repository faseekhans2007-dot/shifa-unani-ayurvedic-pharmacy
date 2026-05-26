import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Departments from './components/Departments';
import Doctors from './components/Doctors';
import Booking from './components/Booking';
import PatientPortal from './components/PatientPortal';
import Pharmacy from './components/Pharmacy';
import Footer from './components/Footer';
import { Appointment } from './types';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [patientName, setPatientName] = useState<string>('');

  // Local/Firestore dynamic appointments list
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Listen to Auth State Changes dynamically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userIsAdmin = user.email === 'faseekhans2007@gmail.com';
        setIsAdmin(userIsAdmin);
        const isDemoEmail = user.email === 'kfasee877@gmail.com' || (user.email && user.email.startsWith('demo-patient'));
        const nameFallback = user.displayName || (userIsAdmin ? 'Shifa Clinical Admin' : (isDemoEmail ? 'Faseeh Ahmad' : (user.email?.split('@')[0] || 'Patient')));
        setPatientName(nameFallback);

        // Retrieve extra details from user record in Firestore if exists
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) {
              setPatientName(data.name);
            }
          }
        } catch (err) {
          console.warn("Could not retrieve user profile document:", err);
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }

        // Live synchronizer of this user's bookings in Firestore
        // Admin loads EVERY booking!
        const appointmentsQuery = userIsAdmin
          ? collection(db, 'bookings')
          : query(
              collection(db, 'bookings'),
              where('userId', '==', user.uid)
            );

        console.log("[Firestore] Subscribing to live bookings query:", userIsAdmin ? "all bookings (Admin mode)" : `bookings for user: ${user.uid}`);
        const unsubSnap = onSnapshot(appointmentsQuery, (snapshot) => {
          console.log(`[Firestore] Bookings sync callback fired: total loaded size = ${snapshot.size}`);
          const fetchedAppts: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            fetchedAppts.push(docSnap.data() as Appointment);
          });
          fetchedAppts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          setAppointments(fetchedAppts);
        }, (error) => {
          console.error("Bookings Sync Error: ", error.message || error);
          handleFirestoreError(error, OperationType.LIST, 'bookings');
        });

        return () => unsubSnap();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setPatientName('');
        // Failover local fallback load
        const saved = localStorage.getItem('shifa_appointments');
        if (saved) {
          try {
            setAppointments(JSON.parse(saved));
          } catch {
            setAppointments([]);
          }
        } else {
          setAppointments([
            {
              id: 'SHIFA-781920',
              patientName: 'Faseeh Ahmad',
              patientPhone: '+91 98765 43210',
              patientEmail: 'kfasee877@gmail.com',
              doctorId: 'dr-ma-subhan-javeed-hijama',
              doctorName: 'DR MA SUBHAN JAVEED',
              departmentId: 'hijama-center',
              departmentName: 'hijama center',
              date: '2026-05-30',
              time: '10:00 AM',
              status: 'Scheduled',
              notes: 'Follow-up regarding digestion and Pitta soothing regimen.',
              createdAt: '2026-05-24',
            },
          ]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save new booked appointments on changes for guest users
  useEffect(() => {
    if (!auth.currentUser) {
      localStorage.setItem('shifa_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  // Scroll to top on page switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setPatientName('');
    setCurrentPage('home');
  };


  return (
    <div id="shifa-app-root" className="min-h-screen bg-[#FDFEFC] flex flex-col justify-between">
      {/* Dynamic Header Block */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        patientName={patientName || 'Patient'}
        isAdmin={isAdmin}
      />

      {/* Main viewport area */}
      <main id="shifa-main-contents" className="flex-grow">
        {currentPage === 'home' && (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        )}

        {currentPage === 'about' && <About />}

        {currentPage === 'departments' && (
          <Departments
            setCurrentPage={setCurrentPage}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        )}

        {currentPage === 'doctors' && (
          <Doctors
            setCurrentPage={setCurrentPage}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        )}

        {currentPage === 'booking' && (
          <Booking
            selectedDoctorId={selectedDoctorId}
            setSelectedDoctorId={setSelectedDoctorId}
            appointments={appointments}
            setAppointments={setAppointments}
            isLoggedIn={isLoggedIn}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'portal' && (
          <PatientPortal
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={(status) => {
              setIsLoggedIn(status);
              if (status) setPatientName('Faseeh Ahmad');
            }}
            appointments={appointments}
            setAppointments={setAppointments}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'pharmacy' && <Pharmacy isLoggedIn={isLoggedIn} />}
      </main>

      {/* Shared Footer component */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
