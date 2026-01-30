import { NextResponse } from "next/server";

let accessToken = "";
let tokenExpiry = 0;

async function getAccessToken() {
  if (Date.now() < tokenExpiry && accessToken) {
    return accessToken;
  }

  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
    }
  );

  const data = await res.json();

  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return accessToken;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const origin = searchParams.get("from");
    const destination = searchParams.get("to");
    const date = searchParams.get("date");
    const adults = searchParams.get("adults") || "1";
    const travelClass = searchParams.get("class") || "ECONOMY";

    const token = await getAccessToken();

    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&travelClass=${travelClass}&currencyCode=INR&max=20`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
