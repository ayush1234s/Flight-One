"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { Plane, ShieldCheck, CheckSquare, Square, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GoogleConsentModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Option 1: Continue with Gmail access (if agreed)
  const handleAllowAccess = async () => {
    if (!agreed) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/gmail.readonly");

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken && typeof window !== "undefined") {
        localStorage.setItem("gmail_access_token", accessToken);
        localStorage.setItem("gmail_consent_granted", "true");
      }

      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google signin with Gmail scope error:", err);
      alert(err?.message || "Google signin failed");
    } finally {
      setLoading(false);
    }
  };

  // Option 2: Continue to Flight One WITHOUT Gmail access
  const handleNoAccess = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // Basic profile signin only without Gmail scope
      await signInWithPopup(auth, provider);

      if (typeof window !== "undefined") {
        localStorage.removeItem("gmail_access_token");
        localStorage.setItem("gmail_consent_granted", "false");
      }

      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google signin without Gmail scope error:", err);
      alert(err?.message || "Google signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-sky-400 font-bold text-lg mb-2">
          <Plane className="w-5 h-5" />
          <span>Flight One • Gmail Access Consent</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          Gmail Flight Ticket Sync Permission
        </h2>

        {/* Real Consent Statement */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-xs sm:text-sm text-gray-300 leading-relaxed space-y-2">
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Flight One</strong> requests permission to access your Gmail inbox to show your past, present, and future flights. As per your consent, we will check your Gmail for flight confirmation emails and automatically display your flight tickets in your Flight One dashboard.
            </span>
          </p>
          <p className="text-gray-400 text-xs italic border-t border-white/5 pt-2">
            * Flight One does not store, share, or read non-flight personal emails. You can revoke access at any time.
          </p>
        </div>

        {/* Consent Agreement Checkbox (REQUIRED for Gmail Access) */}
        <div
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer mb-6"
        >
          <div className="mt-0.5 shrink-0">
            {agreed ? (
              <CheckSquare className="w-5 h-5 text-sky-400" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="text-xs text-gray-200 leading-normal select-none">
            I consent to allow Flight One access to my Gmail inbox to fetch my past, present, and future flight booking confirmation emails.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAllowAccess}
            disabled={!agreed || loading}
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm transition shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-4 h-4"
                  alt="google"
                />
                <span>Allow Access & Continue with Google</span>
              </>
            )}
          </button>

          <button
            onClick={handleNoAccess}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition cursor-pointer border border-white/10 active:scale-95"
          >
            No, Go to Flight One
          </button>
        </div>
      </div>
    </div>
  );
}
