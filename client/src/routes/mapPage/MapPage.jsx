// routes/mapPage/MapPage.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./mapPage.scss";

// Custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "marker.png", // Replace with your own icon URL
  iconSize: [35, 75], // Adjust the size of the icon
  iconAnchor: [20, 40], // Point of the icon which will correspond to the marker's location
  popupAnchor: [0, -40] // Position of the popup relative to the icon
});

function MapPage() {
    const [position, setPosition] = useState([6.0326, 80.2170]); // Default position
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);

          // Pan to the new position if the map instance exists
          if (map) {
            map.flyTo([latitude, longitude], 13, {
              animate: true,
              duration: 1.5, // Smooth animation duration in seconds
            });
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true, // Use GPS if available
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [map]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      whenCreated={setMap} // Store the map instance
      className="map"
    >
      <TileLayer
       url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
      />
      <Marker position={position} icon={customMarkerIcon}>
        <Popup>Your Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapPage;
