"use client";

import { useEffect, useState } from "react";

type Cab = {
  provider: string;
  type: string;
  base: number;
  perKm: number;
  speed: number;
  icon: string;
};

const CABS: Cab[] = [
  { provider: "Uber", type: "Go", base: 50, perKm: 14, speed: 35, icon: "🚗" },
  { provider: "Uber", type: "Premier", base: 80, perKm: 18, speed: 40, icon: "🚘" },
  { provider: "Uber", type: "XL", base: 100, perKm: 22, speed: 38, icon: "🚙" },
  { provider: "Uber", type: "Auto", base: 30, perKm: 10, speed: 30, icon: "🛺" },
  { provider: "Uber", type: "Moto", base: 20, perKm: 8, speed: 45, icon: "🏍️" },

  { provider: "Ola", type: "Mini", base: 45, perKm: 13, speed: 34, icon: "🚕" },
  { provider: "Ola", type: "Prime", base: 75, perKm: 17, speed: 38, icon: "🚖" },
  { provider: "Ola", type: "Prime SUV", base: 110, perKm: 23, speed: 36, icon: "🚐" },
  { provider: "Ola", type: "Auto", base: 28, perKm: 9, speed: 30, icon: "🛺" },
  { provider: "Ola", type: "Bike", base: 18, perKm: 7, speed: 45, icon: "🏍️" },

  { provider: "Rapido", type: "Bike", base: 15, perKm: 6, speed: 48, icon: "🏍️" },
  { provider: "Rapido", type: "Auto", base: 25, perKm: 9, speed: 32, icon: "🛺" },
  { provider: "Rapido", type: "Cab", base: 40, perKm: 12, speed: 34, icon: "🚗" },
  { provider: "Rapido", type: "Premium Bike", base: 22, perKm: 8, speed: 50, icon: "🏍️" },
  { provider: "Rapido", type: "Rental", base: 60, perKm: 11, speed: 30, icon: "🚘" },
];

export default function CabComparePage() {
  const [pickup, setPickup] = useState("Fetching location...");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState<string | null>(null);

  // 🔥 AUTO LOCATION FETCH
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();

          setPickup(
            data.address.suburb ||
              data.address.city ||
              data.address.town ||
              "Current Location"
          );
        } catch {
          setPickup("Current Location");
        }
      },
      () => setPickup("Location permission denied")
    );
  }, []);

  const compareCabs = () => {
    if (!drop) {
      alert("Enter drop location");
      return;
    }

    setLoading(true);

    const km = Math.floor(Math.random() * 25) + 5;
    const demand = Math.random() * 0.4 + 1;

    const calculated = CABS.map((cab) => {
      const fare = Math.round(
        (cab.base + km * cab.perKm) * demand
      );
      const eta = Math.round((km / cab.speed) * 60);

      return { ...cab, fare, eta };
    }).sort((a, b) => a.fare - b.fare);

    setTimeout(() => {
      setDistance(km);
      setResults(calculated);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-2">
        Cab Comparison
      </h1>

      <p className="text-gray-400 mb-8">
        Compare nearby cab services based on your location.
      </p>

      {/* INPUTS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input className="input" value={pickup} disabled />
        <input
          className="input"
          placeholder="Drop location (Airport / Area)"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
        />
      </div>

      <button
        onClick={compareCabs}
        className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold"
      >
        Compare Cabs
      </button>

      {loading && (
        <p className="mt-6 text-gray-400">
          Calculating best cab options...
        </p>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <>
          <p className="mt-6 text-gray-400">
            Estimated distance:{" "}
            <span className="text-white">{distance} km</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {results.map((cab, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold mb-1">
                  {cab.icon} {cab.provider} {cab.type}
                </h2>

                <p className="text-gray-300">
                  Fare: ₹{cab.fare}
                </p>

                <p className="text-gray-300">
                  ETA: {cab.eta} mins
                </p>

                <button
                  onClick={() => setPopup(cab.provider)}
                  className="mt-3 w-full bg-white/10 py-2 rounded-lg hover:bg-white/20"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-8">
            * Prices are approximate. Final fare will be shown in partner app.
          </p>
        </>
      )}

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-8 text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3">
              Redirect Notice
            </h2>

            <p className="text-gray-400 mb-6">
              This will open in{" "}
              <span className="text-white font-semibold">
                {popup}
              </span>{" "}
              App only.
            </p>

            <button
              onClick={() => setPopup(null)}
              className="bg-sky-500 px-6 py-2 rounded-lg text-black font-semibold"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
