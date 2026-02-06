import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory cache (lives per serverless instance)
let cache: any = null;
let cacheTime = 0;

const CACHE_TTL = 60 * 1000; // 60 sec

async function safeFetch(url: string, timeout = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  try {
    // 🧠 If cache fresh, serve instantly (no OpenSky call)
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      return NextResponse.json({ ...cache, __cached: true });
    }

    const res = await safeFetch("https://opensky-network.org/api/states/all");

    if (!res.ok) throw new Error("OpenSky not OK");

    const data = await res.json();

    // 💾 save cache
    cache = data;
    cacheTime = Date.now();

    return NextResponse.json(data);
  } catch (err: any) {
    // 🛟 Fallback to cache if OpenSky fails
    if (cache) {
      return NextResponse.json({
        ...cache,
        __fallback: true,
        message: "Live data temporarily unavailable. Showing last known data.",
      });
    }

    // 🧯 Absolute fallback (no crash)
    return NextResponse.json({
      time: Date.now(),
      states: [],
      __error: true,
      message:
        "Live flight data temporarily unavailable due to OpenSky instability.",
    });
  }
}
