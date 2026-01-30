"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (!consent) {
      alert("Please allow consent to continue.");
      return;
    }

    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      router.push("/verify-email");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Create your account
      </h2>

      <form onSubmit={handleSignup} className="space-y-5 animate-fade-in">
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
          <input type="checkbox" onChange={(e) => setConsent(e.target.checked)} />
          I allow Flight One to access flight data using this email.
        </label>

        <button
          disabled={loading}
          className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
        >
          {loading ? "Creating account..." : "Create Account"}
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
