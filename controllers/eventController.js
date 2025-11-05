const Event = require("../models/Event");

// ✅ Create a new sport event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      sportType,
      date,
      time,
      venue,
      description,
      maxParticipants,
    } = req.body;

    if (!title || !sportType || !date || !time || !venue) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newEvent = new Event({
      title,
      sportType,
      date,
      time,
      venue,
      description,
      maxParticipants,
      createdBy: req.user.id, // user ID from token middleware
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ✅ Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("venue", "name location")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("venue", "name location")
      .populate("participants", "name email");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Join event
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (event.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already joined" });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: "Event full" });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Joined event successfully",
      event,
    });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
