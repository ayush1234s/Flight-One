"use client";

import { useEffect, useState } from "react";
import FlightMap from "../components/map/FlightMap";

type Flight = {
  flightNumber: string;
  airline: { name: string; iata: string; icao: string };
  position: { lat: number | null; lng: number | null };
  altitudeM: number | null;
  speedKmh: number | null;
  direction: number | null;
  status: string;
  isInternational?: boolean;
  departure: {
    iata: string;
    city: string;
    country: string;
    flag: string;
  };
  arrival: {
    iata: string;
    city: string;
    country: string;
    flag: string;
  };
  aircraft: { type: string; registration: string };
};

const MapPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/airlabs", {
        cache: "no-store",
      });
      const data = await res.json();
      setFlights(data.flights || []);
    } catch (e) {
      console.error("Map page fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>Live Flight Map</span>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Radar
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Real-time aircraft positions showing active domestic and international flights in the air.
        </p>
      </div>

      {/* Map Container */}
      <div className="w-full">
        {loading && flights.length === 0 ? (
          <div className="h-[650px] w-full rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-gray-400">
            <div className="animate-spin h-8 w-8 border-2 border-sky-400 border-t-transparent rounded-full mb-3"></div>
            <span>Loading Flight Map...</span>
          </div>
        ) : (
          <FlightMap flights={flights} />
        )}
      </div>
    </div>
  );
};

export default MapPage;
