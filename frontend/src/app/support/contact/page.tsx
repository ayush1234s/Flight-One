"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setEmail(u.email || "");
        setName(u.displayName || "");
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        message,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setMessage("");
    } catch (err) {
      console.error("Error saving message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-4 text-center">
        Contact Us
      </h1>

      <p className="text-gray-400 text-center mb-10">
        Have a question or feedback? We’d love to hear from you.
      </p>

      {success ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Message Sent Successfully
          </h2>
          <p className="text-gray-400">
            Our team will get back to you shortly.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full mt-1"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              value={email}
              disabled={!!user}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input w-full mt-1 h-32"
              placeholder="Write your message..."
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-sky-500 text-black py-3 rounded-lg font-semibold hover:bg-sky-400 transition flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Send Message"}
            <Send size={18} />
          </button>
        </form>
      )}

      {/* FOOT NOTE */}
      <div className="mt-10 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Mail size={14} />
        support Flight-One
      </div>
    </div>
  );
}
