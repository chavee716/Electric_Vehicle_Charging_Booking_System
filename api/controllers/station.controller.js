import prisma from '../lib/prisma.js'; // Import Prisma client
import { ObjectId } from 'mongodb';

export const addStation = async (req, res) => {
  const { name, description, latitude, longitude, userId } = req.body;

  // Validate userId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const newStation = await prisma.station.create({
      data: {
        name,
        description,
        latitude,
        longitude,
        userId,
      },
    });
    res.status(201).json(newStation);
  } catch (error) {
    console.error('Error adding station:', error);
    res.status(500).json({ error: 'Failed to add station' });
  }
};
