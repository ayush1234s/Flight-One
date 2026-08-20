"use client";

import { useEffect, useMemo, useState } from "react";

type Flight = {
  flightNumber: string;
  airline: { name: string; iata: string; icao: string; country?: string };
  position: { lat: number | null; lng: number | null };
  altitudeM: number | null;
  speedKmh: number | null;
  direction: number | null;
  status: string;
  isInternational?: boolean;
  isIndiaRelated?: boolean;
  departure: {
    iata: string;
    city: string;
    country: string;
    flag: string;
    airportName: string;
    scheduled: string | null;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
    delayMin: number | null;
  };
  arrival: {
    iata: string;
    city: string;
    country: string;
    flag: string;
    airportName: string;
    scheduled: string | null;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
    delayMin: number | null;
  };
  aircraft: { type: string; registration: string; manufacturer: string };
};

export default function TrafficPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "international" | "india">("all");
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/airlabs", { cache: "no-store" });
      const data = await res.json();
      setFlights(data.flights || []);
    } catch (e) {
      console.error("Fetch traffic data error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    const t = setInterval(fetchFlights, 15000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return flights.filter((f) => {
      if (categoryFilter === "international" && !f.isInternational) return false;
      if (categoryFilter === "india" && !f.isIndiaRelated) return false;

      if (search) {
        const q = search.toLowerCase();
        const inFlight = f.flightNumber?.toLowerCase().includes(q);
        const inAirline = f.airline?.name?.toLowerCase().includes(q);
        const inDepCity = f.departure?.city?.toLowerCase().includes(q);
        const inArrCity = f.arrival?.city?.toLowerCase().includes(q);
        const inDepCountry = f.departure?.country?.toLowerCase().includes(q);
        const inArrCountry = f.arrival?.country?.toLowerCase().includes(q);
        if (!inFlight && !inAirline && !inDepCity && !inArrCity && !inDepCountry && !inArrCountry) {
          return false;
        }
      }

      return true;
    });
  }, [flights, search, categoryFilter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Live Flight Radar & Traffic
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track active domestic and international flights in the air.
          </p>
        </div>

        <button
          onClick={fetchFlights}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition cursor-pointer self-start sm:self-auto"
        >
          Refresh Status
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition border cursor-pointer ${
            categoryFilter === "all"
              ? "bg-sky-500 text-black border-sky-400"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          All Flights ({flights.length})
        </button>

        <button
          onClick={() => setCategoryFilter("india")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition border cursor-pointer ${
            categoryFilter === "india"
              ? "bg-emerald-500 text-black border-emerald-400"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          India Flights ({flights.filter((f) => f.isIndiaRelated).length})
        </button>

        <button
          onClick={() => setCategoryFilter("international")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition border cursor-pointer ${
            categoryFilter === "international"
              ? "bg-purple-500 text-white border-purple-400"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          International Flights ({flights.filter((f) => f.isInternational).length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          className="w-full sm:w-96 h-11 px-4 rounded-lg bg-white/5 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-sm placeholder-gray-400"
          placeholder="Search flight number, airline, or city (e.g. AI101, Delhi)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading live flight status...
        </div>
      )}

      {/* Flight Cards Grid */}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((f, i) => (
            <div
              key={`${f.flightNumber}-${i}`}
              className="rounded-xl bg-white/5 border border-white/10 p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition"
            >
              <div>
                {/* Top Bar */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">{f.flightNumber}</h3>
                    <p className="text-xs text-gray-400">{f.airline.name}</p>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border ${
                      f.isInternational
                        ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    }`}
                  >
                    {f.isInternational ? "International" : "Domestic"}
                  </span>
                </div>

                {/* Route Banner with Flight Progress Bar */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 my-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white mb-2">
                    <span>{f.departure.flag} {f.departure.city} ({f.departure.iata})</span>
                    <span>{f.arrival.flag} {f.arrival.city} ({f.arrival.iata})</span>
                  </div>

                  {/* Flight Progress Bar Track */}
                  <div className="relative my-2">
                    <div className="h-1.5 bg-gray-800 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-sky-400 w-2/3 rounded-full"></div>
                    </div>
                    <div className="absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 text-sky-400 text-xs font-bold">
                      ✈️
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>{f.departure.country}</span>
                    <span>{f.arrival.country}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-white/5 p-3 rounded-lg mb-3">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Altitude</span>
                    <strong className="text-white">{f.altitudeM ? `${f.altitudeM.toLocaleString()} m` : "—"}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Speed</span>
                    <strong className="text-white">{f.speedKmh ? `${f.speedKmh} km/h` : "—"}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Aircraft</span>
                    <strong className="text-gray-200 truncate block">{f.aircraft.type}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Status</span>
                    <strong className="text-emerald-400">{f.status}</strong>
                  </div>
                </div>
              </div>

              {/* Timing & Delay Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3">
                <span>
                  Delay:{" "}
                  <strong className={f.departure.delayMin && f.departure.delayMin > 0 ? "text-amber-400" : "text-emerald-400"}>
                    {f.departure.delayMin && f.departure.delayMin > 0 ? `${f.departure.delayMin} min` : "On Time"}
                  </strong>
                </span>
                <span>
                  Departure: <strong className="text-white">{f.departure.scheduled ? new Date(f.departure.scheduled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Scheduled"}</strong>
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm bg-white/5 border border-white/10 rounded-xl">
              No flights found matching "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
