import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://opensky-network.org/api/states/all",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch OpenSky data" },
      { status: 500 }
    );
  }
}
