import express from "express";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
} from "../controllers/location.controller.js";

const router = express.Router();

router.post("/create", createLocation); // Create a location
router.get("/locations", getAllLocations); // Get all locations
router.get("/locations/:id", getLocationById); // Get location by ID
router.put("/update/:id", updateLocation); // Update location by ID
router.delete("/locations/:id", deleteLocation); // Delete location by ID

export default router;
