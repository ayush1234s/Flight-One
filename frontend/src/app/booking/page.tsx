"use client";

import { useState } from "react";

const AIRPORTS = [
  { code: "DEL", name: "Delhi" },
  { code: "BOM", name: "Mumbai" },
  { code: "BLR", name: "Bangalore" },
  { code: "HYD", name: "Hyderabad" },
  { code: "MAA", name: "Chennai" },
  { code: "CCU", name: "Kolkata" },
  { code: "PNQ", name: "Pune" },
];

export default function BookingPage() {
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState("1");

  const [flights, setFlights] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const searchFlights = async () => {
    if (!date) {
      alert("Select date");
      return;
    }

    const res = await fetch(
      `/api/amadeus?from=${from}&to=${to}&date=${date}&adults=${adults}`
    );

    const data = await res.json();
    setFlights(data.data || []);
  };

  const toggleSelect = (flight: any) => {
    if (selected.includes(flight)) {
      setSelected(selected.filter((f) => f !== flight));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, flight]);
      }
    }
  };

  const getAirlineSite = (code: string) => {
    const map: any = {
      AI: "https://www.airindia.com",
      "6E": "https://www.goindigo.in",
      UK: "https://www.airvistara.com",
      SG: "https://www.spicejet.com",
      IX: "https://www.airindiaexpress.com",
    };
    return map[code] || "https://www.google.com";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-6">
        Flight Booking & Comparison
      </h1>

      {/* SEARCH */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
          {AIRPORTS.map(a => (
            <option key={a.code} value={a.code}>
              {a.code} - {a.name}
            </option>
          ))}
        </select>

        <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
          {AIRPORTS.map(a => (
            <option key={a.code} value={a.code}>
              {a.code} - {a.name}
            </option>
          ))}
        </select>

        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="input" type="number" min={1} value={adults} onChange={(e) => setAdults(e.target.value)} />

        <button
          onClick={searchFlights}
          className="bg-sky-500 text-black font-semibold rounded-lg"
        >
          Search
        </button>
      </div>

      {/* FLIGHTS */}
      <div className="grid gap-6 mt-8">
        {flights.map((flight, i) => {
          const segments = flight.itineraries[0].segments;
          const airline = segments[0].carrierCode;

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
                {from} → {to} | Stops: {segments.length - 1}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    window.open(getAirlineSite(airline), "_blank")
                  }
                  className="bg-white/10 px-4 py-2 rounded-lg"
                >
                  Book
                </button>

                <button
                  onClick={() => toggleSelect(flight)}
                  className={`px-4 py-2 rounded-lg border
                    ${
                      selected.includes(flight)
                        ? "border-green-400 text-green-400"
                        : "border-white/20"
                    }`}
                >
                  Compare
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPARE VIEW */}
      {selected.length === 2 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Compare Flights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {selected.map((flight, i) => {
              const seg = flight.itineraries[0].segments;
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="font-semibold mb-2">
                    Airline: {seg[0].carrierCode}
                  </h3>

                  <p>Price: ₹{flight.price.total}</p>
                  <p>Stops: {seg.length - 1}</p>
                  <p>Departure: {seg[0].departure.at}</p>
                  <p>Arrival: {seg[seg.length - 1].arrival.at}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
