import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Ticket = {
  pnr: string;
  airlineName: string;
  flightNumber: string;
  passengerName: string;
  passengerEmail: string;
  fromCity: string;
  fromIata: string;
  toCity: string;
  toIata: string;
  departureDate: string;
  departureTime: string;
  seat: string;
  gate: string;
  terminal: string;
  status: "Confirmed" | "Completed" | "Upcoming";
  timeframe: "past" | "present" | "future";
};

// Sample mock database of user bookings registered via partner travel portals
const SAMPLE_BOOKINGS: Record<string, Ticket[]> = {
  "demo@gmail.com": [
    {
      pnr: "AI9821",
      airlineName: "Air India",
      flightNumber: "AI101",
      passengerName: "Demo User",
      passengerEmail: "demo@gmail.com",
      fromCity: "Delhi",
      fromIata: "DEL",
      toCity: "Mumbai",
      toIata: "BOM",
      departureDate: "2026-08-25",
      departureTime: "08:30 AM",
      seat: "12A",
      gate: "T3 - Gate 14",
      terminal: "3",
      status: "Upcoming",
      timeframe: "future",
    },
    {
      pnr: "6E4029",
      airlineName: "IndiGo",
      flightNumber: "6E2014",
      passengerName: "Demo User",
      passengerEmail: "demo@gmail.com",
      fromCity: "Bengaluru",
      fromIata: "BLR",
      toCity: "Goa",
      toIata: "GOI",
      departureDate: "2026-07-10",
      departureTime: "02:15 PM",
      seat: "8F",
      gate: "T1 - Gate 4",
      terminal: "1",
      status: "Completed",
      timeframe: "past",
    },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";

    if (!email) {
      return NextResponse.json({ tickets: [] });
    }

    const foundTickets = SAMPLE_BOOKINGS[email] || [];

    return NextResponse.json({
      email,
      hasBookings: foundTickets.length > 0,
      tickets: foundTickets,
    });
  } catch (e: any) {
    return NextResponse.json({ tickets: [], error: e?.message }, { status: 500 });
  }
}
