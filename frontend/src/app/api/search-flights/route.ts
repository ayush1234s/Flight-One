import { NextResponse } from "next/server";

export const runtime = "nodejs";

let token = "";
let tokenExp = 0;

async function getToken() {
  if (token && Date.now() < tokenExp) return token;

  const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY!,
      client_secret: process.env.AMADEUS_API_SECRET!,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("Amadeus token error: " + t);
  }

  const json = await res.json();
  token = json.access_token;
  tokenExp = Date.now() + json.expires_in * 1000 - 30_000;
  return token;
}

const INR_RATE: Record<string, number> = { INR: 1, USD: 83, EUR: 90, GBP: 105 };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const adults = searchParams.get("adults") || "1";
    const cabin = searchParams.get("cabin") || "ECONOMY";

    if (!from || !to || !date) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const accessToken = await getToken();

    const url =
      `https://test.api.amadeus.com/v2/shopping/flight-offers` +
      `?originLocationCode=${from}` +
      `&destinationLocationCode=${to}` +
      `&departureDate=${date}` +
      `&adults=${adults}` +
      `&travelClass=${cabin}` +
      `&max=50`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: "Amadeus search error", body: t }, { status: res.status });
    }

    const data = await res.json();

    const offers =
      (data?.data || []).map((o: any) => {
        const itin = o.itineraries?.[0];
        const seg = itin?.segments?.[0];
        const currency = o.price?.currency || "INR";
        const rate = INR_RATE[currency] || 83;

        return {
          id: o.id,
          priceInr: Math.round(Number(o.price?.total || 0) * rate),
          currency: "INR",
          airline: seg?.carrierCode || "—",
          flight: `${seg?.carrierCode || ""}${seg?.number || ""}`,
          from: seg?.departure?.iataCode,
          to: seg?.arrival?.iataCode,
          dep: seg?.departure?.at,
          arr: seg?.arrival?.at,
          duration: itin?.duration,
          cabin: o.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || cabin,
          fareClass: o.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class || "—",
        };
      }) || [];

    return NextResponse.json({ offers });
  } catch (e: any) {
    return NextResponse.json(
      { error: "search-flights crashed", message: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
