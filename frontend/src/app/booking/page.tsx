"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContent";

const AIRPORTS = [
  { code: "DEL", name: "Delhi" },
  { code: "BOM", name: "Mumbai" },
  { code: "BLR", name: "Bangalore" },
  { code: "HYD", name: "Hyderabad" },
  { code: "MAA", name: "Chennai" },
  { code: "CCU", name: "Kolkata" },
  { code: "PNQ", name: "Pune" },
  { code: "AMD", name: "Ahmedabad" },
  { code: "JAI", name: "Jaipur" },
  { code: "LKO", name: "Lucknow" },
];

type FilterType = "price" | "duration" | "rating" | "ontime";

type ToastType = "success" | "error" | "info";

export default function BookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState("1");

  const [flights, setFlights] = useState<any[]>([]);
  const [compareAll, setCompareAll] = useState(false);
  const [filter, setFilter] = useState<FilterType>("price");
  const [searching, setSearching] = useState(false);

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

  /* ================= SEARCH ================= */
  const searchFlights = async () => {
    if (!date) {
      showToast("Please select travel date", "error");
      return;
    }

    try {
      setSearching(true);

      const res = await fetch(
        `/api/amadeus?from=${from}&to=${to}&date=${date}&adults=${adults}`
      );
      const data = await res.json();

      setFlights(data.data || []);
      setCompareAll(false);

      if (!data.data?.length) {
        showToast("No flights found for selected route/date", "info");
      } else {
        showToast("Flights fetched successfully", "success");
      }
    } catch {
      showToast("Failed to fetch flights", "error");
    } finally {
      setSearching(false);
    }
  };

  /* ================= ENRICH ================= */
  const enrich = (flight: any) => {
    const seg = flight.itineraries[0].segments;
    return {
      airline: seg[0].carrierCode,
      price: Number(flight.price.total),
      duration: seg.length * 60,
      stops: seg.length - 1,
      onTime: 85 + Math.floor(Math.random() * 10),
      rating: Number((3.8 + Math.random()).toFixed(1)),
      site: getAirlineSite(seg[0].carrierCode),
    };
  };

  /* ================= SORT ================= */
  const comparedFlights = flights
    .map(enrich)
    .sort((a, b) => {
      switch (filter) {
        case "price":
          return a.price - b.price;
        case "duration":
          return a.duration - b.duration;
        case "rating":
          return b.rating - a.rating;
        case "ontime":
          return b.onTime - a.onTime;
        default:
          return 0;
      }
    })
    .slice(0, 4);

  /* ================= AIRLINE SITES ================= */
  function getAirlineSite(code: string) {
    const map: any = {
      AI: "https://www.airindia.com",
      "6E": "https://www.goindigo.in",
      UK: "https://www.airvistara.com",
      SG: "https://www.spicejet.com",
      IX: "https://www.airindiaexpress.com",
      QP: "https://www.akasaair.com",
    };
    return map[code] || "https://www.google.com/search?q=airline+booking";
  }

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

      {/* progress line */}
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


      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-[1fr_420px] gap-12">

        {/* ================= LEFT ================= */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Flight Booking & Comparison
          </h1>
          <p className="text-gray-400 mb-8">
            Find the best flights and compare prices in real-time
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 grid md:grid-cols-5 gap-4 mb-10">
            <select
              className="w-full rounded-lg bg-slate-900 text-white border border-white/10 px-4 py-3 focus:ring-2 focus:ring-sky-400/40 outline-none"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>

            <select
              className="w-full rounded-lg bg-slate-900 text-white border border-white/10 px-4 py-3 focus:ring-2 focus:ring-sky-400/40 outline-none"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded-lg bg-slate-900 text-white border border-white/10 px-4 py-3 focus:ring-2 focus:ring-sky-400/40 outline-none"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              className="w-full rounded-lg bg-slate-900 text-white border border-white/10 px-4 py-3 focus:ring-2 focus:ring-sky-400/40 outline-none"
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />

            <button
              onClick={searchFlights}
              disabled={searching}
              className="bg-sky-500 text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {searching ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* FLIGHTS */}
          <div className="space-y-5">
            {flights.map((flight, i) => {
              const airline = flight.itineraries[0].segments[0].carrierCode;

              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-sky-400/40 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">
                      {airline}
                    </h2>
                    <span className="font-bold text-sky-400 text-lg">
                      ₹{flight.price.total}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm">
                    {from} → {to}
                  </p>

                  <button
                    onClick={() =>
                      window.open(getAirlineSite(airline), "_blank")
                    }
                    className="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Book on Airline Site
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="sticky top-28 space-y-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:ring-2 focus:ring-sky-400/40 outline-none"
          >
            <option value="price">Lowest Price</option>
            <option value="duration">Fastest Flight</option>
            <option value="rating">Highest Rating</option>
            <option value="ontime">Best On-Time</option>
          </select>

          <button
            disabled={flights.length === 0 || loading}
            onClick={() => {
              if (!user) {
                showToast("Please login to compare flights", "error");
                router.push("/login");
                return;
              }
              setCompareAll(true);
              showToast("Flights compared successfully", "success");
            }}
            className="w-full bg-sky-500 text-black py-3 rounded-lg font-semibold hover:bg-sky-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare All Flights
          </button>

          {!user && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-gray-400 text-sm">
              Login required to compare flights.
            </div>
          )}

          {compareAll && user && (
            <div className="overflow-x-auto border border-white/10 rounded-xl bg-white/5">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-3 text-left">Rank</th>
                    <th className="p-3 text-left">Airline</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Rating</th>
                    <th className="p-3 text-left">On-Time</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {comparedFlights.map((f, i) => (
                    <tr
                      key={i}
                      className={`border-t border-white/10 ${
                        i === 0 ? "bg-green-500/10" : ""
                      }`}
                    >
                      <td className="p-3 font-semibold">#{i + 1}</td>
                      <td className="p-3">
                        {f.airline}
                        {i === 0 && (
                          <span className="ml-2 text-green-400 text-xs">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="p-3">₹{f.price}</td>
                      <td className="p-3">{f.duration} min</td>
                      <td className="p-3">⭐ {f.rating}</td>
                      <td className="p-3">{f.onTime}%</td>
                      <td className="p-3">
                        <button
                          onClick={() => window.open(f.site, "_blank")}
                          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

  @keyframes toast-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(120%);
      opacity: 0;
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
