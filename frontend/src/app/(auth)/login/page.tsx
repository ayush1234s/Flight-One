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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error details:", err);
      let message = "Invalid email or password.";
      if (err?.code === "auth/user-not-found" || err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      } else if (err?.code === "auth/too-many-requests") {
        message = "Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later.";
      } else if (err?.message) {
        message = err.message;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google login error:", err);
      alert(err?.message || "Google login failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Welcome back
      </h2>
      <p className="text-center text-gray-400 mb-6 text-sm">
        Login to manage your trips
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
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

        <button
          disabled={loading}
          className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Standard Normal Google Login */}
      <div className="flex justify-center">
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition cursor-pointer font-medium text-sm text-white"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="google"
          />
          <span>Log in with Google</span>
        </button>
      </div>

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
    </div>
  );
};

export default LoginPage;
