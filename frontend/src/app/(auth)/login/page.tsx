"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      router.push("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch {
      alert("Google login failed");
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">
        Welcome back
      </h2>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
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
        or login with email
      </div>

      {/* EMAIL LOGIN */}
      <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none"
        />

        <button className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition">
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-400 space-y-2">
        <Link href="/forget-password" className="hover:text-white block">
          Forgot password?
        </Link>

        <p>
          Don’t have an account?{" "}
          <Link href="/signup" className="text-sky-400 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
