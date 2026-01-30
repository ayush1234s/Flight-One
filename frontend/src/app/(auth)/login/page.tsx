"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
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
    } catch (err: any) {
      alert("Invalid login credentials");
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Welcome back
      </h2>

      <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-sky-400"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-sky-400"
        />

        <button className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition">
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-400 space-y-2">
        <Link href="/forgot-password" className="hover:text-white block">
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
