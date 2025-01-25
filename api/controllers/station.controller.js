import prisma from "../lib/prisma.js";

export const getStations = async (req, res) => {
  try {
    const stations = await prisma.station.findMany();
    res.status(200).json(stations);
  } catch (error) {
    console.error("[Station Controller] Error fetching stations:", error);
    res.status(500).json({ 
      error: "Failed to fetch stations", 
      details: error.message 
    });
  }
};

export const addStation = async (req, res) => {
  const { name, description, latitude, longitude } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newStation = await prisma.station.create({
      data: {
        name,
        description: description || "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: req.user?.id || ""  // Use empty string instead of null
      }
    });

    res.status(201).json(newStation);
  } catch (error) {
    console.error("[Station Controller] Error adding station:", error);
    res.status(500).json({ 
      error: "Failed to add station", 
      details: error.message 
    });
  }
};