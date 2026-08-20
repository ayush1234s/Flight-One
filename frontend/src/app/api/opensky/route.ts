import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Cache payload for 15 seconds to stay live while protecting against rate limits
let cache: any = null;
let lastFetch = 0;
const CACHE_TTL = 15 * 1000;

export async function GET() {
  try {
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    // Fetch real airborne planes across Europe, Middle East, India, Asia & SE Asia: lat -10 to 65, lon 10 to 140
    const url = "https://opensky-network.org/api/states/all?lamin=-10&lomin=10&lamax=65&lomax=140";
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    let rawStates: any[] = [];
    if (res.ok) {
      const data = await res.json();
      rawStates = data?.states || [];
    }

    // Filter & map real flying aircraft (latitude, longitude, heading, speed, altitude, callsign, country)
    const planes = rawStates
      .filter((s) => s && s[5] !== null && s[6] !== null && !s[8]) // Must have lng, lat, and not be on ground
      .map((s) => {
        const callsign = (s[1] || "").trim() || `FLT-${s[0]?.toUpperCase().slice(0, 4)}`;
        const country = (s[2] || "International").trim();
        const lng = s[5];
        const lat = s[6];
        const altitudeM = Math.round(s[7] || s[13] || 10000);
        const speedKmh = Math.round((s[9] || 220) * 3.6); // m/s to km/h
        const heading = Math.round(s[10] || 0);

        return {
          id: s[0],
          callsign,
          country,
          lat,
          lng,
          altitudeM,
          speedKmh,
          heading,
        };
      });

    const payload = {
      total: planes.length,
      planes,
      timestamp: Date.now(),
    };

    cache = payload;
    lastFetch = Date.now();

    return NextResponse.json({ ...payload, cached: false });
  } catch (err: any) {
    console.error("OpenSky live route error:", err);
    return NextResponse.json(
      { error: "OpenSky fetch failed", message: err?.message || "unknown error" },
      { status: 500 }
    );
  }
}
