"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

const REFRESH_TIME = 60;

const TrafficPage = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [seconds, setSeconds] = useState(REFRESH_TIME);

  const fetchFlights = async () => {
    const res = await fetch("/api/opensky", { cache: "no-store" });
    const data = await res.json();

    const list = data.states?.slice(0, 50) || [];
    setFlights(list);
    setFiltered(list);
    setSeconds(REFRESH_TIME);
  };

  useEffect(() => {
    fetchFlights();

    const refresh = setInterval(fetchFlights, 60000);
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : REFRESH_TIME));
    }, 1000);

    return () => {
      clearInterval(refresh);
      clearInterval(timer);
    };
  }, []);

  // FILTER LOGIC
  useEffect(() => {
    let data = flights;

    if (country) {
      data = data.filter((f) =>
        f[2]?.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (search) {
      data = data.filter((f) =>
        f[1]?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [country, search, flights]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          Live Flight Tracking
        </h1>

        <div className="text-sm text-gray-400">
          Refresh in <span className="text-sky-400">{seconds}s</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <input
          className="input"
          placeholder="Filter by Country (e.g. India)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          className="input"
          placeholder="Search by Flight Code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FLIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {filtered.map((f, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                {f[1]?.trim() || "Unknown Flight"}
              </h3>

              {/* ✈️ PLANE ICON ROTATION */}
              <Plane
                size={20}
                className="text-sky-400 transition-transform duration-1000"
                style={{
                  transform: `rotate(${f[10] || 0}deg)`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 text-sm text-gray-300 gap-2">
              <p>Country: {f[2]}</p>
              <p>Status: {f[8] ? "On Ground" : "Airborne"}</p>
              <p>Altitude: {Math.round(f[7] || 0)} m</p>
              <p>Speed: {Math.round((f[9] || 0) * 3.6)} km/h</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-400">
            No flights match your filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrafficPage;
