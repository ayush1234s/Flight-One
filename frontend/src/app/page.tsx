"use client";

import { useEffect, useState } from "react";
import { Plane, Search, Ticket, MapPinned, Car, Radar } from "lucide-react";
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

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-slate-950 text-white overflow-hidden">

      {/* HERO */}
      <div className="relative">
        <AirplaneBg /> {/* ✈️ animated background */}

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

          <div>
            {loading ? (
              <Shimmer />
            ) : (
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
                  <a
                    href="/booking"
                    className="bg-sky-500 px-6 py-3 rounded-xl text-black font-semibold hover:bg-sky-400 transition"
                  >
                    Search Flights
                  </a>

                  <a
                    href="/tickets"
                    className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
                  >
                    Fetch My Tickets
                  </a>
                </div>
              </>
            )}
          </div>

          {/* GLASS CARD */}
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

      {/* WHY */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Flight One?
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Modern air travel requires switching between multiple platforms.
            Flight One simplifies this by providing a unified, privacy-first
            travel experience powered by real-time data and smart analysis.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            How Flight One Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Sign up & provide secure consent",
              "Search flights or retrieve tickets",
              "System fetches real-time travel data",
              "Redirected to official providers",
            ].map((text, i) => (
              <div
                key={i}
                className="group border border-white/10 bg-white/5 rounded-2xl p-6 hover:border-sky-400/40 transition"
              >
                <div className="text-sky-400 font-bold mb-2">
                  Step {i + 1}
                </div>
                <p className="text-gray-400 text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
          {[
            "Flight Discovery & Comparison",
            "Secure Ticket Retrieval",
            "Live Flight Traffic",
            "Airport Cab Comparison",
            "Real-Time Maps",
            "Privacy-First Design",
          ].map((feature) => (
            <div
              key={feature}
              className="border border-white/10 bg-white/5 rounded-2xl p-6 hover:border-sky-400/40 transition"
            >
              <h3 className="font-semibold text-lg mb-2">
                {feature}
              </h3>
              <p className="text-gray-400 text-sm">
                Designed around real-world aviation workflows.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOT NOTE */}
      <div className="bg-slate-950 py-16 text-center text-sm text-gray-500">
        Flight One does not process payments. All bookings redirect to official airline platforms.
      </div>

    </section>
  );
};

export default HomePage;
