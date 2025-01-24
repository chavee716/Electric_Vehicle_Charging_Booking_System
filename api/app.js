import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import stationsRoute from "./routes/stations.route.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  "http://192.168.235.216:8081",
  "exp://192.168.235.216:8081",
  "http://192.168.235.216:8800",
  "http://10.0.2.2:8800",
];

// CORS configuration
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/stations", stationsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[App Error]:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 8800;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Backend server is running on http://${HOST}:${PORT}`);
});
