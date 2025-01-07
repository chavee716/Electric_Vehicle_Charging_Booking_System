import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import stationsRoute from './routes/stations.js';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

dotenv.config();
const app = express();

// Corrected the CORS configuration:
app.use(cors({
    credentials: true,
    origin: [
      "http://localhost:5173",   // Web app
      "http://localhost:8081",    // Mobile app
      "http://192.168.167.216:8081",  
      "exp://192.168.167.216:8081" , // Expo Go app
      
    ]
}));
  
  // Also update the listening configuration to accept connections from all network interfaces
  app.listen(8800, '0.0.0.0', () => {
      console.log("Backend server is running on http://192.168.167.216:8800");
  }); 
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.use("/api/stations", stationsRoute); 


/*app.listen(8800, () => {
    console.log("Backend server is running!");
});*/