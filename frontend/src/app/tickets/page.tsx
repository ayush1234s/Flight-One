"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Ticket as TicketIcon,
  Plane,
  AlertCircle,
  MapPin,
  Clock,
  User,
  Hash,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CheckSquare,
  Square,
} from "lucide-react";
import Link from "next/link";

/* ================= SHIMMER ================= */
const TicketShimmer = () => (
  <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 sm:p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-4 w-32 bg-white/10 rounded" />
      <div className="h-4 w-20 bg-white/10 rounded" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
      <div className="h-3 bg-white/10 rounded" />
    </div>
  </div>
);

type TicketType = {
  pnr: string;
  airlineName: string;
  flightNumber: string;
  passengerName: string;
  passengerEmail: string;
  fromCity: string;
  fromIata: string;
  toCity: string;
  toIata: string;
  departureDate: string;
  departureTime: string;
  seat: string;
  gate: string;
  terminal: string;
  status: "Confirmed" | "Completed" | "Upcoming";
  timeframe: "past" | "present" | "future";
};

export default function TicketsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [permissionGiven, setPermissionGiven] = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Read saved consent state if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("email_ticket_consent");
      if (saved === "true") {
        setPermissionGiven(true);
        setConsentChecked(true);
      } else if (saved === "false") {
        setPermissionGiven(false);
      }
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u?.email) {
        // If permission was already given, fetch tickets
        const saved = localStorage.getItem("email_ticket_consent");
        if (saved === "true") {
          try {
            const res = await fetch(`/api/tickets?email=${encodeURIComponent(u.email)}`);
            const data = await res.json();
            setTickets(data.tickets || []);
          } catch (e) {
            console.error("Ticket fetch error:", e);
            setTickets([]);
          }
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleGivePermission = async () => {
    if (!consentChecked || !user?.email) return;
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("email_ticket_consent", "true");
    }
    setPermissionGiven(true);

    try {
      const res = await fetch(`/api/tickets?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      console.error("Ticket fetch error:", e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoPermission = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("email_ticket_consent", "false");
    }
    setPermissionGiven(false);
    setTickets([]);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="flex items-center gap-3 mb-8">
          <Plane className="text-sky-400 animate-pulse" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-300">
            Checking flight tickets for your account…
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <TicketShimmer key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center backdrop-blur-md">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-6">
            Please log in to view your past, present, and future flight tickets.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold transition cursor-pointer text-xs sm:text-sm"
          >
            Log In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>Flight Tickets Dashboard</span>
          </h1>
          <span className="text-xs px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-medium self-start sm:self-auto truncate max-w-full">
            Account: {user.email}
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Manage and inspect your past, present, and future flight booking tickets.
        </p>
      </div>

      {/* CONSENT FORM CARD ON TICKETS PAGE */}
      {permissionGiven === null && (
        <div className="mb-8 rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm sm:text-base mb-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Email Ticket Access Permission</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
            Allow Flight One to check flight confirmation emails?
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-5">
            Flight One requests your permission to check for flight booking confirmation emails in your account for your <strong>past, present, and future flights</strong>. Flight One does not read or save any personal emails.
          </p>

          {/* Checkbox */}
          <div
            onClick={() => setConsentChecked(!consentChecked)}
            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer mb-6"
          >
            <div className="mt-0.5 shrink-0">
              {consentChecked ? (
                <CheckSquare className="w-5 h-5 text-sky-400" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <span className="text-xs sm:text-sm text-gray-200 select-none leading-normal break-all">
              Allow Flight One to check flight booking confirmation emails for my account ({user.email}).
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleGivePermission}
              disabled={!consentChecked}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center"
            >
              Give Permission & Check Tickets
            </button>

            <button
              onClick={handleNoPermission}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition cursor-pointer border border-white/10 active:scale-95 text-center"
            >
              No, Go Ahead
            </button>
          </div>
        </div>
      )}

      {/* PERMISSION DENIED NOTICE */}
      {permissionGiven === false && (
        <div className="mb-8 rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Email ticket checking disabled by user consent preference.</span>
          </span>
          <button
            onClick={() => {
              setPermissionGiven(null);
              setConsentChecked(false);
            }}
            className="text-sky-400 hover:underline font-semibold cursor-pointer shrink-0"
          >
            Change Consent Setting
          </button>
        </div>
      )}

      {/* NO TICKETS FOUND OR PERMISSION DENIED -> SAMPLE PREVIEW */}
      {(tickets.length === 0 || permissionGiven === false) && (
        <div className="w-full">
          <div className="text-center max-w-lg mx-auto mb-8 px-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
              <TicketIcon className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              No flight booked from this email
            </h2>
            <p className="text-sky-400 font-mono text-xs mb-2 truncate max-w-full px-4">
              {user.email}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              We couldn’t find any active or past flight reservations for this address. Below is a sample ticket preview showing how your tickets will appear once booked.
            </p>
          </div>

          {/* SAMPLE TICKET PREVIEW RESPONSIVE CONTAINER */}
          <div className="max-w-md mx-auto w-full">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-950 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-emerald-400" />

              <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2">
                  <Plane className="text-sky-400 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">
                    Flight Ticket (Sample)
                  </h3>
                </div>

                <span className="text-[10px] sm:text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                  Sample Preview
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 mb-5 bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5">
                <p className="flex items-center gap-2 min-w-0">
                  <User size={14} className="text-sky-400 shrink-0" />
                  <span className="truncate">{user.displayName || user.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Hash size={14} className="text-sky-400 shrink-0" />
                  <span>PNR: F1X-8921</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-sky-400 shrink-0" />
                  <span>Delhi (DEL) → Mumbai (BOM)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-400 shrink-0" />
                  <span>09:45 AM (2h 15m)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={14} className="text-sky-400 shrink-0" />
                  <span>Seat: 14C • Terminal 3</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-semibold">Confirmed</span>
                </p>
              </div>

              <div className="text-[10px] sm:text-[11px] text-gray-400 text-center border-t border-white/10 pt-3 truncate">
                Sample ticket representation for {user.email}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKETS FOUND */}
      {permissionGiven === true && tickets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {tickets.map((t, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-950 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-emerald-400" />

              <div>
                <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      ✈️
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{t.airlineName} ({t.flightNumber})</h3>
                      <p className="text-xs text-gray-400 font-mono">PNR: {t.pnr}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold uppercase border shrink-0 ${
                      t.status === "Confirmed" || t.status === "Upcoming"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-gray-500/20 text-gray-300 border-gray-500/40"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-white mb-2">
                    <span>{t.fromCity} ({t.fromIata})</span>
                    <span className="text-sky-400">✈️</span>
                    <span>{t.toCity} ({t.toIata})</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs text-gray-400">
                    <span>Date: <strong className="text-white">{t.departureDate}</strong></span>
                    <span>Time: <strong className="text-white">{t.departureTime}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-gray-300 mb-4 bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5">
                  <p className="flex items-center gap-2 min-w-0">
                    <User size={14} className="text-sky-400 shrink-0" />
                    <span className="truncate">{t.passengerName}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Hash size={14} className="text-sky-400 shrink-0" />
                    <span>Seat: {t.seat}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-sky-400 shrink-0" />
                    <span>Gate: {t.gate}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-sky-400 shrink-0" />
                    <span>Terminal: {t.terminal}</span>
                  </p>
                </div>
              </div>

              <div className="text-[10px] sm:text-[11px] text-gray-400 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="truncate mr-2">Account: {user.email}</span>
                <span className="text-emerald-400 font-medium shrink-0">✓ Verified Booking</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
