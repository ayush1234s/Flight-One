"use client";

import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 22.5937,
  lng: 78.9629, // India center
};

const FlightMap = ({ flights }: { flights: any[] }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded)
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      options={{
        disableDefaultUI: true,
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {flights.map((f, i) => {
        const lat = f[6];
        const lng = f[5];

        if (!lat || !lng) return null;

        return (
          <Marker
            key={i}
            position={{ lat, lng }}
            icon={{
              url: "/plane.png",
              scaledSize: new window.google.maps.Size(30, 30),
              rotation: f[10] || 0,
            }}
          />
        );
      })}
    </GoogleMap>
  );
};

export default FlightMap;
