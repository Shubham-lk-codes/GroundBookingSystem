const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  sportType: {
    type: String,
    required: true,
    enum: ["Football", "Cricket", "Badminton", "Tennis", "Basketball", "Other"],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ground", // Reference to your Ground model
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  maxParticipants: {
    type: Number,
    default: 20,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Event", eventSchema);
