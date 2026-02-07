import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChaosItem = {
  airport: string;
  city: string;
  severity: "low" | "medium" | "high";
  message: string;
};

const MAJOR_AIRPORTS = [
  { iata: "DEL", city: "Delhi" },
  { iata: "BOM", city: "Mumbai" },
  { iata: "BLR", city: "Bengaluru" },
  { iata: "HYD", city: "Hyderabad" },
  { iata: "CCU", city: "Kolkata" },
  { iata: "SXR", city: "Srinagar" },
  { iata: "MAA", city: "Chennai" },
];

export async function GET() {
  try {
    const key = process.env.AIRLABS_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Missing AIRLABS_API_KEY" }, { status: 500 });
    }

    // Get live flights
    const res = await fetch(`https://airlabs.co/api/v9/flights?api_key=${key}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: "AirLabs error", body: t }, { status: res.status });
    }

    const data = await res.json();
    const flights: any[] = data?.response || [];

    const chaos: ChaosItem[] = [];

    for (const ap of MAJOR_AIRPORTS) {
      const related = flights.filter(
        (f) => f?.dep_iata === ap.iata || f?.arr_iata === ap.iata
      );

      if (related.length === 0) continue;

      const delayed = related.filter((f) => f?.delayed || f?.status !== "en-route").length;
      const delayRatio = delayed / related.length;

      let severity: ChaosItem["severity"] = "low";
      if (delayRatio > 0.4) severity = "high";
      else if (delayRatio > 0.2) severity = "medium";

      if (severity !== "low") {
        chaos.push({
          airport: ap.iata,
          city: ap.city,
          severity,
          message:
            severity === "high"
              ? `Heavy delays detected at ${ap.city} (${Math.round(delayRatio * 100)}% flights affected)`
              : `Delays rising at ${ap.city} (${Math.round(delayRatio * 100)}% flights affected)`,
        });
      }
    }

    return NextResponse.json({ chaos });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Chaos radar crashed", message: e?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
