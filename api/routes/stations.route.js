import express from "express";
import { addStation, getStations } from "../controllers/station.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logging middleware for stations routes
router.use((req, res, next) => {
  console.log(`[Stations Route] ${req.method} ${req.originalUrl}`);
  next();
});

// GET stations endpoint
router.get("/", async (req, res, next) => {
  console.log("[Stations Route] Attempting to fetch stations");
  try {
    await getStations(req, res);
  } catch (error) {
    console.error("[Stations Route] Error in GET /:", error);
    next(error);
  }
});

// POST station endpoint (protected by auth)
router.post("/", authMiddleware, async (req, res, next) => {
  console.log("[Stations Route] Attempting to add station");
  try {
    await addStation(req, res);
  } catch (error) {
    console.error("[Stations Route] Error in POST /:", error);
    next(error);
  }
});

export default router;