"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Ticket,
  Mail,
  Plane,
  AlertCircle,
  MapPin,
  Clock,
  User,
  Hash,
} from "lucide-react";

/* ================= SHIMMER ================= */
const TicketShimmer = () => (
  <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-4 w-32 bg-white/10 rounded" />
      <div className="h-4 w-20 bg-white/10 rounded" />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
    </div>
  </div>
);

export default function TicketsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      // simulate gmail fetch (UNCHANGED)
      if (u?.providerData[0]?.providerId === "google.com") {
        setTimeout(() => {
          setTickets([]); // demo: no tickets
          setLoading(false);
        }, 1500);
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10">
          <Plane className="text-sky-400 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-300">
            Fetching tickets from Gmail…
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <TicketShimmer key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-400">
            Please login to view your booked flight tickets.
          </p>
        </div>
      </div>
    );
  }

  /* ================= EMAIL LOGIN ================= */
  if (user.providerData[0]?.providerId !== "google.com") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md text-center">
          <Mail className="w-10 h-10 text-sky-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Google Login Required
          </h2>
          <p className="text-gray-400">
            Ticket fetching works only with Google login (Gmail access).
          </p>
        </div>
      </div>
    );
  }

  /* ================= NO TICKETS ================= */
  /* ===================== NO TICKETS ===================== */
if (tickets.length === 0) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <Ticket className="w-12 h-12 text-sky-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          No Tickets Found
        </h2>
        <p className="text-gray-400">
          We couldn’t find any flight booking emails in your Gmail.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Below is a sample ticket preview for demonstration.
        </p>
      </div>

      {/* SAMPLE TICKET PREVIEW */}
      <div className="max-w-md mx-auto">
        <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 overflow-hidden">
          {/* TOP STRIP */}
          <div className="absolute top-0 left-0 w-full h-1 bg-sky-400" />

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Plane className="text-sky-400" />
              <h3 className="font-semibold text-lg">
                Flight Ticket (Sample)
              </h3>
            </div>

            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
              Preview
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <p className="flex items-center gap-2">
              <User size={14} /> {user.displayName || user.email}
            </p>
            <p className="flex items-center gap-2">
              <Hash size={14} /> PNR: SAMPLE123
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} /> DEL → BOM
            </p>
            <p className="flex items-center gap-2">
              <Clock size={14} /> 09:45 AM
            </p>
            <p>Seat: 14C</p>
            <p>Gate: A2</p>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Source: Gmail • Sample Preview
          </div>
        </div>
      </div>
    </div>
  );
}


  /* ================= TICKETS FOUND ================= */
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-10">
        Your Flight Tickets
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {tickets.map((_, i) => (
          <div
            key={i}
            className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 overflow-hidden"
          >
            {/* TOP STRIP */}
            <div className="absolute top-0 left-0 w-full h-1 bg-sky-400" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Plane className="text-sky-400" />
                <h3 className="font-semibold text-lg">
                  Flight Ticket
                </h3>
              </div>

              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                Confirmed
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <User size={14} /> {user.displayName || user.email}
              </p>
              <p className="flex items-center gap-2">
                <Hash size={14} /> PNR: F1X9A{i}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} /> DEL → BOM
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} /> 10:30 AM
              </p>
              <p>Seat: 12A</p>
              <p>Gate: B3</p>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Source: Gmail • Auto detected
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
