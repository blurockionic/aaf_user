import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    clerk_id: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: [
      {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set default expiry to 90 days from now
      index: { expires: "30d" }, // TTL index to automatically remove the document after 90 days
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
