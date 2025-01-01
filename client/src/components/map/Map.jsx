import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useState } from "react";
import axios from "axios";

function Map({ items }) {
  const [newStations, setNewStations] = useState([]);

  // Function to handle map clicks and add a new station
  const AddStationHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.lat && e.lng;
        const name = prompt("Enter the station name:");
        const description = prompt("Enter a description:");

        if (name && description) {
          try {
            // Send new station to the backend
            const response = await axios.post("/api/stations", {
              name,
              description,
              latitude: lat,
              longitude: lng,
            });

            // Add the newly created station to local state to display on the map
            setNewStations([...newStations, response.data]);
          } catch (error) {
            console.error("Failed to add station", error);
          }
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [52.4797, -1.90269]
      }
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render existing pins */}
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}

      {/* Render newly added stations */}
      {newStations.map((station) => (
        <Pin item={station} key={station.id} />
      ))}

      {/* Capture map clicks to add stations */}
      <AddStationHandler />
    </MapContainer>
  );
}

export default Map;
