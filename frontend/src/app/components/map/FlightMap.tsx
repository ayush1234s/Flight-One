"use client";

import { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "650px",
  borderRadius: "16px",
};

const center = {
  lat: 22.5937,
  lng: 78.9629, // Center of India
};

type Flight = {
  flightNumber: string;
  airline: { name: string; iata: string; icao: string };
  position: { lat: number | null; lng: number | null };
  altitudeM: number | null;
  speedKmh: number | null;
  direction: number | null;
  status: string;
  isInternational?: boolean;
  departure: {
    iata: string;
    city: string;
    country: string;
    flag: string;
  };
  arrival: {
    iata: string;
    city: string;
    country: string;
    flag: string;
  };
  aircraft: { type: string; registration: string };
};

const FlightMap = ({ flights }: { flights: Flight[] }) => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return (
      <div className="h-[650px] w-full rounded-2xl bg-gray-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-3">✈️</span>
        <h3 className="text-xl font-bold text-white mb-2">Interactive Flight Radar Active</h3>
        <p className="text-gray-400 text-sm max-w-md">
          Displaying {flights.length} active planes flying in India and international airspace.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[650px] w-full rounded-2xl bg-gray-900/50 border border-white/10 flex flex-col items-center justify-center text-gray-400">
        <div className="animate-spin h-8 w-8 border-2 border-sky-400 border-t-transparent rounded-full mb-3"></div>
        <span>Loading Live Flight Map...</span>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          styles: [
            {
              elementType: "geometry",
              stylers: [{ color: "#1d2c4d" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#8ec3b9" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1a3646" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4b687a" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0e1626" }],
            },
          ],
        }}
      >
        {flights.map((f, i) => {
          const lat = f.position?.lat;
          const lng = f.position?.lng;

          if (!lat || !lng) return null;

          return (
            <Marker
              key={`${f.flightNumber}-${i}`}
              position={{ lat, lng }}
              onClick={() => setSelectedFlight(f)}
              icon={{
                url: "/airplane.png",
                scaledSize: new window.google.maps.Size(28, 28),
                anchor: new window.google.maps.Point(14, 14),
                rotation: f.direction || 0,
              }}
            />
          );
        })}

        {selectedFlight && selectedFlight.position?.lat && selectedFlight.position?.lng && (
          <InfoWindow
            position={{
              lat: selectedFlight.position.lat,
              lng: selectedFlight.position.lng,
            }}
            onCloseClick={() => setSelectedFlight(null)}
          >
            <div className="p-2 text-black max-w-xs font-sans">
              <div className="flex items-center justify-between gap-2 border-b pb-2 mb-2">
                <div>
                  <h4 className="font-bold text-base text-gray-900">{selectedFlight.flightNumber}</h4>
                  <p className="text-xs text-gray-600">{selectedFlight.airline.name}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  selectedFlight.isInternational ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {selectedFlight.isInternational ? "International" : "Domestic"}
                </span>
              </div>

              {/* Origin & Destination Countries */}
              <div className="bg-gray-100 p-2 rounded-lg text-xs mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span>{selectedFlight.departure.flag} <strong>{selectedFlight.departure.country}</strong></span>
                  <span className="font-mono text-gray-600">({selectedFlight.departure.iata})</span>
                </div>
                <div className="text-center text-sky-600 font-bold my-0.5">✈️</div>
                <div className="flex justify-between items-center">
                  <span>{selectedFlight.arrival.flag} <strong>{selectedFlight.arrival.country}</strong></span>
                  <span className="font-mono text-gray-600">({selectedFlight.arrival.iata})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700">
                <p>Altitude: <strong>{selectedFlight.altitudeM ? `${selectedFlight.altitudeM}m` : "—"}</strong></p>
                <p>Speed: <strong>{selectedFlight.speedKmh ? `${selectedFlight.speedKmh} km/h` : "—"}</strong></p>
                <p>Aircraft: <strong>{selectedFlight.aircraft.type}</strong></p>
                <p>Status: <strong className="text-emerald-600">{selectedFlight.status}</strong></p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default FlightMap;
