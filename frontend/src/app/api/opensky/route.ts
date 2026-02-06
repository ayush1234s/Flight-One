export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.OPENSKY_CLIENT_ID || !process.env.OPENSKY_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Missing OpenSky ENV vars" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.OPENSKY_CLIENT_ID!);
    params.append("client_secret", process.env.OPENSKY_CLIENT_SECRET!);

    const tokenRes = await fetch(
      "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Flight-One-App/1.0",
        },
        body: params.toString(),
        cache: "no-store",
      }
    );

    if (!tokenRes.ok) throw new Error("OAuth token failed");

    const { access_token } = await tokenRes.json();

    const res = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "Flight-One-App/1.0",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("OpenSky fetch failed");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    // 🔁 fallback for demo reliability
    const res = await fetch("https://opensky-network.org/api/states/all", {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  }
}
