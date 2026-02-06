"use client";

import { useEffect, useMemo, useState } from "react";

type Flight = {
  flightNumber: string;
  airline: { name: string; iata: string; icao: string; country?: string };
  country?: string; // derived/best-effort
  position: { lat: number | null; lng: number | null };
  altitudeM: number | null;
  speedKmh: number | null;
  direction: number | null;
  status: string;
  departure: {
    iata: string;
    scheduled: string | null;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
    delayMin: number | null;
  };
  arrival: {
    iata: string;
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
  const [airline, setAirline] = useState("");
  const [country, setCountry] = useState("");
  const [airborneOnly, setAirborneOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/airlabs", { cache: "no-store" });
      const data = await res.json();

      // derive country best-effort
      const enriched = (data.flights || []).map((f: any) => ({
        ...f,
        country:
          f.country ||
          f.airline?.country ||
          (f.airline?.name?.toLowerCase().includes("india") ? "India" : null) ||
          null,
      }));

      setFlights(enriched);
    } catch (e) {
      console.error(e);
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
      if (airborneOnly && !["en-route", "active"].includes(f.status)) return false;

      if (search) {
        const q = search.toLowerCase();
        const inFlight = f.flightNumber?.toLowerCase().includes(q);
        const inAirline = f.airline?.name?.toLowerCase().includes(q);
        if (!inFlight && !inAirline) return false;
      }

      if (airline && !f.airline?.name?.toLowerCase().includes(airline.toLowerCase())) {
        return false;
      }

      if (country) {
        const c = (f.country || "").toLowerCase();
        if (!c.includes(country.toLowerCase())) return false;
      }

      return true;
    });
  }, [flights, search, airline, country, airborneOnly]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Live Flights (Real-time)</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          className="input"
          placeholder="Search Flight / Airline (AI202, IndiGo)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="input"
          placeholder="Filter Airline (IndiGo)"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
        />
        <input
          className="input"
          placeholder="Filter Country (India, UAE)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={airborneOnly}
            onChange={(e) => setAirborneOnly(e.target.checked)}
          />
          Airborne only
        </label>
      </div>

      {/* List */}
      {loading && <p className="text-gray-400">Loading flights…</p>}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">
                  {f.flightNumber} • {f.airline.name}
                </h3>
                <span className="text-xs text-gray-400">
                  {f.airline.iata}/{f.airline.icao}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-1">
                Country: <b className="text-white">{f.country || "—"}</b>
              </p>

              <p className="text-xs text-gray-400">
                {f.departure.iata} → {f.arrival.iata}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mt-2">
                <p>Status: <b className="text-green-400">{f.status}</b></p>
                <p>Altitude: {f.altitudeM ?? "—"} m</p>
                <p>Speed: {f.speedKmh ?? "—"} km/h</p>
                <p>Direction: {f.direction ?? "—"}°</p>
                <p>Aircraft: {f.aircraft.type}</p>
                <p>Reg: {f.aircraft.registration}</p>
                <p>Dep T/G: {f.departure.terminal ?? "—"} / {f.departure.gate ?? "—"}</p>
                <p>Arr T/G: {f.arrival.terminal ?? "—"} / {f.arrival.gate ?? "—"}</p>
                <p>Delay: {f.departure.delayMin ?? 0} min</p>
                <p>
                  Times:{" "}
                  {f.departure.scheduled
                    ? new Date(f.departure.scheduled).toLocaleTimeString()
                    : "—"}{" "}
                  /{" "}
                  {f.departure.actual
                    ? new Date(f.departure.actual).toLocaleTimeString()
                    : "—"}
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-gray-400">No flights match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
