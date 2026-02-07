"use client";

import { useEffect, useState } from "react";

type ChaosItem = {
  airport: string;
  city: string;
  severity: "low" | "medium" | "high";
  message: string;
};

export default function ChaosRadarPage() {
  const [items, setItems] = useState<ChaosItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChaos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/airlabs/chaos", { cache: "no-store" });
      const data = await res.json();
      setItems(data.chaos || []);
    } catch (e: any) {
      setError("Failed to load Chaos Radar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChaos();
    const id = setInterval(fetchChaos, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🧨 Live Chaos Radar</h1>
        <button
          onClick={fetchChaos}
          className="px-3 py-1.5 rounded-md border border-white/10 hover:border-sky-400/40 hover:text-sky-400 transition"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-red-400">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-400">All clear ✨ No major disruptions right now.</p>
      )}

      <div className="space-y-3">
        {items.map((c, i) => (
          <div
            key={`${c.airport}-${i}`}
            className={`rounded-lg p-4 border ${
              c.severity === "high"
                ? "border-red-400/40 bg-red-400/10"
                : "border-yellow-400/40 bg-yellow-400/10"
            }`}
          >
            <p className="font-semibold">
              {c.city} ({c.airport})
            </p>
            <p className="text-sm text-gray-300">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
