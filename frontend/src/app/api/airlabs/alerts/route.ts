import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const key = process.env.AIRLABS_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Missing AIRLABS_API_KEY" }, { status: 500 });
    }

    // AirLabs real-time flights (free tier supports basic live flights)
    const res = await fetch(
      `https://airlabs.co/api/v9/flights?api_key=${key}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: "AirLabs error", body: t }, { status: res.status });
    }

    const data = await res.json();

    // Pick flights with delays / status changes
    const alerts =
      (data?.response || [])
        .filter((f: any) => f?.delayed || (f?.status && f.status !== "en-route"))
        .slice(0, 10)
        .map((f: any) => ({
          flight: f?.flight_iata || f?.flight_icao || "—",
          airline: f?.airline_iata || "—",
          status: f?.status || "unknown",
          dep: f?.dep_iata || "—",
          arr: f?.arr_iata || "—",
          delay: f?.delayed || 0, // minutes (if provided)
        })) || [];

    return NextResponse.json({ alerts });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Airlabs alerts crashed", message: e?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
