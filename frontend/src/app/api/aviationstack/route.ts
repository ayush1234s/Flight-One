import { NextResponse } from "next/server";

export const runtime = "nodejs";

let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 15 * 60 * 1000;

// Airline code → Country fallback map
const AIRLINE_COUNTRY_MAP: Record<string, string> = {
  AI: "India",
  UK: "India",       // Vistara (old UK code)       // IndiGo
  SG: "India",       // SpiceJet
  EK: "UAE",
  EY: "UAE",
  QR: "Qatar",
  SQ: "Singapore",
  BA: "UK",
  LH: "Germany",
  AF: "France",
  DL: "USA",
  AA: "USA",
  UA: "USA",
  AC: "Canada",
  JL: "Japan",
  NH: "Japan",
};

export async function GET() {
  try {
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    const API_KEY = process.env.AVIATIONSTACK_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing AVIATIONSTACK_API_KEY" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Aviationstack error", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    const states =
      data?.data?.slice(0, 80).map((f: any) => {
        const flightCode = f.flight?.iata || f.flight?.icao || "";
        const airlinePrefix = flightCode.slice(0, 2).toUpperCase();

        const country =
          f.departure?.country ||
          f.arrival?.country ||
          f.airline?.country ||
          AIRLINE_COUNTRY_MAP[airlinePrefix] ||
          "—";

        return [
          f.aircraft?.icao24 || null,
          flightCode,
          country, // ✅ guaranteed country fallback
          f.departure?.airport || "",
          f.arrival?.airport || "",
          null,
          null,
          f.live?.altitude || 0,
          !f.live,
          f.live?.speed_horizontal
            ? f.live.speed_horizontal / 3.6
            : 0,
          f.live?.direction || 0,
        ];
      }) || [];

    const payload = { states };

    cache = payload;
    lastFetch = Date.now();

    return NextResponse.json({ ...payload, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Aviationstack route crashed",
        message: err?.message || "fetch failed",
      },
      { status: 500 }
    );
  }
}
