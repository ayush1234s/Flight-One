"use client";

import { useAuth } from "@/app/context/AuthContent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plane, Search, Ticket, MapPinned, Car, Radar } from "lucide-react";
import AirplaneBg from "@/app/components/hero/AirplaneBg";

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

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return null;

  const userName =
    user?.displayName || user?.email || "User";

  return (
    <section className="bg-slate-950 text-white overflow-hidden">

      {/* 🔥 HERO SECTION */}
      <div className="relative">
        <AirplaneBg />

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

          <div>
            {heroLoading ? (
              <Shimmer />
            ) : (
              <>
                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                  Welcome 👋
                </h1>
                <h2 className="text-3xl font-bold leading-tight tracking-tight block text-sky-400">
                  {userName}
                </h2>

                <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight">
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

                  <a
                    href="/estimator"
                    className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
                  >
                    Travel Buddy 😉
                  </a>
                </div>
              </>
            )}
          </div>

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

      {/* WHAT YOU CAN DO */}
      <div className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="text-4xl font-bold text-center mb-12">
          What You Can Do
        </h2>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-10">
          <ul className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
            <li>✈️ Search and compare available flights</li>
            <li>📩 Retrieve booked tickets using email or PNR</li>
            <li>🕒 View past, ongoing and upcoming flights</li>
            <li>🛰️ Track live flight traffic and delays</li>
            <li>🚕 Compare airport cab fares and ETA</li>
            <li>🗺️ View live routes and traffic maps</li>
          </ul>
        </div>
        <div className="mt-8 flex justify-center">
  <a
    href="/chaos"
    className="border border-white/20 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 transition"
  >
    Live Chaos Radar
  </a>
  
</div> <br />
<p className="text-center text-sm text-gray-400">
  Chaos Radar shows live airport disruptions like delays and congestion, so you can decide whether to travel or avoid risky routes.
</p>


      </div>

      {/* WHY FLIGHT ONE */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Flight One?
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Air travel today requires multiple applications for flight booking,
            ticket access, live tracking, cab services, and navigation.
            Flight One eliminates this complexity by unifying all essential
            travel services into one intelligent platform.
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
              "User signs up and provides consent",
              "Search flights or fetch tickets",
              "System processes real-time travel data",
              "User redirected to official providers",
            ].map((text, i) => (
              <div
                key={i}
                className="border border-white/10 bg-white/5 rounded-xl p-6"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Step {i + 1}
                </h3>
                <p className="text-gray-400 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
          {[
            "Flight Booking & Comparison",
            "Email and PNR Ticket Retrieval",
            "Live Flight Traffic Monitoring",
            "Airport Cab Fare Comparison",
            "Live Route and Traffic Visualization",
            "Privacy-First Consent-Based Design",
          ].map((feature) => (
            <div
              key={feature}
              className="border border-white/10 bg-white/5 rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg mb-2">
                {feature}
              </h3>
              <p className="text-gray-400 text-sm">
                Designed following real-world aviation workflows.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOT NOTE */}
      <div className="bg-slate-950 py-16 text-center text-sm text-gray-500">
        Flight One does not process payments or store booking data.
        All bookings are redirected to official airline websites.
      </div>

    </section>
  );
};

export default DashboardPage;
