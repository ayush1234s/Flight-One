import { NextResponse } from "next/server";

export const runtime = "nodejs";

let cache: any = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 1000; // 1 min cache

async function airlabs(path: string, key: string) {
  const url = `https://airlabs.co/api/v9/${path}${path.includes("?") ? "&" : "?"}api_key=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Airlabs ${path} failed: ${t}`);
  }
  return res.json();
}

export async function GET() {
  try {
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    const API_KEY = process.env.AIRLABS_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing AIRLABS_API_KEY" }, { status: 500 });
    }

    // 1) Live flights
    const flightsRes = await airlabs("flights", API_KEY);

    // 2) Airports (limited sample to avoid heavy payload)
    const airportsRes = await airlabs("airports?limit=50", API_KEY);

    // 3) Airlines
    const airlinesRes = await airlabs("airlines", API_KEY);

    // 4) Routes / schedules (sample – may be limited on free tier)
    const routesRes = await airlabs("routes?limit=50", API_KEY);

    // Normalize Flights (Live tracking + status + aircraft)
    const flights =
      flightsRes?.response?.slice(0, 100).map((f: any) => ({
        flightNumber: f.flight_iata || f.flight_icao || "—",
        airline: {
          name: f.airline_name || "—",
          iata: f.airline_iata || "—",
          icao: f.airline_icao || "—",
        },
        position: {
          lat: f.lat ?? null,
          lng: f.lng ?? null,
        },
        altitudeM: f.alt ?? null,
        speedKmh: f.speed ?? null,
        direction: f.dir ?? null,
        status: f.status || "—",
        departure: {
          iata: f.dep_iata || "—",
          icao: f.dep_icao || "—",
          scheduled: f.dep_time || null,
          actual: f.dep_time_actual || null,
          terminal: f.dep_terminal || null,
          gate: f.dep_gate || null,
          delayMin: f.dep_delay || null,
        },
        arrival: {
          iata: f.arr_iata || "—",
          icao: f.arr_icao || "—",
          scheduled: f.arr_time || null,
          actual: f.arr_time_actual || null,
          terminal: f.arr_terminal || null,
          gate: f.arr_gate || null,
          delayMin: f.arr_delay || null,
        },
        aircraft: {
          type: f.aircraft_icao || "—",
          registration: f.reg_number || "—",
          manufacturer: f.manufacturer || "—",
        },
      })) || [];

    // Normalize Airports
    const airports =
      airportsRes?.response?.slice(0, 50).map((a: any) => ({
        name: a.name || "—",
        iata: a.iata_code || "—",
        icao: a.icao_code || "—",
        city: a.city || "—",
        country: a.country || "—",
        lat: a.lat || null,
        lng: a.lng || null,
      })) || [];

    // Normalize Airlines
    const airlines =
      airlinesRes?.response?.slice(0, 50).map((al: any) => ({
        name: al.name || "—",
        iata: al.iata_code || "—",
        icao: al.icao_code || "—",
        country: al.country || "—",
        fleet: al.fleet || null,
      })) || [];

    // Normalize Routes / Schedules
    const routes =
      routesRes?.response?.slice(0, 50).map((r: any) => ({
        from: r.dep_iata || "—",
        to: r.arr_iata || "—",
        days: r.days || [],
        active: r.active ?? null,
      })) || [];

    const payload = { flights, airports, airlines, routes };
    cache = payload;
    lastFetch = Date.now();

    return NextResponse.json({ ...payload, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Airlabs aggregate route crashed", message: err?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
