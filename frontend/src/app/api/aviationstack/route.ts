import { NextResponse } from "next/server";

export const runtime = "nodejs";

let cache: any = null;
let lastFetch = 0;
const CACHE_TTL = 15 * 60 * 1000;

// Airline IATA -> Country fallback
const AIRLINE_COUNTRY_MAP: Record<string, string> = {
  AI: "India", UK: "India", SG: "India", G8: "India",
  EK: "UAE", EY: "UAE", QR: "Qatar", SQ: "Singapore",
  BA: "UK", LH: "Germany", AF: "France",
  DL: "USA", AA: "USA", UA: "USA",
  AC: "Canada", JL: "Japan", NH: "Japan",
};

function estimateSpeedKmH(type?: string) {
  // super rough estimates by aircraft type
  if (!type) return 750;           // default cruise
  if (type.startsWith("A3") || type.startsWith("B7")) return 800;
  return 720;
}

function estimateAltitudeM() {
  return 10000 + Math.floor(Math.random() * 2000); // 10–12km
}

export async function GET() {
  try {
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    const API_KEY = process.env.AVIATIONSTACK_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing AVIATIONSTACK_API_KEY" }, { status: 500 });
    }

    const res = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&limit=100`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Aviationstack error", status: res.status, body: text }, { status: res.status });
    }

    const data = await res.json();

    const states =
      data?.data?.map((f: any) => {
        const flightCode = (f.flight?.iata || f.flight?.icao || "").toUpperCase();
        const prefix = flightCode.slice(0, 2);

        const country =
          f.departure?.country ||
          f.arrival?.country ||
          f.airline?.country ||
          AIRLINE_COUNTRY_MAP[prefix] ||
          "Unknown";

        const isLive = !!f.live;

        const altitudeM = isLive && f.live?.altitude
          ? f.live.altitude
          : estimateAltitudeM(); // 👈 fallback estimate

        const speedMs = isLive && f.live?.speed_horizontal
          ? f.live.speed_horizontal / 3.6
          : estimateSpeedKmH(f.aircraft?.icao) / 3.6; // 👈 fallback estimate

        return [
          f.aircraft?.icao24 || null,     // [0]
          flightCode,                     // [1]
          country,                        // [2]
          f.departure?.airport || "",     // [3]
          f.arrival?.airport || "",       // [4]
          null,                           // [5]
          null,                           // [6]
          altitudeM || 0,                 // [7]
          !isLive ? false : false,        // [8] treat as airborne
          speedMs || 0,                   // [9]
          f.live?.direction || 0,         // [10]
        ];
      }) || [];

    const payload = { states };
    cache = payload;
    lastFetch = Date.now();

    return NextResponse.json({ ...payload, cached: false });
  } catch (err: any) {
    return NextResponse.json({ error: "Aviationstack route crashed", message: err?.message || "fetch failed" }, { status: 500 });
  }
}
