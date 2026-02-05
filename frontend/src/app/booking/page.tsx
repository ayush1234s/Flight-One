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

  /* ================= SEARCH ================= */
  const searchFlights = async () => {
    if (!date) {
      alert("Please select travel date");
      return;
    }

    const res = await fetch(
      `/api/amadeus?from=${from}&to=${to}&date=${date}&adults=${adults}`
    );
    const data = await res.json();

    setFlights(data.data || []);
    setCompareAll(false);
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
    <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-[1fr_520px] gap-10">

      {/* ================= LEFT SIDE ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Flight Booking & Comparison
        </h1>

        {/* SEARCH */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <select className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/40 appearance-none"
                                     value={from} onChange={(e) => setFrom(e.target.value)}>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code} className="bg-slate-900 text-white">
                {a.code} - {a.name}
              </option>
            ))}
          </select>

          <select className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/40 appearance-none" value={to} onChange={(e) => setTo(e.target.value)}>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} - {a.name}
              </option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            className="input"
            type="number"
            min={1}
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />

          <button
            onClick={searchFlights}
            className="bg-sky-500 text-black font-semibold rounded-lg"
          >
            Search
          </button>
        </div>

        {/* FLIGHTS LIST */}
        <div className="space-y-6">
          {flights.map((flight, i) => {
            const airline = flight.itineraries[0].segments[0].carrierCode;

            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold">
                    Airline: {airline}
                  </h2>
                  <span className="font-bold text-sky-400">
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
                  className="mt-4 bg-white/10 px-4 py-2 rounded-lg"
                >
                  Book
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="sticky top-28 space-y-4">

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/40 appearance-none"
        >
          <option value="price">Lowest Price</option>
          <option value="duration">Fastest Flight</option>
          <option value="rating">Highest Rating</option>
          <option value="ontime">Best On-Time</option>
        </select>

        {/* COMPARE BUTTON */}
        <button
          disabled={flights.length === 0 || loading}
          onClick={() => {
            if (!user) {
              alert("Please login to compare flights");
              router.push("/login");
              return;
            }
            setCompareAll(true);
          }}
          className="w-full bg-sky-500 text-black py-3 rounded-lg font-semibold disabled:opacity-40"
        >
          Compare All Flights
        </button>

        {/* NOT LOGGED IN MESSAGE */}
        {!user && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-400 text-sm">
            Login required to compare flights.
          </div>
        )}

        {/* COMPARISON TABLE */}
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
                    <td className="p-3 font-semibold">
                      #{i + 1}
                    </td>
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
                        className="bg-white/10 px-3 py-1 rounded-md"
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
  );
}
