"use client";

import { auth } from "@/firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import Link from "next/link";

const VerifyEmailPage = () => {
  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">
        Verify your email
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        We’ve sent a verification link to your email.
        Please verify before logging in.
      </p>

      <button
        onClick={() => sendEmailVerification(auth.currentUser!)}
        className="w-full bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition mb-4"
      >
        Resend Verification Email
      </button>

      <Link
        href="/login"
        className="block text-center text-sm text-sky-400 hover:underline"
      >
        Go to Login
      </Link>
    </>
  );
};

export default VerifyEmailPage;
