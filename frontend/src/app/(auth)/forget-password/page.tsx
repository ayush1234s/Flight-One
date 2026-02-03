"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useState } from "react";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const resetPassword = async () => {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent to your email.");
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">
        Reset your password
      </h2>

      <input
        type="email"
        placeholder="Registered email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 outline-none mb-4"
      />

      <button
        onClick={resetPassword}
        className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
      >
        Send Reset Link
      </button>

      <Link
        href="/login"
        className="block text-center mt-4 text-sm text-sky-400 hover:underline"
      >
        Back to Login
      </Link>
    </>
  );
};

export default ForgotPasswordPage;
