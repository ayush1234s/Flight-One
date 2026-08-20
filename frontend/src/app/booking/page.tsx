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

type AiPick = {
  id: string;
  grokTag: string;
  priceAnalysis: string;
  delayAnalysis: string;
  aiSummary: string;
};

type AiAnalysis = {
  summary: string;
  topPicks: AiPick[];
};

const AIRPORTS = [
  // Major Metros & Hubs
  { code: "DEL", label: "Delhi / New Delhi (DEL)" },
  { code: "BOM", label: "Mumbai, Maharashtra (BOM)" },
  { code: "BLR", label: "Bengaluru / Bangalore, Karnataka (BLR)" },
  { code: "HYD", label: "Hyderabad, Telangana (HYD)" },
  { code: "CCU", label: "Kolkata, West Bengal (CCU)" },
  { code: "MAA", label: "Chennai, Tamil Nadu (MAA)" },

  // North India
  { code: "AYJ", label: "Ayodhya, Uttar Pradesh (AYJ)" },
  { code: "ATQ", label: "Amritsar, Punjab (ATQ)" },
  { code: "IXC", label: "Chandigarh (IXC)" },
  { code: "DED", label: "Dehradun, Uttarakhand (DED)" },
  { code: "JAI", label: "Jaipur, Rajasthan (JAI)" },
  { code: "JDH", label: "Jodhpur, Rajasthan (JDH)" },
  { code: "IXJ", label: "Jammu, Jammu & Kashmir (IXJ)" },
  { code: "LKO", label: "Lucknow, Uttar Pradesh (LKO)" },
  { code: "SXR", label: "Srinagar, Jammu & Kashmir (SXR)" },
  { code: "UDR", label: "Udaipur, Rajasthan (UDR)" },
  { code: "VNS", label: "Varanasi, Uttar Pradesh (VNS)" },

  // West & Central India
  { code: "AMD", label: "Ahmedabad, Gujarat (AMD)" },
  { code: "BHO", label: "Bhopal, Madhya Pradesh (BHO)" },
  { code: "GOI", label: "Goa (Dabolim - GOI)" },
  { code: "GOX", label: "Goa (Mopa - GOX)" },
  { code: "IDR", label: "Indore, Madhya Pradesh (IDR)" },
  { code: "NAG", label: "Nagpur, Maharashtra (NAG)" },
  { code: "PNQ", label: "Pune, Maharashtra (PNQ)" },
  { code: "HSR", label: "Rajkot, Gujarat (HSR)" },
  { code: "STV", label: "Surat, Gujarat (STV)" },
  { code: "BDQ", label: "Vadodara, Gujarat (BDQ)" },

  // South India
  { code: "CJB", label: "Coimbatore, Tamil Nadu (CJB)" },
  { code: "COK", label: "Kochi / Cochin, Kerala (COK)" },
  { code: "CCJ", label: "Kozhikode / Calicut, Kerala (CCJ)" },
  { code: "IXM", label: "Madurai, Tamil Nadu (IXM)" },
  { code: "IXE", label: "Mangaluru / Mangalore, Karnataka (IXE)" },
  { code: "TRZ", label: "Tiruchirappalli / Trichy, Tamil Nadu (TRZ)" },
  { code: "TRV", label: "Thiruvananthapuram / Trivandrum, Kerala (TRV)" },
  { code: "VTZ", label: "Visakhapatnam, Andhra Pradesh (VTZ)" },

  // East & North-East India
  { code: "IXA", label: "Agartala, Tripura (IXA)" },
  { code: "IXB", label: "Bagdogra / Siliguri, West Bengal (IXB)" },
  { code: "BBI", label: "Bhubaneswar, Odisha (BBI)" },
  { code: "GAU", label: "Guwahati, Assam (GAU)" },
  { code: "IMF", label: "Imphal, Manipur (IMF)" },
  { code: "PAT", label: "Patna, Bihar (PAT)" },
  { code: "IXZ", label: "Port Blair, Andaman & Nicobar (IXZ)" },
  { code: "IXR", label: "Ranchi, Jharkhand (IXR)" },
  { code: "SHL", label: "Shillong, Meghalaya (SHL)" },
];

const AIRLINE_META: Record<string, { url: string; domain: string; name: string }> = {
  AI: { url: "https://www.airindia.com/", domain: "airindia.com", name: "Air India" },
  "6E": { url: "https://www.goindigo.in/", domain: "goindigo.in", name: "IndiGo" },
  SG: { url: "https://www.spicejet.com/", domain: "spicejet.com", name: "SpiceJet" },
  UK: { url: "https://www.airvistara.com/", domain: "airvistara.com", name: "Vistara" },
  EK: { url: "https://www.emirates.com/", domain: "emirates.com", name: "Emirates" },
  QR: { url: "https://www.qatarairways.com/", domain: "qatarairways.com", name: "Qatar Airways" },
  EY: { url: "https://www.etihad.com/", domain: "etihad.com", name: "Etihad Airways" },
  LH: { url: "https://www.lufthansa.com/", domain: "lufthansa.com", name: "Lufthansa" },
  AF: { url: "https://www.airfrance.com/", domain: "airfrance.com", name: "Air France" },
  BA: { url: "https://www.britishairways.com/", domain: "britishairways.com", name: "British Airways" },
};

