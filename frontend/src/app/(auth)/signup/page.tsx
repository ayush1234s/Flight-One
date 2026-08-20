"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCred.user, {
        displayName: name,
      });

      // Store consent preference
      if (typeof window !== "undefined") {
        localStorage.setItem("email_ticket_consent", consent ? "true" : "false");
      }

      const actionCodeSettings = {
        url: typeof window !== "undefined" ? `${window.location.origin}/verify-email` : "http://localhost:3000/verify-email",
        handleCodeInApp: true,
      };
      await sendEmailVerification(userCred.user, actionCodeSettings);
      router.push("/verify-email");
    } catch (err: any) {
      console.error("Signup error details:", err);
      let message = "Signup failed. Please try again.";
      if (err?.code === "auth/operation-not-allowed") {
        message = "Email/Password sign-in is NOT enabled in your Firebase Console. Please enable Email/Password provider in Firebase Authentication settings.";
      } else if (err?.code === "auth/email-already-in-use") {
        message = "This email address is already in use by another account.";
      } else if (err?.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (err?.code === "auth/weak-password") {
        message = "Password must be at least 6 characters long.";
      } else if (err?.message) {
        message = err.message;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google signup error:", err);
      alert(err?.message || "Google signup failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Create your account
      </h2>
      <p className="text-center text-gray-400 mb-6 text-sm">
        Start tracking flights and prices in one place
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="email"
          placeholder="Email address"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-sky-400"
        />

        <label className="flex gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="cursor-pointer mt-0.5"
          />
          <span>Allow Flight One to check flight booking emails for my account (Optional).</span>
        </label>

        <button
          disabled={loading}
          className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Google Signup Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGoogleSignup}
          className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition cursor-pointer font-medium text-sm text-white"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="google"
          />
          <span>Sign up with Google</span>
        </button>
      </div>

      <p className="mt-6 text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
