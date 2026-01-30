"use client";

import { useState, useRef } from "react";
import { flights } from "@/data/flights";
import { airports } from "@/data/airports";
import { useAuth } from "@/app/context/AuthContent";
import { useRouter } from "next/navigation";

const BookingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  // FORM STATES
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");
  const [cabin, setCabin] = useState("");

  // FLIGHT STATES
  const [results, setResults] = useState<typeof flights>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // BOOK POPUP
  const [showModal, setShowModal] = useState(false);

  const compareRef = useRef<HTMLDivElement | null>(null);

  // SEARCH VALIDATION
  const searchFlights = () => {
    if (!user) {
      alert("Please login to search flights");
      router.push("/login");
      return;
    }

    if (!from || !to || !date || !passengers || !cabin) {
      alert("Please fill all fields before searching flights");
      return;
    }

    if (from === to) {
      alert("From and To location cannot be same");
      return;
    }

    setResults(flights);
    setSelected([]);
    setShowCompare(false);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  const comparedFlights = results.filter((f) =>
    selected.includes(f.id)
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-6">
        Flight Booking & Comparison
      </h1>

      {/* SEARCH FORM */}
      <div className="grid md:grid-cols-5 gap-4 bg-white/5 p-6 rounded-xl border border-white/10">

        <select
          className="input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          <option value="">From</option>
          {airports.map((a) => (
            <option key={a.code} value={a.code}>
              {a.city} ({a.code})
            </option>
          ))}
        </select>

        <select
          className="input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          <option value="">To</option>
          {airports.map((a) => (
            <option key={a.code} value={a.code}>
              {a.city} ({a.code})
            </option>
          ))}
        </select>

        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="input"
          placeholder="Passengers"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
        />

        <select
          className="input"
          value={cabin}
          onChange={(e) => setCabin(e.target.value)}
        >
          <option value="">Cabin</option>
          <option>Economy</option>
          <option>Premium Economy</option>
          <option>Business</option>
        </select>

        <button
          onClick={searchFlights}
          className="md:col-span-5 bg-sky-500 py-3 rounded-lg text-black font-semibold hover:bg-sky-400"
        >
          Search Flights
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-10">
            <h2 className="text-xl font-semibold">
              Available Flights
            </h2>

            <button
              onClick={() => {
                if (selected.length < 2) {
                  alert("Select at least 2 flights to compare");
                  return;
                }

                setShowCompare(true);

                setTimeout(() => {
                  compareRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 200);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition
                ${
                  selected.length < 2
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-500 text-black hover:bg-green-400"
                }`}
            >
              Compare Flights
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {results.map((flight) => (
              <div
                key={flight.id}
                className="flex flex-col md:flex-row justify-between items-center p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(flight.id)}
                    onChange={() => toggleSelect(flight.id)}
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {flight.airline}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {flight.from} → {flight.to} | {flight.duration}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-center mt-4 md:mt-0">
                  <span>⭐ {flight.rating}</span>
                  <span>Delay: {flight.delayRisk}</span>
                  <span className="text-lg font-bold text-sky-400">
                    ₹{flight.price}
                  </span>

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* COMPARISON TABLE */}
      {showCompare && comparedFlights.length >= 2 && (
        <div ref={compareRef} className="mt-16 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6">
            Flight Comparison
          </h2>

          <table className="w-full border border-white/10 text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Airline</th>
                <th className="p-3">Price</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Delay Risk</th>
              </tr>
            </thead>

            <tbody>
              {comparedFlights.map((f) => (
                <tr
                  key={f.id}
                  className="border-t border-white/10 text-center"
                >
                  <td className="p-3 text-left">{f.airline}</td>
                  <td className="p-3">₹{f.price}</td>
                  <td className="p-3">{f.duration}</td>
                  <td className="p-3">⭐ {f.rating}</td>
                  <td className="p-3">{f.delayRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOOK POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">
              ✈️ Flight One
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              This flight booking information is currently displayed for
              <span className="text-white font-medium">
                {" "}educational purposes only
              </span>.
              <br />
              Real-time airline booking integration will be added in future
              updates.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400"
            >
              Okay, Got it
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default BookingPage;
