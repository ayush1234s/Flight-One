"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function TicketsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      // ✅ only google login users
      if (u?.providerData[0]?.providerId === "google.com") {
        // simulate fetch
        setTimeout(() => {
          setTickets([]); // no ticket found
        }, 1000);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  // ❌ not logged in
  if (!user) {
    return (
      <div className="p-24 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Login Required
        </h2>
        <p className="text-gray-400">
          Please login to view your flight tickets.
        </p>
      </div>
    );
  }

  // ❌ email-password login
  if (user.providerData[0]?.providerId !== "google.com") {
    return (
      <div className="p-24 text-center">
        <h2 className="text-xl font-bold mb-3">
          Google Login Required
        </h2>
        <p className="text-gray-400">
          To fetch flight tickets, please login using Google.
        </p>
      </div>
    );
  }

  // ✅ google login but no tickets
  if (tickets.length === 0) {
    return (
      <div className="p-24 text-center">
        <h2 className="text-xl font-bold mb-3">
          No Tickets Found
        </h2>
        <p className="text-gray-400">
          Your Gmail does not contain any flight booking emails.
        </p>
      </div>
    );
  }

  // ✅ tickets found
  return (
    <div className="max-w-4xl mx-auto py-24">
      <h1 className="text-3xl font-bold mb-6">
        Your Tickets
      </h1>

      {tickets.map((t, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 p-4 rounded-xl mb-4"
        >
          Flight Ticket #{i + 1}
        </div>
      ))}
    </div>
  );
}
