import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1) Get OAuth2 Token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.OPENSKY_CLIENT_ID!);
    params.append("client_secret", process.env.OPENSKY_CLIENT_SECRET!);

    const tokenRes = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        cache: "no-store",
      }
    );

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return NextResponse.json(
        { error: "Token failed", status: tokenRes.status, body: t },
        { status: tokenRes.status }
      );
    }

    const tokenData = await tokenRes.json();

    // 2) Call OpenSky API with Bearer token
    const res = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "OpenSky error", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch OpenSky data" },
      { status: 500 }
    );
  }
}
