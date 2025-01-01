import express from 'express';
import { addStation } from '../controllers/station.controller.js'; // Import the controller function

const router = express.Router();

// POST route to add a new station
router.post('/', addStation);

export default router;
