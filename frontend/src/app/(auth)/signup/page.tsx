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
  const [name, setName] = useState(""); // 👈 Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (!consent) {
      alert("Please allow consent to continue");
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 👇 Save name to Firebase profile
      await updateProfile(userCred.user, {
        displayName: name,
      });

      await sendEmailVerification(userCred.user);
      router.push("/verify-email");
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch {
      alert("Google signup failed");
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

        <label className="flex gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            onChange={(e) => setConsent(e.target.checked)}
          />
          I allow Flight One to fetch flight data using this email.
        </label>

        <button
          disabled={loading}
          className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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

      {/* Google small icon button */}
      <div className="flex justify-center">
        <button
          onClick={handleGoogleSignup}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
            alt="google"
          />
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