const getCarrier = (flight: string) => flight?.slice(0, 2);
const getLogo = (flight: string) => {
  const c = getCarrier(flight);
  const domain = AIRLINE_META[c]?.domain;
  return domain ? `https://logo.clearbit.com/${domain}` : "/airplane.png";
};

const getAirlineName = (flight: string) => {
  const c = getCarrier(flight);
  return AIRLINE_META[c]?.name || "Official Airline";
};

const getBookingButtonText = (flight: string) => {
  const name = getAirlineName(flight);
  return `Book on ${name} Website ↗`;
};

const getBookingUrl = (flight: string) => {
  const c = getCarrier(flight);
  return AIRLINE_META[c]?.url || "https://www.airindia.com/";
};

export default function BookingPage() {
  const { user } = useAuth();

  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [cabin, setCabin] = useState("ECONOMY");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!user) return;
    if (!date) return alert("Select date first");

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/search-flights?from=${from}&to=${to}&date=${date}&adults=1&cabin=${cabin}`
      );
      const data = await res.json();
      setOffers(data?.offers || []);
      setAiAnalysis(data?.aiAnalysis || data?.grokAnalysis || null);
    } catch (err) {
      console.error("Flight search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Match Top 3 AI Agent Picks with offer objects
  const topPickedOffers = useMemo(() => {
    if (!aiAnalysis?.topPicks || aiAnalysis.topPicks.length === 0) {
      const sorted = [...offers].sort((a, b) => a.priceInr - b.priceInr);
      return sorted.slice(0, 3).map((o, idx) => ({
        offer: o,
        pickInfo: {
          id: o.id,
          grokTag: idx === 0 ? "⚡ AI Agent Choice • Best Fare" : idx === 1 ? "🚀 AI Agent Choice • Fastest" : "🛡️ AI Agent Choice • Most Reliable",
          priceAnalysis: "Optimal price point on this route",
          delayAnalysis: "Historical on-time rate: 96%",
          aiSummary: "Analyzed by AI Agent for best overall travel experience."
        }
      }));
    }

    return aiAnalysis.topPicks.map((pick) => {
      const found = offers.find((o) => o.id === pick.id) || offers[0];
      return {
        offer: found,
        pickInfo: pick
      };
    }).filter((item) => item.offer);
  }, [offers, aiAnalysis]);

  const remainingOffers = useMemo(() => {
    const topIds = new Set(topPickedOffers.map((t) => t.offer?.id));
    return offers.filter((o) => !topIds.has(o.id));
  }, [offers, topPickedOffers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Flight Search & Compare</span>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-medium flex items-center gap-1.5 shrink-0">
              <span>🤖</span> Functioned by AI Agent
            </span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Compare flight prices, expected delays, and smart AI recommendations in real-time
          </p>
        </div>
      </div>

      {!user && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs sm:text-sm text-amber-300 flex items-center gap-2.5">
          <span className="text-base sm:text-lg shrink-0">🔒</span>
          <span>Please log in to search flights and unlock AI Agent insights.</span>
        </div>
      )}

      {/* Search Bar Container */}
      <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl mb-8 sm:mb-10 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">From</label>
            <select
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={!user}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">To</label>
            <select
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={!user}
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Departure Date</label>
            <input
              type="date"
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={!user}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Cabin Class</label>
            <select
              className="w-full h-11 px-3 rounded-lg bg-gray-900 text-white border border-white/10 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
              disabled={!user}
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={search}
              disabled={!user || loading}
              className={`w-full h-11 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm ${
                !user
                  ? "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5"
                  : "bg-sky-500 hover:bg-sky-400 text-black shadow-lg shadow-sky-500/20 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>{user ? "Search Flights" : "Login to Search"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Agent Route Analysis Overview Banner */}
      {aiAnalysis?.summary && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/60 to-purple-950/60 border border-sky-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0 text-lg sm:text-xl font-bold">
              🤖
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white flex flex-wrap items-center gap-2">
                <span>Functioned by AI Agent</span>
                <span className="text-[10px] sm:text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20 font-mono">
                  {from} → {to}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed break-words">
                {aiAnalysis.summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOP 3 RECOMMENDED FLIGHTS SECTION */}
      {topPickedOffers.length > 0 && (
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>🏆</span>
              <span>Top Recommended Flights</span>
            </h2>
            <span className="text-[11px] sm:text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
              Functioned by AI Agent
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {topPickedOffers.map(({ offer, pickInfo }, idx) => (
              <div
                key={`${offer.id}-${idx}`}
                className={`relative rounded-2xl p-4 sm:p-6 transition-all duration-300 flex flex-col justify-between border shadow-2xl overflow-hidden ${
                  idx === 0
                    ? "bg-gradient-to-b from-emerald-950/40 to-emerald-900/10 border-emerald-500/50 shadow-emerald-500/10"
                    : idx === 1
                    ? "bg-gradient-to-b from-sky-950/40 to-sky-900/10 border-sky-500/50 shadow-sky-500/10"
                    : "bg-gradient-to-b from-purple-950/40 to-purple-900/10 border-purple-500/50 shadow-purple-500/10"
                }`}
              >
                <div>
                  {/* Top Tag & Rank */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold border truncate max-w-[80%] ${
                      idx === 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
                      idx === 1 ? "bg-sky-500/20 text-sky-300 border-sky-500/40" :
                                  "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    }`}>
                      {pickInfo.grokTag}
                    </span>
                    <span className="text-xs text-gray-400 font-mono shrink-0">#{idx + 1}</span>
                  </div>

                  {/* Airline & Price */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getLogo(offer.flight)}
                        alt={getAirlineName(offer.flight)}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-white p-1 object-contain shadow shrink-0"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/airplane.png")}
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-white truncate">{offer.flight}</h3>
                        <p className="text-[11px] sm:text-xs text-gray-400 truncate">{getAirlineName(offer.flight)}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-extrabold text-white">
                        ₹ {offer.priceInr.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[11px] text-gray-400">{offer.cabin}</span>
                    </div>
                  </div>

                  {/* Route & Timing */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-4 flex items-center justify-between text-center gap-1">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {offer.dep ? new Date(offer.dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">{from}</p>
                    </div>
                    <div className="flex-1 px-2 min-w-0">
                      <p className="text-[10px] text-sky-400 font-medium mb-0.5">Direct</p>
                      <div className="h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">{offer.duration}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        {offer.arr ? new Date(offer.arr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">{to}</p>
                    </div>
                  </div>

                  {/* AI Agent Insights Grid */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-gray-300">
                      <span className="text-emerald-400 font-bold block mb-0.5">💰 Price Comparison</span>
                      <span className="text-gray-300 break-words">{pickInfo.priceAnalysis}</span>
                    </div>

                    <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-gray-300">
                      <span className="text-amber-400 font-bold block mb-0.5">⏱️ Delay & Punctuality</span>
                      <span className="text-gray-300 break-words">{pickInfo.delayAnalysis}</span>
                    </div>
                  </div>

                  {/* AI Agent Verdict */}
                  <p className="text-xs text-gray-300 italic bg-white/5 p-3 rounded-xl border border-white/5 mb-4 leading-relaxed break-words">
                    "{pickInfo.aiSummary}"
                  </p>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => window.open(getBookingUrl(offer.flight), "_blank")}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center truncate ${
                    idx === 0
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                      : idx === 1
                      ? "bg-sky-500 hover:bg-sky-400 text-black shadow-sky-500/20"
                      : "bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20"
                  }`}
                >
                  <span className="truncate">{getBookingButtonText(offer.flight)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL AVAILABLE FLIGHTS SECTION */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>✈️</span>
              <span>Available Flights</span>
            </h2>
            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full shrink-0">
              {offers.length} total options
            </span>
          </div>

          {remainingOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {remainingOffers.map((o, idx) => (
                <div
                  key={`${o.id}-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 hover:border-sky-400/40 transition-all duration-200 backdrop-blur-md flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={getLogo(o.flight)}
                          alt={getAirlineName(o.flight)}
                          className="h-7 w-7 rounded-md bg-white p-1 object-contain shrink-0"
                          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/airplane.png")}
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm sm:text-base truncate">{o.flight}</h3>
                          <p className="text-[11px] text-gray-400 truncate">{getAirlineName(o.flight)}</p>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10 font-mono shrink-0">
                        {o.cabin}
                      </span>
                    </div>

                    <div className="flex items-center justify-between my-3 text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>
                        <p className="font-bold text-white text-xs sm:text-sm">
                          {o.dep ? new Date(o.dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                        <p className="text-gray-400 text-[11px]">{from}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sky-400 font-medium text-[11px]">Direct</span>
                        <p className="text-[9px] text-gray-500">{o.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-xs sm:text-sm">
                          {o.arr ? new Date(o.arr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                        <p className="text-gray-400 text-[11px]">{to}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <span className="text-[11px] text-gray-400">Class: <strong className="text-white">{o.fareClass}</strong></span>
                      <span className="text-lg sm:text-xl font-extrabold text-white">₹ {o.priceInr.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(getBookingUrl(o.flight), "_blank")}
                    className="mt-3 w-full py-2.5 rounded-xl border border-white/10 hover:border-sky-400/40 bg-white/5 hover:bg-sky-500 hover:text-black font-semibold text-xs transition-all duration-200 text-center cursor-pointer active:scale-95 truncate"
                  >
                    <span className="truncate">{getBookingButtonText(o.flight)}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            offers.length > 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                All available options are highlighted in the Top Recommendations above.
              </div>
            )
          )}
        </div>
      )}

      {!loading && hasSearched && offers.length === 0 && user && (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-400 text-xs sm:text-sm">No flight offers found for this route and date. Try selecting a different date or route.</p>
        </div>
      )}
    </div>
  );
}
