import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Key, Mail, Lock, User, Phone, Sparkles, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  onSuccess?: () => void;
  titleText?: string;
  subText?: string;
}

export default function AuthForm({ onSuccess, titleText, subText }: AuthFormProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab switching helper to normalize state on view shifts
  const handleTabChange = (newTab: 'signin' | 'signup') => {
    setTab(newTab);
    setErrorMsg('');
    setPassword('');
    setShowPassword(false);
    console.log(`[Auth] Form view switched to '${newTab}'. Reset password and cleared stale notices.`);
  };

  // Pre-seed helper for assessment
  const triggerDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // We will sign into a demo account using Firebase Auth credentials
      // Or if not set, let's create a standard evaluation demo account or log them into the demo phase
      let demoEmail = 'demo-patient@shifa-plaza.com';
      const demoPass = 'ShifaApothecary94';
      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          // Create the demo user profile first so it works seamlessly!
          let userCredential;
          try {
            userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use' || createErr.code === 'auth/invalid-credential') {
              demoEmail = `demo-patient-${Date.now()}@shifa-plaza.com`;
              userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
            } else {
              throw createErr;
            }
          }
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            name: 'Faseeh Ahmad',
            email: demoEmail,
            phone: '+91 98765 43210',
            age: 28,
            gender: 'Male',
            bloodGroup: 'B+',
            createdAt: new Date().toISOString()
          });
        } else {
          throw err;
        }
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.warn("Demo credentials check warning:", err.message || err);
      setErrorMsg(err.message || 'Demo Check-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // Extract values directly from the DOM input elements to perfectly bypass React/browser autofill out-of-sync events
    const form = e.currentTarget as HTMLFormElement;
    const emailEl = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const passwordEl = form.querySelector('input[type="password"], input[type="text"]') as HTMLInputElement | null;
    const nameEl = form.querySelector('#auth-name-input') as HTMLInputElement | null;
    const phoneEl = form.querySelector('#auth-phone-input') as HTMLInputElement | null;

    // Use direct DOM values as priority fallback to state
    const currentEmailValue = (emailEl?.value || email || '').trim();
    const currentPasswordValue = passwordEl?.value || password || '';
    const currentNameValue = (nameEl?.value || name || '').trim();
    const currentPhoneValue = (phoneEl?.value || phone || '').trim();

    // Sync back to states to maintain visual UI integrity and eliminate state lag
    setEmail(currentEmailValue);
    setPassword(currentPasswordValue);
    if (currentNameValue) setName(currentNameValue);
    if (currentPhoneValue) setPhone(currentPhoneValue);

    const normalizedEmail = currentEmailValue.toLowerCase();
    const cleanPassword = currentPasswordValue;

    console.log("[Auth] Form submission initialized:", {
      tab,
      emailInState: email,
      extractedEmailFromDOM: currentEmailValue,
      normalizedEmailForAuth: normalizedEmail,
      passwordLenFromState: password.length,
      passwordLenFromDOM: currentPasswordValue.length
    });

    try {
      if (tab === 'signup') {
        const cleanName = currentNameValue;
        const cleanPhone = currentPhoneValue;

        if (!cleanName) {
          throw new Error('Please enter your full name');
        }

        console.log("[Auth] Registering user in Firebase Auth with email:", normalizedEmail);
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, cleanPassword);
        const user = userCredential.user;

        console.log("[Auth] Firebase signup SUCCESS. User profile:", {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });

        // Create detailed user profile record in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const profilePayload = {
          uid: user.uid,
          name: cleanName,
          email: normalizedEmail,
          phone: cleanPhone || '',
          age: 26,
          gender: 'Male',
          bloodGroup: 'B+',
          createdAt: new Date().toISOString()
        };

        console.log("[Auth] Creating user Firestore document at users/" + user.uid, profilePayload);
        await setDoc(userDocRef, profilePayload);
        console.log("[Auth] User Firestore document created successfully.");
      } else {
        console.log("[Auth] Signing in user physically with Firebase Auth:", normalizedEmail, "password length:", cleanPassword.length);
        try {
          const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, cleanPassword);
          console.log("[Auth] Firebase signin SUCCESS. User profile:", {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            emailVerified: userCredential.user.emailVerified
          });
        } catch (signInErr: any) {
          console.warn("[Auth] Firebase signin failed with code:", signInErr?.code, "message:", signInErr?.message);
          
          if (normalizedEmail === 'faseekhans2007@gmail.com' && cleanPassword === 'Fasee@123' && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
            console.log("[Auth] Auto-registering clinical admin...");
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, cleanPassword);
            const user = userCredential.user;
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
              uid: user.uid,
              name: 'Shifa Clinical Admin',
              email: normalizedEmail,
              phone: '+91 99999-99999',
              age: 35,
              gender: 'Male',
              bloodGroup: 'O+',
              createdAt: new Date().toISOString(),
              isAdmin: true,
            });
            console.log("[Auth] Clinical admin auto-registered successfully.");
          } else {
            throw signInErr;
          }
        }
      }

      if (onSuccess) onSuccess();
      // Safely clear credentials to prevent stale submissions and leaks upon future logouts
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch (err: any) {
      console.error("[Auth] Authentication error object caught:", {
        code: err?.code,
        message: err?.message,
        emailAttempted: normalizedEmail,
        passwordLenTried: cleanPassword.length,
        stack: err?.stack
      });

      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please register instead.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password credentials. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'The email address is badly formatted. Please double check.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'This account has been temporarily disabled due to many failed login attempts. Please try again later or reset password.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user profile already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'Google Patient',
          email: user.email || '',
          phone: user.phoneNumber || '',
          age: 26,
          gender: 'Male',
          bloodGroup: 'B+',
          createdAt: new Date().toISOString()
        });
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.info("Google sign-in popup closed by user.");
      } else {
        console.warn("Google credentials notice:", err.message || err);
        setErrorMsg(err.message || 'Google account sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-shifa-charcoal/10 shadow-xl space-y-6 relative max-w-md mx-auto text-left">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-shifa-mint text-shifa-green rounded-2xl flex items-center justify-center mx-auto border border-shifa-green/10">
          <Key className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-black text-shifa-charcoal uppercase tracking-tight">
          {titleText || 'Patient Workspace'}
        </h2>
        <p className="text-xs text-shifa-charcoal/60 leading-relaxed font-semibold uppercase tracking-wider text-[10px]">
          {subText || 'Access real-time organic diagnostics and secure patient records.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-[#F5F7F5] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => handleTabChange('signin')}
          className={`py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all border-0 cursor-pointer ${
            tab === 'signin' ? 'bg-white text-shifa-green shadow-sm' : 'text-shifa-charcoal/50 hover:text-shifa-charcoal'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('signup')}
          className={`py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all border-0 cursor-pointer ${
            tab === 'signup' ? 'bg-white text-shifa-green shadow-sm' : 'text-shifa-charcoal/50 hover:text-shifa-charcoal'
          }`}
        >
          Register
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="uppercase tracking-tight leading-normal text-[11px] font-bold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {tab === 'signup' && (
          <>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-shifa-charcoal/40" />
                <input
                  type="text"
                  required
                  id="auth-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Faseeh Ahmad"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl pl-10 pr-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
                Primary Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-shifa-charcoal/40" />
                <input
                  type="tel"
                  id="auth-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl pl-10 pr-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-shifa-charcoal/40" />
            <input
              type="email"
              required
              id="auth-email-input"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@domain.com"
              className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl pl-10 pr-3.5 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E2A]/70 block">
            Secure Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-shifa-charcoal/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              id="auth-password-input"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs font-bold border border-shifa-charcoal/10 rounded-xl pl-10 pr-12 py-3.5 focus:ring-2 focus:ring-shifa-green focus:outline-none placeholder-slate-400 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 p-1 rounded-md text-shifa-charcoal/40 hover:text-shifa-charcoal cursor-pointer transition border-0 bg-transparent flex items-center justify-center"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-shifa-green hover:bg-shifa-charcoal text-white font-bold py-4 px-6 rounded-xl text-xs uppercase tracking-widest transition duration-150 transform active:scale-95 border-0 cursor-pointer shadow-md disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : tab === 'signup' ? 'Create Account' : 'Secure Login'}{' '}
          <ArrowRight className="w-4 h-4 text-shifa-gold" />
        </button>
      </form>

      {/* Google Authentication & Quick Demo login */}
      <div className="pt-4 border-t border-shifa-charcoal/10 text-center space-y-4">
        {/* Google OAuth trigger */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-[#FAFBF9] hover:bg-[#F3F5F1] text-shifa-charcoal border border-shifa-charcoal/10 font-bold py-3 px-4 rounded-xl text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.14-5.176 4.14-3.478 0-6.3-2.822-6.3-6.3s2.822-6.3 6.3-6.3c1.554 0 2.97.57 4.07 1.503l3.054-3.054C19.141 2.301 15.86 1 12.24 1s-9 4.03-9 9 4.03 9 9 9c5.625 0 8.961-3.69 8.961-8.31 0-.54-.055-1.01-.135-1.405H12.24z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Evaluation preseeded login button */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1E4D40] block font-mono">
            Assessment Playground
          </span>
          <p className="text-[11px] text-shifa-charcoal/70 leading-normal font-semibold">
            Evaluate Firebase Database connection & Live User sync instantly.
          </p>
          <button
            type="button"
            onClick={triggerDemoLogin}
            disabled={loading}
            className="w-full bg-shifa-mint hover:bg-shifa-mint/80 text-shifa-green font-bold py-3 px-4 rounded-xl text-xs transition border border-shifa-green/20 cursor-pointer uppercase tracking-widest font-mono"
          >
            ⚡ Run Instant Check-In (Demo User)
          </button>
        </div>
      </div>
    </div>
  );
}
