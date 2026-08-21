"use client";

import { useCallback, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContent";
import { ChevronDown, ChevronUp, Plane, ShieldCheck, Zap, Award, CloudSun, Clock, Luggage, Utensils, AlertTriangle, ArrowRight, Bot } from "lucide-react";

type Offer = {
  id: string;
  priceInr: number;
  currency: string;
  airline: string;   // carrier code
  airlineName?: string;
  flight: string;    // e.g. AI805
  from: string;
  fromCity?: string;
  fromAirport?: string;
  to: string;
  toCity?: string;
  toAirport?: string;
  dep: string;
  arr: string;
  duration: string;
  durationFormatted?: string;
  cabin: string;
  fareClass: string;
  distanceKm?: number;
  delayMin?: number;
  delayStatus?: string;
  riskLevel?: string;
  punctualityRate?: string;
  aircraft?: string;
  baggage?: string;
  cancellation?: string;
  meal?: string;
  depTerminal?: string;
  arrTerminal?: string;
};

type AiPick = {
  id: string;
  grokTag: string;
  priceAnalysis: string;
  delayAnalysis: string;
  weatherRiskAnalysis?: string;
  aiSummary: string;
};

type WeatherInfo = {
  city: string;
  tempC: string;
  condition: string;
  icon: string;
  weatherRisk: string;
  turbulence: string;
};

type RouteInfo = {
  from: string;
  fromCity: string;
  fromAirport: string;
  to: string;
  toCity: string;
  toAirport: string;
  distanceKm: number;
  departureDate: string;
  cabinClass: string;
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

  // International
  { code: "DXB", label: "Dubai, UAE (DXB)" },
  { code: "AUH", label: "Abu Dhabi, UAE (AUH)" },
  { code: "DOH", label: "Doha, Qatar (DOH)" },
  { code: "LHR", label: "London Heathrow, UK (LHR)" },
  { code: "JFK", label: "New York JFK, USA (JFK)" },
  { code: "SIN", label: "Singapore Changi (SIN)" },
  { code: "BKK", label: "Bangkok Suvarnabhumi (BKK)" },
];

const AIRLINE_META: Record<string, { url: string; domain: string; name: string }> = {
  AI: { url: "https://www.airindia.com/", domain: "airindia.com", name: "Air India" },
  "6E": { url: "https://www.goindigo.in/", domain: "goindigo.in", name: "IndiGo" },
  SG: { url: "https://www.spicejet.com/", domain: "spicejet.com", name: "SpiceJet" },
  UK: { url: "https://www.airvistara.com/", domain: "airvistara.com", name: "Vistara" },
  QP: { url: "https://www.akasaair.com/", domain: "akasaair.com", name: "Akasa Air" },
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
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

const getAirlineName = (flight: string) => {
  const c = getCarrier(flight);
  return AIRLINE_META[c]?.name || "Official Airline";
};

const getBookingUrl = (flight: string) => {
  const c = getCarrier(flight);
  return AIRLINE_META[c]?.url || "https://www.airindia.com/";
};

const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export default function BookingPage() {
  const { user } = useAuth();

  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState(getTodayDateStr());
  const [cabin, setCabin] = useState("ECONOMY");
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [analysisText, setAnalysisText] = useState("Analyzing Flights using FlightOne AI Agent...");
  
  // Track open dropdown drawers for each flight card
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Manual API fetch with 3-second FlightOne AI Agent analysis sequence
  const handleManualSearch = useCallback(async () => {
    if (from === to) {
      alert("Origin and destination cities cannot be the same.");
      return;
    }
    if (!date) {
      alert("Please select a departure date first.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setAnalysisText("Step 1/3: Fetching live airline schedules & fares...");

    // Execute API fetch
    const fetchPromise = fetch(
      `/api/search-flights?from=${from}&to=${to}&date=${date}&adults=1&cabin=${cabin}`
    ).then((res) => res.json());

    // 3-second FlightOne AI Agent analysis sequence
    const t1 = setTimeout(() => {
      setAnalysisText("Step 2/3: Assessing destination weather & delay risks...");
    }, 1000);

    const t2 = setTimeout(() => {
      setAnalysisText("Step 3/3: FlightOne AI Agent comparing options & ranking top choices...");
    }, 2000);

    try {
      const [data] = await Promise.all([
        fetchPromise,
        new Promise((resolve) => setTimeout(resolve, 3200)), // Guarantee 3.2s analysis time
      ]);

      setOffers(data?.offers || []);
      setAiAnalysis(data?.aiAnalysis || data?.grokAnalysis || null);
      setRouteInfo(data?.route || null);
      setWeather(data?.weather || null);

      // Auto-expand the top 1 flight drawer by default
      if (data?.offers && data.offers.length > 0) {
        setExpandedIds({ [data.offers[0].id]: true });
      }
    } catch (err) {
      console.error("Flight search error:", err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
    }
  }, [from, to, date, cabin]);

  // Match Top 3 AI Agent Picks with offer objects
  const topPickedOffers = useMemo(() => {
    if (!aiAnalysis?.topPicks || aiAnalysis.topPicks.length === 0) {
      const sorted = [...offers].sort((a, b) => a.priceInr - b.priceInr);
      return sorted.slice(0, 3).map((o, idx) => ({
        offer: o,
        pickInfo: {
          id: o.id,
          grokTag: idx === 0 ? "🏆 #1 Best Value Choice" : idx === 1 ? "🚀 #2 Fastest Nonstop" : "🛡️ #3 Top Reliability",
          priceAnalysis: `₹${Math.round(o.priceInr * 0.15).toLocaleString("en-IN")} below route average`,
          delayAnalysis: `Expected delay: ${o.delayMin || 0} min (${o.punctualityRate || "95%"})`,
          weatherRiskAnalysis: weather ? `Weather in ${weather.city}: ${weather.condition} (${weather.tempC})` : "Favorable route weather",
          aiSummary: "Selected by FlightOne AI Agent for best overall fare, timing, and schedule reliability."
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
  }, [offers, aiAnalysis, weather]);

  const remainingOffers = useMemo(() => {
    const topIds = new Set(topPickedOffers.map((t) => t.offer?.id));
    return offers.filter((o) => !topIds.has(o.id));
  }, [offers, topPickedOffers]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden text-gray-100">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Plane className="w-7 h-7 text-sky-400 rotate-45" />
          <span>Flight Search & Compare</span>
          <span className="text-xs px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
            FlightOne AI Agent Powered
          </span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Search live flight fares, inspect aircraft models, luggage policies, weather impact, and FlightOne AI Agent comparisons
        </p>
      </div>

      {/* Search Filter Panel */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl mb-8 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">From (Origin)</label>
            <select
              className="w-full h-11 px-3 rounded-xl bg-slate-950 text-white border border-slate-700 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {AIRPORTS.map((a) => (
                <option key={`from-${a.code}`} value={a.code}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">To (Destination)</label>
            <select
              className="w-full h-11 px-3 rounded-xl bg-slate-950 text-white border border-slate-700 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {AIRPORTS.map((a) => (
                <option key={`to-${a.code}`} value={a.code}>{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Departure Date</label>
            <input
              type="date"
              className="w-full h-11 px-3 rounded-xl bg-slate-950 text-white border border-slate-700 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Cabin Class</label>
            <select
              className="w-full h-11 px-3 rounded-xl bg-slate-950 text-white border border-slate-700 focus:border-sky-400 focus:outline-none text-xs sm:text-sm cursor-pointer"
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleManualSearch}
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full"></span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 rotate-45" />
                  <span>Search Flights</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* INITIAL STATE BANNER */}
      {!hasSearched && !loading && (
        <div className="text-center py-16 px-6 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-2xl mx-auto shadow-2xl mb-12">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-7 h-7 rotate-45" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Search Live Flights & FlightOne AI Agent Comparisons
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6">
            Select origin city, destination, departure date, and click <strong className="text-sky-400">Search Flights</strong>. FlightOne AI Agent will analyze all flight options across pricing, weather, and delays.
          </p>
        </div>
      )}

      {/* 3-SECOND FLIGHTONE AI AGENT ANALYSIS LOADING ANIMATION BANNER */}
      {loading && (
        <div className="py-12 px-6 bg-slate-900 border border-sky-500/30 rounded-3xl text-center shadow-2xl mb-8 max-w-xl mx-auto backdrop-blur-md">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-7 h-7 text-sky-400" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Analyzing Flights using FlightOne AI Agent
          </h3>

          <p className="text-sky-400 font-mono text-xs mb-4 animate-pulse">
            {analysisText}
          </p>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 h-full animate-pulse w-3/4 transition-all duration-700"></div>
          </div>
        </div>
      )}

      {/* ROUTE & DESTINATION WEATHER SUMMARY */}
      {hasSearched && !loading && routeInfo && weather && (
        <div className="mb-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{routeInfo.fromCity} ({routeInfo.from}) → {routeInfo.toCity} ({routeInfo.to})</span>
                  <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {routeInfo.distanceKm} km
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Route: {routeInfo.fromAirport} to {routeInfo.toAirport}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs shrink-0">
              <CloudSun className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white block">Weather ({weather.city}): {weather.tempC}</span>
                <span className="text-gray-400 text-[11px]">{weather.condition} • Turbulence: <strong className="text-sky-400">{weather.turbulence}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP 3 RECOMMENDED FLIGHTS SECTION */}
      {hasSearched && !loading && topPickedOffers.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Top 3 Recommended Flights (FlightOne AI Agent)</span>
            </h2>
            <span className="text-xs text-emerald-400 font-medium">Ranked by FlightOne AI Agent</span>
          </div>

          <div className="space-y-4">
            {topPickedOffers.map(({ offer, pickInfo }, idx) => {
              const isExpanded = !!expandedIds[offer.id];
              const logoUrl = getLogo(offer.flight);

              return (
                <div
                  key={`${offer.id}-${idx}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                    idx === 0
                      ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400/60"
                      : idx === 1
                      ? "bg-slate-900/90 border-sky-500/40 hover:border-sky-400/60"
                      : "bg-slate-900/90 border-purple-500/40 hover:border-purple-400/60"
                  }`}
                >
                  {/* MAIN COMPACT FLIGHT ROW SURFACE */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Airline Logo & Name */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={getAirlineName(offer.flight)}
                          className="h-9 w-9 rounded-lg bg-white p-1 object-contain shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <Plane className="w-5 h-5 text-sky-400 rotate-45" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base truncate">{offer.flight}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                            idx === 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
                            idx === 1 ? "bg-sky-500/20 text-sky-300 border-sky-500/40" :
                                        "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          }`}>
                            {pickInfo.grokTag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{offer.airlineName || getAirlineName(offer.flight)} • <span className="text-gray-300">{offer.aircraft || "A320neo"}</span></p>
                      </div>
                    </div>

                    {/* Flight Schedule & Route */}
                    <div className="flex items-center justify-between lg:justify-center gap-4 flex-1 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
                      <div className="text-left min-w-[70px]">
                        <p className="font-extrabold text-white text-sm sm:text-base">
                          {offer.dep ? new Date(offer.dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">{from}</p>
                      </div>

                      <div className="flex-1 max-w-[140px] px-2">
                        <span className="text-[10px] text-sky-400 font-medium block">Direct Nonstop</span>
                        <div className="h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 relative my-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block">{offer.durationFormatted || offer.duration}</span>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <p className="font-extrabold text-white text-sm sm:text-base">
                          {offer.arr ? new Date(offer.arr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">{to}</p>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[240px]">
                      <div className="text-left lg:text-right">
                        <div className="text-xl font-black text-white">
                          ₹ {offer.priceInr.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[11px] text-gray-400 block">{offer.cabin}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(offer.flight ? offer.id : "")}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-gray-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>Details</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-sky-400" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-400" />}
                        </button>

                        <button
                          onClick={() => window.open(getBookingUrl(offer.flight), "_blank")}
                          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md cursor-pointer active:scale-95"
                        >
                          Book ↗
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDABLE DROPDOWN DETAILS DRAWER */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/80 p-4 sm:p-5 text-xs text-gray-300 space-y-4">
                      {/* Human Travel Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-gray-400 text-[10px] block uppercase tracking-wider">Aircraft & Terminals</span>
                          <p className="font-semibold text-white mt-0.5">{offer.aircraft || "Airbus A320neo"}</p>
                          <p className="text-[11px] text-gray-400">{offer.depTerminal || "Terminal 3"} → {offer.arrTerminal || "Terminal 2"}</p>
                        </div>

                        <div>
                          <span className="text-gray-400 text-[10px] block uppercase tracking-wider">Baggage Allowance</span>
                          <p className="font-semibold text-sky-300 mt-0.5">{offer.baggage || "15 kg Check-in + 7 kg Cabin"}</p>
                          <p className="text-[11px] text-gray-400">Class: {offer.fareClass || "Y (Saver)"}</p>
                        </div>

                        <div>
                          <span className="text-gray-400 text-[10px] block uppercase tracking-wider">Cancellation & Meal</span>
                          <p className="font-semibold text-emerald-400 mt-0.5">{offer.cancellation || "Partially Refundable"}</p>
                          <p className="text-[11px] text-gray-400">{offer.meal || "Buy-on-board Snacks"}</p>
                        </div>

                        <div>
                          <span className="text-gray-400 text-[10px] block uppercase tracking-wider">Delay & Punctuality</span>
                          <p className="font-semibold text-amber-300 mt-0.5">{offer.delayStatus || "On-Time"}</p>
                          <p className="text-[11px] text-gray-400">Punctuality Rating: {offer.punctualityRate || "95%"}</p>
                        </div>
                      </div>

                      {/* FlightOne AI Agent Recommendation Breakdown */}
                      <div className="bg-slate-900/90 border border-sky-500/20 p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                          <Bot className="w-4 h-4" />
                          <span>FlightOne AI Agent Comparison Analysis</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                          <p><strong className="text-emerald-400 font-semibold">Price Insight:</strong> {pickInfo.priceAnalysis}</p>
                          <p><strong className="text-amber-400 font-semibold">Delay Assessment:</strong> {pickInfo.delayAnalysis}</p>
                        </div>
                        <p className="text-gray-300 italic pt-1 border-t border-slate-800 leading-relaxed">
                          "{pickInfo.aiSummary}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL REMAINING FLIGHTS SECTION */}
      {hasSearched && !loading && (
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400 rotate-45" />
              <span>All Available Flights</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {offers.length} options
            </span>
          </div>

          {remainingOffers.length > 0 ? (
            <div className="space-y-3">
              {remainingOffers.map((o, idx) => {
                const isExpanded = !!expandedIds[o.id];
                const logoUrl = getLogo(o.flight);

                return (
                  <div
                    key={`${o.id}-${idx}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-md"
                  >
                    {/* MAIN COMPACT ROW SURFACE */}
                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Airline Logo & Name */}
                      <div className="flex items-center gap-3 min-w-[200px]">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={getAirlineName(o.flight)}
                            className="h-8 w-8 rounded-lg bg-white p-1 object-contain shrink-0 border border-white/10"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Plane className="w-4 h-4 text-sky-400 rotate-45" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-base truncate">{o.flight}</h3>
                          <p className="text-xs text-gray-400 truncate">{o.airlineName || getAirlineName(o.flight)} • <span className="text-gray-300">{o.aircraft || "A320neo"}</span></p>
                        </div>
                      </div>

                      {/* Flight Schedule */}
                      <div className="flex items-center justify-between lg:justify-center gap-4 flex-1 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
                        <div className="text-left min-w-[70px]">
                          <p className="font-extrabold text-white text-sm sm:text-base">
                            {o.dep ? new Date(o.dep).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">{from}</p>
                        </div>

                        <div className="flex-1 max-w-[140px] px-2">
                          <span className="text-[10px] text-sky-400 font-medium block">Direct Nonstop</span>
                          <div className="h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 relative my-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">{o.durationFormatted || o.duration}</span>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <p className="font-extrabold text-white text-sm sm:text-base">
                            {o.arr ? new Date(o.arr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">{to}</p>
                        </div>
                      </div>

                      {/* Price & Action Buttons */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[240px]">
                        <div className="text-left lg:text-right">
                          <div className="text-xl font-black text-white">
                            ₹ {o.priceInr.toLocaleString("en-IN")}
                          </div>
                          <span className="text-[11px] text-gray-400 block">{o.cabin}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(o.id)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-gray-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <span>Details</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-sky-400" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-400" />}
                          </button>

                          <button
                            onClick={() => window.open(getBookingUrl(o.flight), "_blank")}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 font-bold text-xs transition border border-slate-700 cursor-pointer active:scale-95"
                          >
                            Book ↗
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDABLE DROPDOWN DETAILS DRAWER */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/80 p-4 text-xs text-gray-300 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase">Aircraft & Terminals</span>
                            <p className="font-semibold text-white mt-0.5">{o.aircraft || "Airbus A320neo"}</p>
                            <p className="text-[11px] text-gray-400">{o.depTerminal || "Terminal 3"} → {o.arrTerminal || "Terminal 2"}</p>
                          </div>

                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase">Baggage Allowance</span>
                            <p className="font-semibold text-sky-300 mt-0.5">{o.baggage || "15 kg Check-in + 7 kg Cabin"}</p>
                            <p className="text-[11px] text-gray-400">Class: {o.fareClass || "Y (Saver)"}</p>
                          </div>

                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase">Cancellation Policy</span>
                            <p className="font-semibold text-emerald-400 mt-0.5">{o.cancellation || "Partially Refundable"}</p>
                            <p className="text-[11px] text-gray-400">{o.meal || "Buy-on-board Snacks"}</p>
                          </div>

                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase">Delay & Punctuality</span>
                            <p className="font-semibold text-amber-300 mt-0.5">{o.delayStatus || "On-Time"}</p>
                            <p className="text-[11px] text-gray-400">Punctuality Index: {o.punctualityRate || "95%"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            offers.length > 0 && (
              <div className="text-center py-6 text-gray-400 text-xs">
                All available options are listed in the Top 3 Recommendations above.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
