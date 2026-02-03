"use client";

import { useEffect, useState } from "react";
import FlightMap from "../components/map/FlightMap";

const MapPage = () => {
  const [flights, setFlights] = useState<any[]>([]);

  const fetchFlights = async () => {
    const res = await fetch("/api/opensky", {
      cache: "no-store",
    });
    const data = await res.json();

    setFlights(data.states?.slice(0, 100) || []);
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-24 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Live Flight Map
      </h1>

      <p className="text-gray-400 mb-8">
        Real-time aircraft positions powered by OpenSky Network.
      </p>

      <FlightMap flights={flights} />
    </div>
  );
};

export default MapPage;
