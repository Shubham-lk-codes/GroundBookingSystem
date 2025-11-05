const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
} = require("../controllers/eventController");

const authMiddleware =require("../midelwere/authMiddleware")// if you already have JWT auth

// ✅ Create a new event (only logged-in users)
router.post("/create", createEvent);

// ✅ Get all events
router.get("/", getAllEvents);

// ✅ Get single event by ID
router.get("/:id", getEventById);

// ✅ Join event
router.post("/:id/join", joinEvent);

module.exports = router;
