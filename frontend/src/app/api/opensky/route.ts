import { NextResponse } from "next/server";

export async function GET() {
  try {
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
      const body = await tokenRes.text();
      return NextResponse.json(
        { error: "OpenSky token failed", status: tokenRes.status, body },
        { status: tokenRes.status }
      );
    }

    const { access_token } = await tokenRes.json();

    const res = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: "OpenSky fetch failed", status: res.status, body },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("OpenSky API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch OpenSky data" },
      { status: 500 }
    );
  }
}
