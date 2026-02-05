"use client";

import { useState } from "react";
import { Plane, Car, UtensilsCrossed, Calculator, MapPin } from "lucide-react";

type Airport = {
    code: string;
    city: string;
    state: string;
    lat: number;
    lon: number;
};

const AIRPORTS: Airport[] = [
    { code: "DEL", city: "Delhi", state: "Delhi", lat: 28.5562, lon: 77.1000 },
    { code: "BOM", city: "Mumbai", state: "Maharashtra", lat: 19.0896, lon: 72.8656 },
    { code: "BLR", city: "Bengaluru", state: "Karnataka", lat: 13.1986, lon: 77.7066 },
    { code: "HYD", city: "Hyderabad", state: "Telangana", lat: 17.2403, lon: 78.4294 },
    { code: "MAA", city: "Chennai", state: "Tamil Nadu", lat: 12.9941, lon: 80.1709 },
    { code: "CCU", city: "Kolkata", state: "West Bengal", lat: 22.6547, lon: 88.4467 },
    { code: "PNQ", city: "Pune", state: "Maharashtra", lat: 18.5793, lon: 73.9089 },
    { code: "AMD", city: "Ahmedabad", state: "Gujarat", lat: 23.0772, lon: 72.6347 },
    { code: "JAI", city: "Jaipur", state: "Rajasthan", lat: 26.8242, lon: 75.8122 },
    { code: "LKO", city: "Lucknow", state: "Uttar Pradesh", lat: 26.7606, lon: 80.8893 },
];

export default function EstimatorPage() {
    const [flightFrom, setFlightFrom] = useState("DEL");
    const [flightTo, setFlightTo] = useState("BOM");
    const [cabKm, setCabKm] = useState(10);
    const [snacks, setSnacks] = useState(200);
    const [result, setResult] = useState<null | {
        flight: number;
        cab: number;
        snacks: number;
        total: number;
        distance: number;
    }>(null);

    const toRad = (value: number) => (value * Math.PI) / 180;

    const calculateDistanceKm = (a: Airport, b: Airport) => {
        const R = 6371;
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);

        const x =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
        return Math.round(R * c);
    };

    const estimateCost = () => {
        const from = AIRPORTS.find(a => a.code === flightFrom);
        const to = AIRPORTS.find(a => a.code === flightTo);

        if (!from || !to) {
            alert("Please select valid airports");
            return;
        }

        if (from.code === to.code) {
            alert("From and To cannot be same");
            return;
        }

        const distance = calculateDistanceKm(from, to);

        // Realistic demo pricing model
        const flightCost = Math.round(1500 + distance * 4.5); // base + per km
        const cabCost = Math.round(60 + cabKm * 22); // base + per km
        const snacksCost = snacks;

        const total = flightCost + cabCost + snacksCost;

        setResult({
            flight: flightCost,
            cab: cabCost,
            snacks: snacksCost,
            total,
            distance,
        });
    };

    return (
        <section className="min-h-screen bg-slate-950 text-white py-24">
            <div className="max-w-5xl mx-auto px-6">

                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                        <Calculator className="text-sky-400" />
                        Travel Cost Estimator
                    </h1>
                    <p className="mt-3 text-gray-400">
                        Realistic distance-based estimation (demo model)
                    </p>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

                    <div className="grid md:grid-cols-2 gap-6 mb-10">

                        {/* FLIGHT */}
                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Plane size={18} className="text-sky-400" /> Flight Details
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/40 appearance-none"
                                    value={flightFrom}
                                    onChange={(e) => setFlightFrom(e.target.value)}
                                >
                                    {AIRPORTS.map(a => (
                                        <option key={a.code} value={a.code} className="bg-slate-900 text-white">
                                            {a.code} – {a.city}, {a.state}
                                        </option>
                                    ))}
                                </select>


                                <select
                                    className="w-full rounded-xl bg-slate-900 text-white border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/40 appearance-none"
                                    value={flightTo}
                                    onChange={(e) => setFlightTo(e.target.value)}
                                >
                                    {AIRPORTS.map(a => (
                                        <option key={a.code} value={a.code} className="bg-slate-900 text-white">
                                            {a.code} – {a.city}, {a.state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* CAB */}
                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Car size={18} className="text-sky-400" /> Cab Travel
                            </h3>

                            <input
                                type="number"
                                min={1}
                                className="input bg-black/40"
                                value={cabKm}
                                onChange={(e) => setCabKm(Number(e.target.value))}
                            />

                            <p className="text-xs text-gray-400 mt-2">
                                Approx distance in KM (₹60 base + ₹22/km)
                            </p>
                        </div>

                        {/* SNACKS */}
                        <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:col-span-2">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <UtensilsCrossed size={18} className="text-sky-400" /> Snacks / Misc
                            </h3>

                            <input
                                type="number"
                                min={0}
                                className="input bg-black/40"
                                value={snacks}
                                onChange={(e) => setSnacks(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={estimateCost}
                            className="bg-sky-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
                        >
                            Estimate Total Cost
                        </button>
                    </div>
                </div>

                {result && (
                    <div className="mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

                        <h2 className="text-2xl font-bold mb-2">
                            Estimated Trip Cost
                        </h2>

                        <p className="text-sm text-gray-400 mb-6">
                            ✈️ Distance between airports: ~{result.distance} km
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                                ✈️ Flight: ₹{result.flight}
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                                🚕 Cab: ₹{result.cab}
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                                🍔 Snacks: ₹{result.snacks}
                            </div>
                        </div>

                        <div className="mt-6 text-2xl font-bold text-sky-400 text-center">
                            Total: ₹{result.total}
                        </div>

                        <p className="mt-4 text-xs text-gray-500 text-center">
                            * Demo estimation. Actual prices vary by airline, time, surge pricing & availability.
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
}
