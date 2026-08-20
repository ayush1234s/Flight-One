"use client";

import { useEffect, useState, Suspense } from "react";
import { auth } from "@/firebase/firebase";
import { sendEmailVerification, applyActionCode, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [resendStatus, setResendStatus] = useState("");

  useEffect(() => {
    const checkVerification = async () => {
      // 1. Handle redirect directly from email verification link containing oobCode
      if (mode === "verifyEmail" && oobCode) {
        try {
          await applyActionCode(auth, oobCode);
          if (auth.currentUser) {
            await auth.currentUser.reload();
          }
          setVerified(true);
          setLoading(false);
          return;
        } catch (err: any) {
          console.error("Verification code error:", err);
          setMessage("Verification link is invalid or has expired.");
          setLoading(false);
          return;
        }
      }

      // 2. Otherwise check current logged in user verification status
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            setVerified(true);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkVerification();
  }, [mode, oobCode]);

  const handleCheckStatus = async () => {
    setLoading(true);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setVerified(true);
      } else {
        alert("Email is not verified yet. Please check your inbox and click the verification link.");
      }
    } else {
      alert("Please check your email inbox and click the verification link.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (auth.currentUser) {
      try {
        const actionCodeSettings = {
          url: window.location.origin + "/verify-email",
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        setResendStatus("Verification email sent! Please check your inbox.");
      } catch (err: any) {
        setResendStatus(err?.message || "Failed to resend verification email.");
      }
    } else {
      setResendStatus("Please sign in or check your email inbox.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-sky-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Checking email verification...</p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border border-emerald-500/40">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Email Verified!
        </h2>
        <p className="text-emerald-400 font-medium mb-6 text-base">
          You are verified successfully!
        </p>

        <Link
          href="/dashboard"
          className="inline-block w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition text-center"
        >
          Explore Flight One
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Verify your email
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        We’ve sent a verification link to your email. Please verify before logging in.
      </p>

      {message && (
        <p className="text-sm text-red-400 text-center mb-4">{message}</p>
      )}

      {resendStatus && (
        <p className="text-sm text-sky-400 text-center mb-4">{resendStatus}</p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleCheckStatus}
          className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
        >
          I have verified my email
        </button>

        <button
          onClick={handleResend}
          className="w-full bg-white/10 py-3 rounded-lg text-white font-medium hover:bg-white/20 transition border border-white/10"
        >
          Resend Verification Email
        </button>
      </div>

      <Link
        href="/login"
        className="block text-center text-sm text-sky-400 hover:underline mt-6"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-8">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
