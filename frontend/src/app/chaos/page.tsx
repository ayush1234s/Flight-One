"use client";

import { useEffect, useMemo, useState } from "react";

type AirportWeather = {
  iata: string;
  city: string;
  airportName: string;
  tempC: number;
  windSpeedKmh: number;
  weatherCondition: string;
  weatherIcon: string;
  safetyStatus: "SAFE" | "CAUTION" | "UNSAFE";
  travelAdvisory: string;
};

export default function ChaosRadarPage() {
  const [airports, setAirports] = useState<AirportWeather[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/airlabs/chaos", { cache: "no-store" });
      const data = await res.json();
      setAirports(data.airports || []);
    } catch (e) {
      console.error("Fetch weather error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filteredAirports = useMemo(() => {
    return airports.filter((ap) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        ap.city.toLowerCase().includes(q) ||
        ap.iata.toLowerCase().includes(q) ||
        ap.weatherCondition.toLowerCase().includes(q)
      );
    });
  }, [airports, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Flight Weather & Travel Status
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Check current airport weather conditions and travel advisories before your flight.
          </p>
        </div>

        <button
          onClick={fetchWeather}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition cursor-pointer self-start sm:self-auto"
        >
          Refresh Status
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <input
          className="w-full sm:w-96 h-11 px-4 rounded-lg bg-white/5 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-sm placeholder-gray-400"
          placeholder="Search city or airport (e.g. Delhi, BOM)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading weather updates...
        </div>
      )}

      {/* Airport Weather Cards */}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAirports.map((ap, idx) => (
            <div
              key={`${ap.iata}-${idx}`}
              className="rounded-xl bg-white/5 border border-white/10 p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {ap.city} ({ap.iata})
                    </h3>
                    <p className="text-xs text-gray-400">{ap.airportName}</p>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                      ap.safetyStatus === "SAFE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : ap.safetyStatus === "CAUTION"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {ap.safetyStatus === "SAFE"
                      ? "Good for Travel"
                      : ap.safetyStatus === "CAUTION"
                      ? "Minor Delay Risk"
                      : "Weather Warning"}
                  </span>
                </div>

                {/* Weather details */}
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 my-4">
                  <span className="text-3xl">{ap.weatherIcon}</span>
                  <div>
                    <span className="text-xl font-bold text-white">{ap.tempC}°C</span>
                    <p className="text-xs text-gray-300">{ap.weatherCondition} • Wind: {ap.windSpeedKmh} km/h</p>
                  </div>
                </div>

                {/* Advisory */}
                <p className="text-xs text-gray-300 leading-relaxed">
                  {ap.travelAdvisory}
                </p>
              </div>
            </div>
          ))}

          {filteredAirports.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              No airports found matching "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
