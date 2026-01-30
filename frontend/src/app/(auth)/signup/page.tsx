"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (!consent) {
      alert("Please allow consent to continue");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCred.user);
      router.push("/verify-email");
    } catch {
      alert("Signup failed");
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
    <>
      <h2 className="text-xl font-semibold text-center mb-4">
        Create your account
      </h2>

      {/* GOOGLE SIGNUP */}
      <button
        onClick={handleGoogleSignup}
        className="w-full border border-white/20 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-white/10 transition mb-4"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5"
          alt="google"
        />
        Continue with Google
      </button>

      <div className="text-center text-gray-500 text-sm mb-4">
        or signup with email
      </div>

      {/* EMAIL SIGNUP */}
      <form onSubmit={handleSignup} className="space-y-5 animate-fade-in">
        <input
          type="email"
          placeholder="Email address"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none"
        />

        <label className="flex gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            onChange={(e) => setConsent(e.target.checked)}
          />
          I allow Flight One to fetch flight data using this email.
        </label>

        <button className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition">
          Create Account
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-400 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default SignupPage;
