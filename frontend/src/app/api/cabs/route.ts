import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CabOption = {
  id: string;
  provider: "Uber" | "Ola" | "Rapido";
  category: "Bike" | "Auto" | "Car";
  type: string;
  priceInr: number;
  etaMins: number;
  distanceKm: number;
  icon: string;
  isLowestInCategory?: boolean;
  bookingUrl: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pickup = searchParams.get("pickup") || "Current Location";
    const drop = searchParams.get("drop") || "Destination";
    const vehicleType = searchParams.get("vehicleType") || "ALL";

    // Estimate realistic distance (default ~10 km if not specified)
    let km = 10;
    if (drop.toLowerCase().includes("airport")) km = 18;
    else if (drop.toLowerCase().includes("station")) km = 8;

    // Real-world Indian cab fare pricing
    const rawOptions: CabOption[] = [
      // BIKES
      {
        id: "rapido-bike",
        provider: "Rapido",
        category: "Bike",
        type: "Rapido Bike",
        priceInr: Math.round(30 + km * 7.5),
        etaMins: Math.max(2, Math.round(km * 1.6)),
        distanceKm: km,
        icon: "🏍️",
        bookingUrl: "https://www.rapido.bike/",
      },
      {
        id: "ola-bike",
        provider: "Ola",
        category: "Bike",
        type: "Ola Bike",
        priceInr: Math.round(32 + km * 8.0),
        etaMins: Math.max(3, Math.round(km * 1.8)),
        distanceKm: km,
        icon: "🏍️",
        bookingUrl: `https://book.olacabs.com/?pickup_name=${encodeURIComponent(pickup)}&drop_name=${encodeURIComponent(drop)}`,
      },
      {
        id: "uber-moto",
        provider: "Uber",
        category: "Bike",
        type: "Uber Moto",
        priceInr: Math.round(35 + km * 8.5),
        etaMins: Math.max(2, Math.round(km * 1.5)),
        distanceKm: km,
        icon: "🏍️",
        bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(drop)}`,
      },

      // AUTOS
      {
        id: "rapido-auto",
        provider: "Rapido",
        category: "Auto",
        type: "Rapido Auto",
        priceInr: Math.round(40 + km * 12.0),
        etaMins: Math.max(3, Math.round(km * 2.1)),
        distanceKm: km,
        icon: "🛺",
        bookingUrl: "https://www.rapido.bike/",
      },
      {
        id: "ola-auto",
        provider: "Ola",
        category: "Auto",
        type: "Ola Auto",
        priceInr: Math.round(42 + km * 12.5),
        etaMins: Math.max(3, Math.round(km * 2.2)),
        distanceKm: km,
        icon: "🛺",
        bookingUrl: `https://book.olacabs.com/?pickup_name=${encodeURIComponent(pickup)}&drop_name=${encodeURIComponent(drop)}`,
      },
      {
        id: "uber-auto",
        provider: "Uber",
        category: "Auto",
        type: "Uber Auto",
        priceInr: Math.round(45 + km * 13.0),
        etaMins: Math.max(3, Math.round(km * 2.1)),
        distanceKm: km,
        icon: "🛺",
        bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(drop)}`,
      },

      // CARS / CABS
      {
        id: "rapido-cab",
        provider: "Rapido",
        category: "Car",
        type: "Rapido Cab Go",
        priceInr: Math.round(75 + km * 17.0),
        etaMins: Math.max(4, Math.round(km * 2.4)),
        distanceKm: km,
        icon: "🚗",
        bookingUrl: "https://www.rapido.bike/",
      },
      {
        id: "ola-mini",
        provider: "Ola",
        category: "Car",
        type: "Ola Mini",
        priceInr: Math.round(80 + km * 18.0),
        etaMins: Math.max(4, Math.round(km * 2.3)),
        distanceKm: km,
        icon: "🚕",
        bookingUrl: `https://book.olacabs.com/?pickup_name=${encodeURIComponent(pickup)}&drop_name=${encodeURIComponent(drop)}`,
      },
      {
        id: "uber-go",
        provider: "Uber",
        category: "Car",
        type: "Uber Go",
        priceInr: Math.round(85 + km * 18.5),
        etaMins: Math.max(4, Math.round(km * 2.2)),
        distanceKm: km,
        icon: "🚗",
        bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(drop)}`,
      },
      {
        id: "ola-prime",
        provider: "Ola",
        category: "Car",
        type: "Ola Prime Sedan",
        priceInr: Math.round(105 + km * 22.0),
        etaMins: Math.max(5, Math.round(km * 2.3)),
        distanceKm: km,
        icon: "🚖",
        bookingUrl: `https://book.olacabs.com/?pickup_name=${encodeURIComponent(pickup)}&drop_name=${encodeURIComponent(drop)}`,
      },
      {
        id: "uber-premier",
        provider: "Uber",
        category: "Car",
        type: "Uber Premier",
        priceInr: Math.round(110 + km * 23.0),
        etaMins: Math.max(5, Math.round(km * 2.2)),
        distanceKm: km,
        icon: "🚘",
        bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(drop)}`,
      },
      {
        id: "uber-xl",
        provider: "Uber",
        category: "Car",
        type: "Uber XL (SUV)",
        priceInr: Math.round(160 + km * 30.0),
        etaMins: Math.max(6, Math.round(km * 2.5)),
        distanceKm: km,
        icon: "🚙",
        bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(drop)}`,
      },
    ];

    // Filter by vehicle type if specified
    let filtered = rawOptions;
    if (vehicleType !== "ALL") {
      filtered = rawOptions.filter((o) => o.category === vehicleType);
    }

    // Sort by price ascending
    filtered.sort((a, b) => a.priceInr - b.priceInr);

    // Mark lowest price in category
    const lowestBike = rawOptions.filter((o) => o.category === "Bike").sort((a, b) => a.priceInr - b.priceInr)[0];
    const lowestAuto = rawOptions.filter((o) => o.category === "Auto").sort((a, b) => a.priceInr - b.priceInr)[0];
    const lowestCar = rawOptions.filter((o) => o.category === "Car").sort((a, b) => a.priceInr - b.priceInr)[0];

    const result = filtered.map((o) => ({
      ...o,
      isLowestInCategory:
        (o.category === "Bike" && o.id === lowestBike?.id) ||
        (o.category === "Auto" && o.id === lowestAuto?.id) ||
        (o.category === "Car" && o.id === lowestCar?.id),
    }));

    return NextResponse.json({
      pickup,
      drop,
      distanceKm: km,
      cabs: result,
      cheapest: {
        bike: lowestBike ? `${lowestBike.provider} (${lowestBike.type}) - ₹${lowestBike.priceInr}` : null,
        auto: lowestAuto ? `${lowestAuto.provider} (${lowestAuto.type}) - ₹${lowestAuto.priceInr}` : null,
        car: lowestCar ? `${lowestCar.provider} (${lowestCar.type}) - ₹${lowestCar.priceInr}` : null,
      },
    });
  } catch (e: any) {
    console.error("Cab search route error:", e);
    return NextResponse.json(
      { error: "Cab search failed", message: e?.message || "unknown error" },
      { status: 500 }
    );
  }
}
