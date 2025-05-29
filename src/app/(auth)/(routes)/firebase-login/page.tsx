'use client';

import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  auth.languageCode = 'it';
  useEffect(() => {
    console.log(window.recaptchaVerifier)
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
        size: 'invisible',
        callback: () => console.log("reCAPTCHA solved"),
      });
    }
  }, []);

  const sendOtp = async () => {
    const appVerifier = window.recaptchaVerifier;
    const phone = '+91' + mobile;
    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert('OTP Sent!');
    } catch (err) {
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await confirmationResult.confirm(otp);
      const token = await res.user.getIdToken();
      // Send token to backend
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      alert(`Login Success: ${data.user.role}`);
    } catch (err) {
      console.error('Invalid OTP');
    }
  };

  return (
    <div>
      <h2>Login via Mobile</h2>
      <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" />
      <button onClick={sendOtp}>Send OTP</button>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={verifyOtp}>Verify OTP</button>
      <div id="recaptcha"></div>
    </div>
  );
}
