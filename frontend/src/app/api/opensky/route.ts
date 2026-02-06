import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory cache (per instance)
let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 60 * 1000; // 60 seconds

async function safeFetch(url: string, timeout = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  try {
    // 🧠 Serve cache if still fresh
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, __cached: true });
    }

    const res = await safeFetch("https://opensky-network.org/api/states/all");

    if (!res.ok) {
      throw new Error("OpenSky response not ok");
    }

    const data = await res.json();
    cache = data;
    lastFetch = Date.now();

    return NextResponse.json(data);
  } catch (err: any) {
    // 🛟 Fallback to cache
    if (cache) {
      return NextResponse.json({
        ...cache,
        __fallback: true,
        message: "Live API unstable. Showing cached data.",
      });
    }

    // 🧯 Absolute fallback – never crash
    return NextResponse.json({
      time: Date.now(),
      states: [],
      __error: true,
      message:
        "Live flight data temporarily unavailable (OpenSky unstable).",
    });
  }
}
