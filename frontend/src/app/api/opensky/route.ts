import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory cache (per instance)
let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 15 * 60 * 1000; // ✅ 15 minutes

export async function GET() {
  try {
    // Serve cache if still fresh
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    const res = await fetch("https://opensky-network.org/api/states/all", {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "OpenSky blocked", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    const payload = { states: data.states || [] };

    cache = payload;
    lastFetch = Date.now();

    return NextResponse.json({ ...payload, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "OpenSky route crashed",
        message: err?.message || "fetch failed",
      },
      { status: 500 }
    );
  }
}
