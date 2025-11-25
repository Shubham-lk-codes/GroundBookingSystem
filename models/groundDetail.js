const mongoose = require("mongoose");

const groundDetailSchema = new mongoose.Schema({
  ground: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ground", // Reference to the Ground model
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0, // Average rating of the ground
  },
  speciality: {
    type: String,
    required: true, // Example: "Football", "Cricket", "Tennis"
    trim: true,
  },
  availability: {
    type: [
      {
        day: { type: String }, // Example: "Monday", "Tuesday"
        openTime: { type: String }, // Example: "06:00 AM"
        closeTime: { type: String }, // Example: "10:00 PM"
      },
    ],
    default: [],
  },
  sliderImages: {
    type: [String], // Array of image URLs for carousel/gallery
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GroundDetail", groundDetailSchema);
