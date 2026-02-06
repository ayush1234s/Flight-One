import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory cache (per Vercel instance)
let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function safeFetch(url: string, timeout = 8000) {
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
    // ✅ Serve cache if fresh
    if (cache && Date.now() - lastFetch < CACHE_TTL) {
      return NextResponse.json({ ...cache, cached: true });
    }

    const res = await safeFetch("https://opensky-network.org/api/states/all");

    if (!res.ok) {
      // ❌ If OpenSky blocks (429 / 5xx) → return last cached data
      return NextResponse.json(
        cache || { states: [], error: "OpenSky blocked", status: res.status },
        { status: 200 }
      );
    }

    const data = await res.json();

    cache = data;
    lastFetch = Date.now();

    return NextResponse.json({ ...data, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      cache || { states: [], error: "OpenSky route crashed" },
      { status: 200 }
    );
  }
}
