// import React, { useState, useEffect } from "react";
// import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// import axios from "axios";

// const AddStation = () => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//   });

//   const [isMapOpen, setIsMapOpen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [formData, setFormData] = useState({ name: "", description: "" });
//   const [statusMessage, setStatusMessage] = useState("");
//   const [loading, setLoading] = useState(false); // Loading state for form submission

//   useEffect(() => {
//     // Get the user's current location (if available) and set the map center
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setSelectedLocation({ latitude, longitude });
//         },
//         () => {
//           console.error("Geolocation not available");
//         }
//       );
//     }
//   }, []);

//   const handleMapClick = (event) => {
//     const latitude = event.latLng.lat();
//     const longitude = event.latLng.lng();
//     setSelectedLocation({ latitude, longitude });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedLocation) {
//       setStatusMessage("Please select a location on the map.");
//       return;
//     }

//     setLoading(true); // Start loading

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "/api/stations",
//         { ...formData, ...selectedLocation },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setStatusMessage("Station added successfully!");
//       setIsMapOpen(false);
//       setSelectedLocation(null);
//       setFormData({ name: "", description: "" });
//     } catch (error) {
//       console.error("Error adding station:", error);
//       setStatusMessage("Failed to add station. Please try again.");
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Loading state for Google Maps API
//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div>
//       {/* Button to open the map */}
//       <button
//         onClick={() => setIsMapOpen(true)}
//         aria-label="Open map to add station"
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Add Station
//       </button>

//       {/* Map to select location */}
//       {isMapOpen && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Select a Location on the Map</h3>
//           <GoogleMap
//             mapContainerStyle={{ width: "100%", height: "400px" }}
//             center={selectedLocation || { lat: 6.9271, lng: 79.8612 }} // Center map on user location or default
//             zoom={10}
//             onClick={handleMapClick}
//           >
//             {selectedLocation && (
//               <Marker
//                 position={{
//                   lat: selectedLocation.latitude,
//                   lng: selectedLocation.longitude,
//                 }}
//               />
//             )}
//           </GoogleMap>
//         </div>
//       )}

//       {/* Feedback message */}
//       {statusMessage && <p>{statusMessage}</p>}

//       {/* Form for station details */}
//       {selectedLocation && (
//         <form onSubmit={handleFormSubmit} style={{ marginTop: "20px" }}>
//           <h3>Enter Station Details</h3>
//           <input
//             type="text"
//             placeholder="Station Name"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, name: e.target.value }))
//             }
//             required
//             className="border p-2 rounded my-2"
//           />
//           <textarea
//             placeholder="Station Description"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, description: e.target.value }))
//             }
//             required
//             className="border p-2 rounded my-2"
//           ></textarea>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white rounded"
//             disabled={loading} // Disable button while loading
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AddStation;

// import React, { useState, useEffect } from "react";
// import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// import axios from "axios";

// const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };
// const MAP_CONTAINER_STYLE = { width: "100%", height: "400px" };

// const AddStation = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   const [isMapOpen, setIsMapOpen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [formData, setFormData] = useState({ name: "", description: "" });
//   const [status, setStatus] = useState({ message: "", type: "" });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setSelectedLocation({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Geolocation error:", error.message);
//         },
//         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//       );
//     }
//   }, []);

//   const handleMapClick = (event) => {
//     const latitude = event.latLng.lat();
//     const longitude = event.latLng.lng();
//     setSelectedLocation({ latitude, longitude });
//   };

//   const resetForm = () => {
//     setFormData({ name: "", description: "" });
//     setSelectedLocation(null);
//     setIsMapOpen(false);
//     setStatus({ message: "", type: "" });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedLocation) {
//       setStatus({
//         message: "Please select a location on the map",
//         type: "error"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       await axios.post(
//         "/api/stations",
//         { ...formData, ...selectedLocation },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           } 
//         }
//       );

//       setStatus({
//         message: "Station added successfully!",
//         type: "success"
//       });
//       resetForm();
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to add station. Please try again.";
//       setStatus({
//         message: errorMessage,
//         type: "error"
//       });
//       console.error("Error adding station:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadError) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <span className="block sm:inline">Error loading Google Maps. Please check your API key and try again.</span>
//       </div>
//     );
//   }

//   if (!isLoaded) {
//     return <div className="flex items-center justify-center p-4">Loading maps...</div>;
//   }

//   const mapCenter = selectedLocation
//     ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
//     : DEFAULT_CENTER;

//   return (
//     <div className="space-y-4">
//       <button
//         onClick={() => setIsMapOpen(true)}
//         disabled={loading}
//         className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
//       >
//         Add Station
//       </button>

//       {isMapOpen && (
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Select Location</h2>
//           <div className="rounded-lg overflow-hidden border">
//             <GoogleMap
//               mapContainerStyle={MAP_CONTAINER_STYLE}
//               center={mapCenter}
//               zoom={10}
//               onClick={handleMapClick}
//               options={{
//                 streetViewControl: false,
//                 mapTypeControl: false,
//                 fullscreenControl: true,
//               }}
//             >
//               {selectedLocation && (
//                 <Marker
//                   position={{
//                     lat: selectedLocation.latitude,
//                     lng: selectedLocation.longitude,
//                   }}
//                 />
//               )}
//             </GoogleMap>
//           </div>
//         </div>
//       )}

