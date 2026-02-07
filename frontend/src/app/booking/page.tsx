"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContent";

type Offer = {
  id: string;
  priceInr: number;
  currency: string;
  airline: string;   // carrier code
  flight: string;    // e.g. AI805
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

// Airline redirect + logo domains
const AIRLINE_META: Record<string, { url: string; domain: string }> = {
  AI: { url: "https://www.airindia.com/", domain: "airindia.com" },
  "6E": { url: "https://www.goindigo.in/", domain: "goindigo.in" },
  SG: { url: "https://www.spicejet.com/", domain: "spicejet.com" },
  UK: { url: "https://www.airvistara.com/", domain: "airvistara.com" },
  EK: { url: "https://www.emirates.com/", domain: "emirates.com" },
  QR: { url: "https://www.qatarairways.com/", domain: "qatarairways.com" },
  EY: { url: "https://www.etihad.com/", domain: "etihad.com" },
  LH: { url: "https://www.lufthansa.com/", domain: "lufthansa.com" },
  AF: { url: "https://www.airfrance.com/", domain: "airfrance.com" },
  BA: { url: "https://www.britishairways.com/", domain: "britishairways.com" },
};

const getCarrier = (flight: string) => flight?.slice(0, 2);
const getLogo = (flight: string) => {
  const c = getCarrier(flight);
  const domain = AIRLINE_META[c]?.domain;
  return domain ? `https://logo.clearbit.com/${domain}` : "/airplane.png";
};
const getBookingUrl = (flight: string, from: string, to: string, date: string) => {
  const c = getCarrier(flight);
  return (
    AIRLINE_META[c]?.url ||
    `https://www.aviasales.com/search/${from}${date.replaceAll("-", "")}${to}1`
  );
};

export default function BookingPage() {
  const { user } = useAuth(); // 🔥 auth check added

  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [cabin, setCabin] = useState("ECONOMY");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!user) return; // 🔒 block if not logged in
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-4">Search Flights & Compare (INR)</h1>

      {!user && (
        <div className="mb-4 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
          Please login to search and compare flights.
        </div>
      )}

      {/* Search Bar */}
      <div className="grid md:grid-cols-5 gap-3 mb-6 items-center">
        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={from} onChange={(e) => setFrom(e.target.value)} disabled={!user}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code} className="bg-white text-black">{a.label}</option>
          ))}
        </select>

        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={to} onChange={(e) => setTo(e.target.value)} disabled={!user}>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code} className="bg-white text-black">{a.label}</option>
          ))}
        </select>

        <input type="date"
          className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={date} onChange={(e) => setDate(e.target.value)} disabled={!user} />

        <select className="h-11 px-3 rounded-md bg-white text-black border border-gray-300 focus:ring-2 focus:ring-sky-400"
          value={cabin} onChange={(e) => setCabin(e.target.value)} disabled={!user}>
          <option value="ECONOMY" className="bg-white text-black">Economy</option>
          <option value="PREMIUM_ECONOMY" className="bg-white text-black">Premium Economy</option>
          <option value="BUSINESS" className="bg-white text-black">Business</option>
          <option value="FIRST" className="bg-white text-black">First Class</option>
        </select>

        <button
          onClick={search}
          disabled={!user || loading}
          className={`h-11 px-4 rounded-md border transition ${
            !user
              ? "border-white/10 text-gray-500 cursor-not-allowed"
              : "border-white/10 hover:border-sky-400/40 hover:text-sky-400"
          }`}
        >
          {loading ? "Searching..." : user ? "Search" : "Login to Search"}
        </button>
      </div>

      {/* Top Picks */}
      {top.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Top Picks</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {top.map((o, i) => (
              <div key={`${o.id}-${o.flight}-${o.dep}-${i}`}
                className={`rounded-xl p-4 border ${
                  i === 0 ? "border-green-400 bg-green-400/10" :
                  i === 1 ? "border-yellow-400 bg-yellow-400/10" :
                            "border-sky-400 bg-sky-400/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={getLogo(o.flight)}
                    alt={o.airline}
                    className="h-6 w-6 rounded-sm bg-white p-0.5"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/airplane.png")}
                  />
                  <h3 className="font-semibold">{o.flight}</h3>
                  <span className="ml-auto text-xs">
                    {i === 0 ? "BEST" : i === 1 ? "BETTER" : "AVERAGE"}
                  </span>
                </div>
                <p className="text-xs text-gray-300">{from} → {to}</p>
                <p className="text-xs text-gray-300">Cabin: {o.cabin} • Class: {o.fareClass}</p>
                <p className="mt-2 text-lg font-bold">₹ {o.priceInr.toLocaleString("en-IN")}</p>

                <button
                  onClick={() => window.open(getBookingUrl(o.flight, from, to, date), "_blank")}
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
          <div key={`${o.id}-${o.flight}-${o.dep}-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 mb-1">
              <img
                src={getLogo(o.flight)}
                alt={o.airline}
                className="h-6 w-6 rounded-sm bg-white p-0.5"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/airplane.png")}
              />
              <h3 className="font-semibold">{o.flight}</h3>
            </div>
            <p className="text-xs text-gray-400">{from} → {to}</p>
            <p className="text-xs text-gray-400">
              {new Date(o.dep).toLocaleTimeString()} → {new Date(o.arr).toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-400">Cabin: {o.cabin} • Class: {o.fareClass}</p>
            <p className="mt-2 font-bold">₹ {o.priceInr.toLocaleString("en-IN")}</p>

            <button
              onClick={() => window.open(getBookingUrl(o.flight, from, to, date), "_blank")}
              className="mt-3 w-full px-3 py-2 rounded-md border border-white/10 hover:border-sky-400/40"
            >
              Book on Airline Website
            </button>
          </div>
        ))}
      </div>

      {!loading && offers.length === 0 && user && (
        <p className="text-gray-400 mt-6">No results. Try different route/date/class.</p>
      )}
    </div>
  );
}
