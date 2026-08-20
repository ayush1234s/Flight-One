"use client";

import { useEffect, useState } from "react";
import FlightMap from "../components/map/FlightMap";

type LivePlane = {
  id: string;
  callsign: string;
  country: string;
  lat: number;
  lng: number;
  altitudeM: number;
  speedKmh: number;
  heading: number;
};

const MapPage = () => {
  const [planes, setPlanes] = useState<LivePlane[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLivePlanes = async () => {
    try {
      const res = await fetch("/api/opensky", { cache: "no-store" });
      const data = await res.json();
      setPlanes(data.planes || []);
    } catch (e) {
      console.error("Map page fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePlanes();
    const interval = setInterval(fetchLivePlanes, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <span>Live Global Air Traffic Radar</span>
          <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-mono font-medium flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Real-Time Sky Stream
          </span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Showing real airborne aircraft flying in the sky right now across domestic and international flight corridors.
        </p>
      </div>

      {/* Map Container */}
      <div className="w-full">
        {loading && planes.length === 0 ? (
          <div className="h-[720px] w-full rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-gray-400">
            <div className="animate-spin h-8 w-8 border-2 border-yellow-400 border-t-transparent rounded-full mb-3"></div>
            <span>Loading Real Airborne Flight Radar...</span>
          </div>
        ) : (
          <FlightMap planes={planes} />
        )}
      </div>
    </div>
  );
};

export default MapPage;