//       {status.message && (
//         <div 
//           className={`px-4 py-3 rounded relative ${
//             status.type === "error" 
//               ? "bg-red-100 border border-red-400 text-red-700" 
//               : "bg-green-100 border border-green-400 text-green-700"
//           }`}
//           role="alert"
//         >
//           <span className="block sm:inline">{status.message}</span>
//         </div>
//       )}

//       {selectedLocation && (
//         <form onSubmit={handleFormSubmit} className="space-y-4">
//           <h2 className="text-lg font-semibold">Station Details</h2>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Station Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, name: e.target.value }))
//               }
//               required
//               disabled={loading}
//               aria-label="Station Name"
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <textarea
//               placeholder="Station Description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, description: e.target.value }))
//               }
//               required
//               disabled={loading}
//               aria-label="Station Description"
//               rows={4}
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
//               >
//                 {loading ? "Adding Station..." : "Add Station"}
//               </button>
//               <button 
//                 type="button"
//                 onClick={resetForm}
//                 disabled={loading}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default AddStation;




import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-hot-toast";
import './AddStation.scss';

const MAP_OPTIONS = {
  containerStyle: { width: "100%", height: "100%" },
  defaultCenter: { lat: 6.9271, lng: 79.8612 },
  zoom: 12,
  mapTypeControl: false,
  streetViewControl: false
};

const AddStation = () => {
  const [station, setStation] = useState({
    name: "",
    description: "",
    latitude: null,
    longitude: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stations, setStations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null); // Store selected station for InfoWindow
  const [formPosition, setFormPosition] = useState({ top: 0, left: 0 }); // Track dynamic form position
  const [userLocation, setUserLocation] = useState(null); // User's location

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("/api/stations");
        setStations(response.data);
      } catch (error) {
        toast.error("Failed to fetch stations");
      }
    };

    fetchStations();
    
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => toast.error("Unable to retrieve your location")
      );
    }
  }, []);

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    
    // Set the station's coordinates and show the form
    setStation(prev => ({
      ...prev,
      latitude: clickedLat,
      longitude: clickedLng
    }));
    setShowForm(true);

    // Calculate the form position with an offset to avoid overlap with the marker
    const offsetTop = 50; // offset from the marker (in pixels)
    const offsetLeft = 50; // offset from the marker (in pixels)
    setFormPosition({
      top: `${e.domEvent.clientY - offsetTop}px`,
      left: `${e.domEvent.clientX + offsetLeft}px`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!station.latitude || !station.longitude) {
      toast.error("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/stations", station);
      toast.success("Station added successfully");

      const response = await axios.get("/api/stations");
      setStations(response.data);

      setStation({
        name: "",
        description: "",
        latitude: null,
        longitude: null
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to add station");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div className="h-96 flex items-center justify-center">Loading maps...</div>;

  const customMarkerIcon = {
    url: "favicon.png",
    scaledSize: new window.google.maps.Size(50, 50)
  };

  const userMarkerIcon = {
    url: "marker.png", // Replace with your custom user marker icon path
    scaledSize: new window.google.maps.Size(35, 70)
  };

  return (
    <div className="addStationContainer">
      {/* Station List */}
      <div className="stationListContainer">
        <h3 className="stationListTitle">Stations Added</h3>
        <ul className="stationList">
          {stations.map((station) => (
            <li key={station.id} className="stationCard">
              <h4>{station.name}</h4>
              <p>{station.description}</p>
              <p><strong>Rating:</strong> 4.5 / 5</p>
    <p><strong>Availability:</strong> 5 Slots Available</p>
    <p><strong>Operating Hours:</strong> 8:00 AM - 10:00 PM</p>
    <p><strong>Price per Hour:</strong> $2.50</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Map and Form */}
      <div className="mapContainer">
        <GoogleMap
          mapContainerStyle={MAP_OPTIONS.containerStyle}
          center={station.latitude ? { lat: station.latitude, lng: station.longitude } : MAP_OPTIONS.defaultCenter}
          zoom={MAP_OPTIONS.zoom}
          onClick={handleMapClick}
          options={MAP_OPTIONS}
        >
          {stations.map((station) => (
            <Marker
              key={station.id}
              position={{ lat: station.latitude, lng: station.longitude }}
              icon={customMarkerIcon}
              onClick={() => setSelectedStation(station)}  // Set selected station
            />
          ))}

          {/* InfoWindow to display station details */}
          {selectedStation && (
            <InfoWindow
              position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
              onCloseClick={() => setSelectedStation(null)}  // Close InfoWindow when clicked outside
            >
              <div>
                <h4>{selectedStation.name}</h4>
                <p>{selectedStation.description}</p>
              </div>
            </InfoWindow>
          )}

          {/* Marker for the user's location */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={userMarkerIcon} // Use custom marker for user
            />
          )}

          {station.latitude && (
            <Marker position={{ lat: station.latitude, lng: station.longitude }} />
          )}
        </GoogleMap>

        {/* Form on top of the map */}
        {showForm && (
          <form 
            onSubmit={handleSubmit} 
            className="formContainer"
            style={{ top: formPosition.top, left: formPosition.left }} // Dynamically position the form
          >
            <input
              type="text"
              required
              placeholder="Station Name"
              value={station.name}
              onChange={(e) => setStation(prev => ({ ...prev, name: e.target.value }))} 
              className="inputField"
              disabled={isSubmitting}
            />
            <textarea
              required
              placeholder="Description"
              value={station.description}
              onChange={(e) => setStation(prev => ({ ...prev, description: e.target.value }))} 
              rows={4}
              className="inputField"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="submitButton"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Station..." : "Add Station"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStation;