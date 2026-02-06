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

type ToastType = "success" | "error" | "info";

export default function CabComparePage() {
  const [pickup, setPickup] = useState("Fetching location...");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  // 🔔 Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    show: boolean;
  }>({ message: "", type: "info", show: false });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3500);
  };

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
      showToast("Enter drop location", "error"); // ❌ alert removed
      return;
    }

    setLoading(true);

    const km = Math.floor(Math.random() * 25) + 5;
    const demand = Math.random() * 0.4 + 1;

    const calculated = CABS.map((cab) => {
      const fare = Math.round((cab.base + km * cab.perKm) * demand);
      const eta = Math.round((km / cab.speed) * 60);
      return { ...cab, fare, eta };
    }).sort((a, b) => a.fare - b.fare);

    setTimeout(() => {
      setDistance(km);
      setResults(calculated);
      setLoading(false);
      showToast("Best cab options calculated", "success");
    }, 900);
  };

  return (
    <>
      {/* 🔔 TOAST */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-toast-in">
          <div
            className={`relative min-w-[280px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur bg-slate-900/90
            ${
              toast.type === "success"
                ? "border-green-500/40 text-green-300"
                : toast.type === "error"
                ? "border-red-500/40 text-red-300"
                : "border-sky-500/40 text-sky-300"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10 overflow-hidden rounded-b-xl">
              <div
                className={`h-full ${
                  toast.type === "success"
                    ? "bg-green-400"
                    : toast.type === "error"
                    ? "bg-red-400"
                    : "bg-sky-400"
                } animate-toast-progress`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-2">Cab Comparison</h1>
        <p className="text-gray-400 mb-8">
          Compare nearby cab services based on your location.
        </p>

        {/* INPUTS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 grid md:grid-cols-2 gap-4 mb-6">
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
          disabled={loading}
          className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold flex items-center gap-2 hover:bg-sky-400 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
              Comparing...
            </>
          ) : (
            "Compare Cabs"
          )}
        </button>

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
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition"
                >
                  <h2 className="text-lg font-semibold mb-1">
                    {cab.icon} {cab.provider} {cab.type}
                  </h2>

                  <p className="text-gray-300">Fare: ₹{cab.fare}</p>
                  <p className="text-gray-300">ETA: {cab.eta} mins</p>

                  <button
                    onClick={() => setPopup(cab.provider)}
                    className="mt-3 w-full bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
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
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 text-center max-w-sm w-full">
              <h2 className="text-xl font-bold mb-3">Redirect Notice</h2>

              <p className="text-gray-400 mb-6">
                This will open in{" "}
                <span className="text-white font-semibold">{popup}</span> App only.
              </p>

              <button
                onClick={() => setPopup(null)}
                className="bg-sky-500 px-6 py-2 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Animations */}
      <style jsx global>{`
        @keyframes toast-in {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toast-in 0.4s ease-out;
        }

        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-toast-progress {
          animation: toast-progress 3.5s linear forwards;
        }
      `}</style>
    </>
  );
}
