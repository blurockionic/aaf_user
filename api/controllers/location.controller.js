import Location from "../models/location.model.js";

// Create a new location
export const createLocation = async (req, res) => {
  try {
    const { fullName, clerk_id, email, phone, location } = req.body;

    const newLocation = new Location({
      fullName,
      clerk_id,
      email,
      phone,
      location,
    });

    await newLocation.save();
    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: newLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create location",
      error: error.message,
    });
  }
};

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve locations",
      error: error.message,
    });
  }
};

// Get a specific location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }
    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve location",
      error: error.message,
    });
  }
};

// Update a specific location by ID
export const updateLocation = async (req, res) => {
  try {
    console.log("working")
    const { location } = req.body;

    console.log(req.body);

    const updatedLocation = await Location.findOneAndUpdate(
      { clerk_id: req.params.id },
      { $push: { location } }, // Push new location points to the array
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: updatedLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update location",
      error: error.message,
    });
  }
};

// Delete a location by ID

export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete location",
      error: error.message,
    });
  }
};
