import prisma from "../lib/prisma.js";

// Add a new station
export const addStation = async (req, res) => {
  const { name, description, latitude, longitude } = req.body;

  console.log("[Station Controller] Adding new station:", { name, description, latitude, longitude });

  if (!name || !latitude || !longitude) {
    console.log("[Station Controller] Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stationData = {
      name,
      description: description || "",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    // Only add userId if user is logged in
    if (req.user?.id) {
      stationData.userId = req.user.id;
    }

    const newStation = await prisma.station.create({
      data: stationData,
    });

    console.log("[Station Controller] Successfully created station:", newStation);
    res.status(201).json(newStation);
  } catch (error) {
    console.error("[Station Controller] Error adding station:", error);
    res.status(500).json({ error: "Failed to add station", details: error.message });
  }
};

// Fetch all stations
export const getStations = async (req, res) => {
  console.log("[Station Controller] Fetching all stations");
  try {
    const stations = await prisma.station.findMany();
    console.log(`[Station Controller] Found ${stations.length} stations`);
    res.status(200).json(stations);
  } catch (error) {
    console.error("[Station Controller] Error fetching stations:", error);
    res.status(500).json({ error: "Failed to fetch stations", details: error.message });
  }
};
