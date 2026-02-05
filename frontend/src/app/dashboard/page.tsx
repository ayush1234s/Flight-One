"use client";

import { useAuth } from "@/app/context/AuthContent";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return null;

  // ✅ Name logic
  const userName =
    user?.displayName || user?.email || "User";

  return (
    <section className="bg-slate-950 text-white">

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

        <div>
          {/* ✅ FIXED WELCOME */}
          <h1 className="text-5xl font-bold leading-tight">
            Welcome 👋
          </h1>

          <p className="mt-3 text-lg text-gray-300">
            {userName}
          </p>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Flight One is an intelligent air travel assistant designed to
            simplify the entire flight journey. From discovering flights to
            retrieving tickets, tracking live flights, planning airport routes,
            and arranging local transport — everything is available in one
            secure platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/booking"
              className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
            >
              Search Flights
            </a>

            <a
              href="/tickets"
              className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Fetch My Tickets
            </a>

            {/* ✅ ONLY ADDITION */}
            <a
              href="/estimator"
              className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Estimate Total Trip Cost
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold mb-4">
            What You Can Do
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✈️ Search and compare available flights</li>
            <li>📩 Retrieve booked tickets using email or PNR</li>
            <li>🕒 View past, ongoing and upcoming flights</li>
            <li>🛰️ Track live flight traffic and delays</li>
            <li>🚕 Compare airport cab fares and ETA</li>
            <li>🗺️ View live routes and traffic maps</li>
          </ul>
        </div>
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
