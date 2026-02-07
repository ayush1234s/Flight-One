"use client";

import { useMemo, useState } from "react";

type Offer = {
  id: string;
  priceInr: number;
  currency: string;
  airline: string;   // carrier code (AI, 6E, SG...)
  flight: string;    // e.g., AI805
  from: string;
  to: string;
  dep: string;
  arr: string;
  duration: string;
  cabin: string;
  fareClass: string;
};

const AIRPORTS = [
  { code: "DEL", label: "Delhi, India (DEL)" },
  { code: "BOM", label: "Mumbai, Maharashtra (BOM)" },
  { code: "BLR", label: "Bengaluru, Karnataka (BLR)" },
  { code: "HYD", label: "Hyderabad, Telangana (HYD)" },
  { code: "CCU", label: "Kolkata, West Bengal (CCU)" },
  { code: "MAA", label: "Chennai, Tamil Nadu (MAA)" },
  { code: "PNQ", label: "Pune, Maharashtra (PNQ)" },
  { code: "GOI", label: "Goa (GOI)" },
  { code: "AMD", label: "Ahmedabad, Gujarat (AMD)" },
  { code: "JAI", label: "Jaipur, Rajasthan (JAI)" },
];

// Airline redirect map
const AIRLINE_BOOK_URL: Record<string, string> = {
  AI: "https://www.airindia.com/",
  "6E": "https://www.goindigo.in/",
  SG: "https://www.spicejet.com/",
  UK: "https://www.airvistara.com/",
  EK: "https://www.emirates.com/",
  QR: "https://www.qatarairways.com/",
  EY: "https://www.etihad.com/",
  LH: "https://www.lufthansa.com/",
  AF: "https://www.airfrance.com/",
  BA: "https://www.britishairways.com/",
};

export default function BookingPage() {
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [cabin, setCabin] = useState("ECONOMY");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!date) return alert("Select date first");
    setLoading(true);
    const res = await fetch(
      `/api/search-flights?from=${from}&to=${to}&date=${date}&adults=1&cabin=${cabin}`
    );
    const data = await res.json();
    setOffers(data.offers || []);
    setLoading(false);
  };

  const sorted = useMemo(() => [...offers].sort((a, b) => a.priceInr - b.priceInr), [offers]);
  const best = sorted[0];
  const better = sorted[1];
  const avg = sorted[Math.floor(sorted.length / 2)];
  const top = [best, better, avg].filter(Boolean);
  const rest = sorted.filter((o) => !top.find((t) => t?.id === o.id));

  const bookOnAirline = (o: Offer) => {
    const carrier = o.flight?.slice(0, 2); // AI, 6E, SG...
    const url =
      AIRLINE_BOOK_URL[carrier] ||
      `https://www.aviasales.com/search/${from}${date.replaceAll("-", "")}${to}1`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Search Flights & Compare (INR)</h1>

      {/* Search Bar */}
      <div className="grid md:grid-cols-5 gap-3 mb-6 items-center">
        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={from} onChange={(e) => setFrom(e.target.value)}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code} className="bg-white text-black">
              {a.label}
            </option>
          ))}
        </select>

        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={to} onChange={(e) => setTo(e.target.value)}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code} className="bg-white text-black">
              {a.label}
            </option>
          ))}
        </select>

        <input type="date"
          className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={date} onChange={(e) => setDate(e.target.value)} />

        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={cabin} onChange={(e) => setCabin(e.target.value)}>
          <option value="ECONOMY" className="bg-white text-black">Economy</option>
          <option value="PREMIUM_ECONOMY" className="bg-white text-black">Premium Economy</option>
          <option value="BUSINESS" className="bg-white text-black">Business</option>
          <option value="FIRST" className="bg-white text-black">First Class</option>
        </select>

        <button onClick={search}
          className="h-11 px-4 rounded-md border border-white/10 hover:border-sky-400/40 hover:text-sky-400 transition">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Top Picks */}
      {top.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Top Picks</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {top.map((o, i) => (
              <div
                key={`${o.id}-${o.flight}-${o.dep}-${i}`}
                className={`rounded-xl p-4 border ${
                  i === 0 ? "border-green-400 bg-green-400/10" :
                  i === 1 ? "border-yellow-400 bg-yellow-400/10" :
                            "border-sky-400 bg-sky-400/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{o.flight}</h3>
                  <span className="text-xs">
                    {i === 0 ? "BEST" : i === 1 ? "BETTER" : "AVERAGE"}
                  </span>
                </div>
                <p className="text-xs text-gray-300">{from} → {to}</p>
                <p className="text-xs text-gray-300">Cabin: {o.cabin} • Class: {o.fareClass}</p>
                <p className="mt-2 text-lg font-bold">₹ {o.priceInr.toLocaleString("en-IN")}</p>

                {/* Redirect Button */}
                <button
                  onClick={() => bookOnAirline(o)}
                  className="mt-3 w-full px-3 py-2 rounded-md border border-white/10 hover:border-sky-400/40"
                >
                  Book on Airline Website
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* All Flights */}
      <h2 className="text-xl font-semibold mb-3">All Flights</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((o, i) => (
          <div
            key={`${o.id}-${o.flight}-${o.dep}-${i}`}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <h3 className="font-semibold">{o.flight}</h3>
            <p className="text-xs text-gray-400">{from} → {to}</p>
            <p className="text-xs text-gray-400">
              {new Date(o.dep).toLocaleTimeString()} → {new Date(o.arr).toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-400">Cabin: {o.cabin} • Class: {o.fareClass}</p>
            <p className="mt-2 font-bold">₹ {o.priceInr.toLocaleString("en-IN")}</p>

            {/* Redirect Button */}
            <button
              onClick={() => bookOnAirline(o)}
              className="mt-3 w-full px-3 py-2 rounded-md border border-white/10 hover:border-sky-400/40"
            >
              Book on Airline Website
            </button>
          </div>
        ))}
      </div>

      {!loading && offers.length === 0 && (
        <p className="text-gray-400 mt-6">No results. Try different route/date/class.</p>
      )}
    </div>
  );
}
