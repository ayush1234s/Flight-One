"use client";

import { useEffect, useState } from "react";
import { Plane, RefreshCw } from "lucide-react";

const REFRESH_TIME = 15 * 60; // 15 minutes

type Flight = any[];

const TrafficPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filtered, setFiltered] = useState<Flight[]>([]);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [seconds, setSeconds] = useState(REFRESH_TIME);
  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/aviationstack", { cache: "no-store" });
      const data = await res.json();

      const list: Flight[] = data.states || [];

      setFlights(list);
      setFiltered(list);
      setCached(!!data.cached);
      setSeconds(REFRESH_TIME);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();

    const refresh = setInterval(fetchFlights, REFRESH_TIME * 1000);
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
        (f[2] || "").toLowerCase().includes(country.toLowerCase())
      );
    }

    if (search) {
      data = data.filter((f) =>
        (f[1] || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [country, search, flights]);

  const getStatus = (f: Flight) => {
    // If altitude or speed present, consider airborne
    const altitude = f[7] || 0;
    const speedMs = f[9] || 0;

    if (altitude > 100 || speedMs > 50 / 3.6) {
      return <span className="text-green-400">Airborne</span>;
    }
    return <span className="text-yellow-400">On Ground</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Live Flight Tracking</h1>

          <div className="flex items-center gap-2 text-red-500 font-semibold text-xs px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            LIVE
          </div>

          {cached && (
            <span className="text-xs text-yellow-400">(Cached)</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          Auto refresh in{" "}
          <span className="text-sky-400 font-medium">{seconds}s</span>

          <button
            onClick={fetchFlights}
            className="flex items-center gap-1 px-3 py-1 rounded-md border border-white/10 hover:border-sky-400/40 hover:text-sky-400 transition"
          >
            <RefreshCw size={14} />
            Refresh Now
          </button>
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
          placeholder="Search by Flight Code (e.g. AI202)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* FLIGHTS */}
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5 hover:border-sky-400/40 hover:shadow-sky-500/10 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base truncate">
                  {f[1]?.trim() || "Unknown Flight"}
                </h3>

                <Plane
                  size={20}
                  className="text-sky-400 transition-transform duration-1000 group-hover:scale-110"
                  style={{ transform: `rotate(${f[10] || 0}deg)` }}
                />
              </div>

              <div className="grid grid-cols-2 text-xs text-gray-300 gap-2">
                <p>
                  <span className="text-gray-400">Country:</span>{" "}
                  {f[2] || "—"}
                </p>
                <p>
                  <span className="text-gray-400">Status:</span> {getStatus(f)}
                </p>
                <p>
                  <span className="text-gray-400">Altitude:</span>{" "}
                  {Math.round(f[7] || 0)} m
                </p>
                <p>
                  <span className="text-gray-400">Speed:</span>{" "}
                  {Math.round((f[9] || 0) * 3.6)} km/h
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400">No flights match your filter.</p>
              <p className="text-gray-500">
                Free API has limited live data. Try refreshing after some time.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrafficPage;
