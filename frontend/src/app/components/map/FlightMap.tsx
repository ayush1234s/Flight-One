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
  height: "720px",
  borderRadius: "16px",
};

const center = {
  lat: 22.5937,
  lng: 78.9629, // Center over India & South Asia
};

type LivePlane = {
  id: string;
  callsign: string;
  country: string;
  lat: number;
  lng: number;
  altitudeM: number;
  speedKmh: number;
  heading: number;
};

// Crisp SVG airplane vector icon pointing upwards (0 deg)
const PLANE_SVG_PATH =
  "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

const FlightMap = ({ planes }: { planes: LivePlane[] }) => {
  const [selectedPlane, setSelectedPlane] = useState<LivePlane | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return (
      <div className="h-[720px] w-full rounded-2xl bg-gray-950 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-3">✈️</span>
        <h3 className="text-xl font-bold text-white mb-2">Live Air Radar Active</h3>
        <p className="text-gray-400 text-sm max-w-md">
          Tracking {planes.length} real airborne aircraft in real-time.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[720px] w-full rounded-2xl bg-gray-950/60 border border-white/10 flex flex-col items-center justify-center text-gray-400">
        <div className="animate-spin h-8 w-8 border-2 border-yellow-400 border-t-transparent rounded-full mb-3"></div>
        <span>Connecting to Global Air Traffic Radar...</span>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Live Counter Badge overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 border border-yellow-500/40 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2.5 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
        <div className="text-xs">
          <strong className="text-yellow-400 font-mono text-sm block leading-tight">
            {planes.length} Real Airborne Planes
          </strong>
          <span className="text-gray-400 text-[10px]">Live OpenSky Aviation Stream</span>
        </div>
      </div>

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
              stylers: [{ color: "#212121" }],
            },
            {
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#212121" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "administrative.country",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9e9e9e" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#3d3d3d" }],
            },
          ],
        }}
      >
        {planes.map((p, i) => {
          if (!p.lat || !p.lng) return null;

          return (
            <Marker
              key={`${p.id}-${i}`}
              position={{ lat: p.lat, lng: p.lng }}
              onClick={() => setSelectedPlane(p)}
              icon={{
                path: PLANE_SVG_PATH,
                fillColor: "#FFD700", // Bright Yellow (matching Flightradar screenshot!)
                fillOpacity: 1,
                strokeColor: "#000000",
                strokeWeight: 0.8,
                scale: 1.1,
                anchor: new window.google.maps.Point(12, 12),
                rotation: p.heading || 0,
              }}
            />
          );
        })}

        {selectedPlane && selectedPlane.lat && selectedPlane.lng && (
          <InfoWindow
            position={{
              lat: selectedPlane.lat,
              lng: selectedPlane.lng,
            }}
            onCloseClick={() => setSelectedPlane(null)}
          >
            <div className="p-2 text-black max-w-xs font-sans">
              <div className="flex items-center justify-between gap-2 border-b pb-2 mb-2">
                <div>
                  <h4 className="font-bold text-base text-gray-900">{selectedPlane.callsign}</h4>
                  <p className="text-xs text-gray-600">Country: <strong>{selectedPlane.country}</strong></p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-yellow-400 text-black border border-black/20">
                  AIRBORNE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 bg-gray-100 p-2 rounded-lg">
                <p>Altitude: <strong>{selectedPlane.altitudeM ? `${selectedPlane.altitudeM.toLocaleString()} m` : "—"}</strong></p>
                <p>Speed: <strong>{selectedPlane.speedKmh ? `${selectedPlane.speedKmh} km/h` : "—"}</strong></p>
                <p>Heading: <strong>{selectedPlane.heading}°</strong></p>
                <p>ICAO: <strong className="font-mono text-xs">{selectedPlane.id}</strong></p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default FlightMap;
