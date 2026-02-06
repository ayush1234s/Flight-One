import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ important for Vercel

export async function GET() {
  try {
    const clientId = process.env.OPENSKY_CLIENT_ID;
    const clientSecret = process.env.OPENSKY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing OpenSky ENV vars" },
        { status: 500 }
      );
    }

    // 1) Get OAuth2 Token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const tokenRes = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        cache: "no-store",
      }
    );

    const tokenText = await tokenRes.text();

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: "Token failed", status: tokenRes.status, body: tokenText },
        { status: tokenRes.status }
      );
    }

    const tokenData = JSON.parse(tokenText);

    // 2) Call OpenSky API with Bearer token
    const res = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    const dataText = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: "OpenSky API error", status: res.status, body: dataText },
        { status: res.status }
      );
    }

    const data = JSON.parse(dataText);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "OpenSky route crashed",
        message: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
