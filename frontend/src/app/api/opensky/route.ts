import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function fetchWithTimeout(url: string, ms = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  try {
    let res = await fetchWithTimeout(
      "https://opensky-network.org/api/states/all"
    );

    // 🔁 retry once if failed
    if (!res.ok) {
      await new Promise((r) => setTimeout(r, 1200));
      res = await fetchWithTimeout(
        "https://opensky-network.org/api/states/all"
      );
    }

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: "OpenSky unstable",
          status: res.status,
          message: text,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "OpenSky route crashed",
        reason: "OpenSky API unstable or blocked",
        message: err?.name === "AbortError"
          ? "Request timed out"
          : err?.message || "fetch failed",
      },
      { status: 502 }
    );
  }
}
