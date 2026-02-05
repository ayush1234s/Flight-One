"use client";

import { useState } from "react";
import { Plane, Car, UtensilsCrossed, Calculator } from "lucide-react";

export default function EstimatorPage() {
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [cabKm, setCabKm] = useState(10);
  const [snacks, setSnacks] = useState(200);
  const [result, setResult] = useState<null | {
    flight: number;
    cab: number;
    snacks: number;
    total: number;
  }>(null);

  const estimateCost = () => {
    if (!flightFrom || !flightTo) {
      alert("Please enter flight From and To");
      return;
    }

    // Dummy estimation logic (demo purpose)
    const flightCost =
      3500 + Math.floor(Math.random() * 3000); // ₹3500–6500 approx
    const cabCost = cabKm * 18; // ₹18/km approx
    const snacksCost = snacks;

    const total = flightCost + cabCost + snacksCost;

    setResult({
      flight: flightCost,
      cab: cabCost,
      snacks: snacksCost,
      total,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Calculator className="text-sky-400" />
        Travel Cost Estimator
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* FLIGHT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Plane size={18} /> Flight Details
          </h3>

          <input
            className="input mb-3"
            placeholder="From (e.g. DEL)"
            value={flightFrom}
            onChange={(e) => setFlightFrom(e.target.value)}
          />

          <input
            className="input"
            placeholder="To (e.g. BOM)"
            value={flightTo}
            onChange={(e) => setFlightTo(e.target.value)}
          />
        </div>

        {/* CAB */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Car size={18} /> Cab Travel
          </h3>

          <input
            type="number"
            min={1}
            className="input"
            value={cabKm}
            onChange={(e) => setCabKm(Number(e.target.value))}
          />

          <p className="text-xs text-gray-400 mt-2">
            Approx distance in KM
          </p>
        </div>

        {/* SNACKS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UtensilsCrossed size={18} /> Snacks / Misc
          </h3>

          <input
            type="number"
            min={0}
            className="input"
            value={snacks}
            onChange={(e) => setSnacks(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        onClick={estimateCost}
        className="bg-sky-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-sky-400 transition"
      >
        Estimate Total Cost
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Estimated Trip Cost
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <p>✈️ Flight: ₹{result.flight}</p>
            <p>🚕 Cab: ₹{result.cab}</p>
            <p>🍔 Snacks: ₹{result.snacks}</p>
          </div>

          <div className="mt-6 text-xl font-bold text-sky-400">
            Total: ₹{result.total}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            * These values are approximate demo estimates for educational purposes only.
          </p>
        </div>
      )}
    </div>
  );
}
