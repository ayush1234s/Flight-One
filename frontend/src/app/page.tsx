"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { Plane, Search, Ticket, MapPinned, Car, Radar, CloudSun, MapPin, UserCheck, ArrowRight } from "lucide-react";
import AirplaneBg from "./components/hero/AirplaneBg";

const Shimmer = () => (
  <div className="animate-pulse">
    <div className="h-10 w-2/3 bg-white/10 rounded mb-4" />
    <div className="h-4 w-full bg-white/10 rounded mb-2" />
    <div className="h-4 w-5/6 bg-white/10 rounded mb-6" />
    <div className="flex gap-4">
      <div className="h-10 w-32 bg-white/10 rounded" />
      <div className="h-10 w-32 bg-white/10 rounded" />
    </div>
  </div>
);

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <section className="bg-slate-950 text-white overflow-hidden">
      {/* ORIGINAL HERO SECTION */}
      <div className="relative">
        <AirplaneBg /> {/* ✈️ animated background */}

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            {loading ? (
              <Shimmer />
            ) : user ? (
              /* LOGGED IN USER GREETING IN HERO */
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Signed in as {user.email}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                  Welcome back,{" "}
                  <span className="text-sky-400">{user.displayName || user.email.split("@")[0]}</span>! 👋
                </h1>
                <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
                  Your all-in-one smart travel companion for flights, tickets, live radar, airport cabs, and weather.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/booking"
                    className="bg-sky-500 px-6 py-3 rounded-xl text-black font-semibold hover:bg-sky-400 transition flex items-center gap-2 text-sm"
                  >
                    <span>Search Flights</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/tickets"
                    className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition text-sm"
                  >
                    View My Tickets
                  </Link>
                </div>
              </div>
            ) : (
              /* ORIGINAL BEFORE-LOGIN HERO CONTENT */
              <>
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                  Your All-in-One Platform for{" "}
                  <span className="text-sky-400">Smart Air Travel</span>
                </h1>

                <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                  Flight One unifies flight discovery, ticket access, live flight
                  tracking, airport cabs, and route planning into one secure
                  travel companion.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/booking"
                    className="bg-sky-500 px-6 py-3 rounded-xl text-black font-semibold hover:bg-sky-400 transition"
                  >
                    Search Flights
                  </Link>

                  <Link
                    href="/tickets"
                    className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
                  >
                    Fetch My Tickets
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* ORIGINAL GLASS CARD */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold mb-6">
              What Flight One Offers
            </h3>

            <ul className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <li className="flex items-center gap-2"><Search size={16} /> Flight search & comparison</li>
              <li className="flex items-center gap-2"><Ticket size={16} /> Email & PNR ticket retrieval</li>
              <li className="flex items-center gap-2"><Radar size={16} /> Live flight traffic</li>
              <li className="flex items-center gap-2"><Car size={16} /> Cab comparison</li>
              <li className="flex items-center gap-2"><MapPinned size={16} /> Live route maps</li>
              <li className="flex items-center gap-2"><Plane size={16} /> Smart travel insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* WHAT YOU CAN DO SECTION */}
      <div className="border-t border-white/10 bg-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              What You Can Do On Flight One
            </h2>
            <p className="text-gray-400 text-sm">
              Explore all tools available on the platform in simple English.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Search Flights */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-sky-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  1. Search & Compare Flights
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Search flights across Indian cities and international routes. Compare prices and book directly on official airline sites (Air India, IndiGo, SpiceJet, Vistara).
                </p>
              </div>
              <Link
                href="/booking"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                Search Flights ↗
              </Link>
            </div>

            {/* Card 2: View Tickets */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-emerald-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  2. View Your Tickets
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Check your past, present, and upcoming flight bookings registered under your account in your dashboard.
                </p>
              </div>
              <Link
                href="/tickets"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                My Tickets ↗
              </Link>
            </div>

            {/* Card 3: Cab Comparison */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-yellow-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center mb-4">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  3. Compare Airport Cabs
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Compare ride fares for Bikes 🏍️, Autos 🛺, and Cabs 🚗 across Uber, Ola, and Rapido to find the cheapest ride to the airport.
                </p>
              </div>
              <Link
                href="/cabs"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                Compare Cab Fares ↗
              </Link>
            </div>

            {/* Card 4: Live Traffic Radar */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-purple-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                  <Radar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  4. Live Air Traffic Radar
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Track active planes flying in real-time across domestic Indian and international airspace with origin/destination country details.
                </p>
              </div>
              <Link
                href="/traffic"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                Live Traffic Radar ↗
              </Link>
            </div>

            {/* Card 5: Weather Status */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-teal-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-4">
                  <CloudSun className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  5. Flight Weather Status
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  Check current temperature, wind speed, fog, and flight weather advisories for major airports before traveling.
                </p>
              </div>
              <Link
                href="/chaos"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                Check Airport Weather ↗
              </Link>
            </div>

            {/* Card 6: Interactive Map */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-indigo-400/40 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">
                  6. Interactive Flight Map
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  View airplanes on an interactive full-screen radar map with flight numbers, speed, altitude, and aircraft models.
                </p>
              </div>
              <Link
                href="/map"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center transition cursor-pointer border border-white/10 block"
              >
                Open Flight Map ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
