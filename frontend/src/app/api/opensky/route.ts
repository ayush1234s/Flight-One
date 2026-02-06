import { NextResponse } from "next/server";

export const runtime = "nodejs";

let lastGoodData: any = null; // in-memory cache

export async function GET() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://opensky-network.org/api/states/all", {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!res.ok) {
      throw new Error("OpenSky not ok");
    }

    const data = await res.json();
    lastGoodData = data; // cache
    return NextResponse.json(data);
  } catch (err: any) {
    if (lastGoodData) {
      return NextResponse.json({
        ...lastGoodData,
        __fallback: true,
        message: "Serving cached data (OpenSky unstable)",
      });
    }

    return NextResponse.json(
      {
        error: "OpenSky route crashed",
        reason: "OpenSky API unstable or blocked",
        message:
          err?.name === "AbortError"
            ? "Request timed out"
            : err?.message || "fetch failed",
      },
      { status: 502 }
    );
  }
}
