"use client";

import { useEffect, useState } from "react";

type CabOption = {
  id: string;
  provider: "Uber" | "Ola" | "Rapido";
  category: "Bike" | "Auto" | "Car";
  type: string;
  priceInr: number;
  etaMins: number;
  distanceKm: number;
  icon: string;
  isLowestInCategory?: boolean;
  bookingUrl: string;
};

type CheapestSummary = {
  bike: string | null;
  auto: string | null;
  car: string | null;
};

const CITY_AIRPORTS = [
  { code: "DEL", label: "Delhi Airport (DEL - T3 / T2 / T1)" },
  { code: "BOM", label: "Mumbai Airport (BOM - T2 / T1)" },
  { code: "BLR", label: "Bengaluru Airport (BLR)" },
  { code: "HYD", label: "Hyderabad Airport (HYD)" },
  { code: "CCU", label: "Kolkata Airport (CCU)" },
  { code: "MAA", label: "Chennai Airport (MAA)" },
  { code: "GOI", label: "Goa Dabolim Airport (GOI)" },
  { code: "GOX", label: "Goa Mopa Airport (GOX)" },
  { code: "PNQ", label: "Pune Airport (PNQ)" },
  { code: "AMD", label: "Ahmedabad Airport (AMD)" },
  { code: "JAI", label: "Jaipur Airport (JAI)" },
  { code: "LKO", label: "Lucknow Airport (LKO)" },
  { code: "VNS", label: "Varanasi Airport (VNS)" },
  { code: "COK", label: "Kochi Airport (COK)" },
  { code: "SXR", label: "Srinagar Airport (SXR)" },
  { code: "ATQ", label: "Amritsar Airport (ATQ)" },
  { code: "PAT", label: "Patna Airport (PAT)" },
];

export default function CabComparePage() {
  const [pickup, setPickup] = useState("Fetching full current location...");
  const [drop, setDrop] = useState("");
  const [vehicleType, setVehicleType] = useState<"ALL" | "Bike" | "Auto" | "Car">("ALL");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [cabs, setCabs] = useState<CabOption[]>([]);
  const [cheapest, setCheapest] = useState<CheapestSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto full location detection
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            
            // Construct full detailed location address
            let fullAddress = "Current Location";
            if (data?.display_name) {
              const parts = data.display_name.split(",").map((p: string) => p.trim());
              // Format top 3-4 location parts (Area, District, City, State)
              fullAddress = parts.slice(0, 4).join(", ");
            } else if (data?.address) {
              const sub = data.address.suburb || data.address.neighbourhood || data.address.residential || "";
              const city = data.address.city || data.address.town || data.address.state_district || "";
              const state = data.address.state || "";
              fullAddress = [sub, city, state].filter(Boolean).join(", ");
            }

            setPickup(fullAddress || "Current Location");
          } catch {
            setPickup("Current Location");
          }
        },
        () => setPickup("Current Location")
      );
    } else {
      setPickup("Current Location");
    }
  }, []);

  const compareCabs = async () => {
    if (!drop) {
      alert("Please enter or select a drop location");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/cabs?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&vehicleType=${vehicleType}`
      );
      const data = await res.json();
      setCabs(data.cabs || []);
      setCheapest(data.cheapest || null);
      setDistanceKm(data.distanceKm || null);
    } catch (e) {
      console.error("Cab search error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Compare Cab & Ride Fares
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Compare live fare estimates for Uber, Ola, and Rapido before booking.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-8">
        <div className="grid md:grid-cols-4 gap-3 items-end mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Full Pickup Location</label>
            <input
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-sm font-medium"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup point"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Drop Location / Airport</label>
            <input
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-sm placeholder-gray-500"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              placeholder="Type destination or select airport below"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Vehicle Type</label>
            <select
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-sm cursor-pointer"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
            >
              <option value="ALL">All Options (Bike, Auto, Car)</option>
              <option value="Bike">Bike Only 🏍️</option>
              <option value="Auto">Auto Only 🛺</option>
              <option value="Car">Car / Cab Only 🚗</option>
            </select>
          </div>

          <div>
            <button
              onClick={compareCabs}
              disabled={loading}
              className="w-full h-11 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-lg transition text-sm cursor-pointer disabled:opacity-60"
            >
              {loading ? "Comparing..." : "Compare Fares"}
            </button>
          </div>
        </div>

        {/* Airport Select Dropdown */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Select City Airport:</span>
          <select
            className="h-9 px-3 rounded-md bg-white/10 text-white text-xs border border-white/10 focus:outline-none cursor-pointer max-w-md"
            onChange={(e) => {
              if (e.target.value) setDrop(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled className="bg-gray-900 text-gray-400">Choose airport destination...</option>
            {CITY_AIRPORTS.map((ap) => (
              <option key={ap.code} value={ap.label} className="bg-gray-900 text-white">
                {ap.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Box */}
      {cheapest && hasSearched && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-white mb-2">Cheapest Fare Breakdown ({distanceKm} km ride):</h3>
          <div className="grid sm:grid-cols-3 gap-3 text-xs text-gray-300">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="text-gray-400 block mb-1">🏍️ Bike</span>
              <strong className="text-emerald-400">{cheapest.bike || "N/A"}</strong>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="text-gray-400 block mb-1">🛺 Auto</span>
              <strong className="text-emerald-400">{cheapest.auto || "N/A"}</strong>
            </div>

            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="text-gray-400 block mb-1">🚗 Car / Cab</span>
              <strong className="text-emerald-400">{cheapest.car || "N/A"}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Ride Results Grid */}
      {hasSearched && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cabs.map((cab) => (
            <div
              key={cab.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between hover:border-white/20 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{cab.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{cab.type}</h3>
                      <p className="text-xs text-gray-400">{cab.provider} • {cab.category}</p>
                    </div>
                  </div>

                  {cab.isLowestInCategory && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      Lowest {cab.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg my-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Estimated Fare</span>
                    <span className="text-xl font-bold text-white">₹{cab.priceInr}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-400 block text-[11px]">Pickup ETA</span>
                    <span className="text-sm font-semibold text-sky-400">{cab.etaMins} mins</span>
                  </div>
                </div>
              </div>

              <a
                href={cab.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs text-center transition cursor-pointer block"
              >
                Book on {cab.provider} App ↗
              </a>
            </div>
          ))}

          {cabs.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              No rides available for the selected vehicle type.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
