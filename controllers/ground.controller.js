const Ground = require('../models/ground');

// Add a new ground

const addGround = async (req, res) => {
  const { name, location, amenities, pricePerHour, description } = req.body;

  try {
    // Debug logs to check received data
    console.log("📥 Incoming ground data:", req.body);
    console.log("🖼️ Uploaded file info:", req.file);

    // Check for uploaded file
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "Image is required" });
    }

    // Validate required fields
    if (!name || !location || !amenities || !pricePerHour || !description) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // Create a new ground document
    const newGround = new Ground({
      name,
      location,
      amenities: amenities.split(",").map((item) => item.trim()),
      pricePerHour,
      description,
      imageUrl: req.file.path, // Cloudinary URL
    });
-
    await newGround.save();

    console.log("✅ Ground added successfully:", newGround);

    res
      .status(201)
      .json({ success: true, msg: "Ground added successfully", ground: newGround });
  } catch (err) {
    console.error("❌ Error adding ground:", err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      msg: err.message || "Server error",
      error: err.stack,
    });
  }
};


// Retrieve all grounds
const allGround = async (req, res) => {
  try {
    const grounds = await Ground.find();

    if (!grounds || grounds.length === 0) {
      return res.status(404).json({ success: false, msg: 'No grounds found' });
    }

    res.status(200).json({ success: true, grounds });
  } catch (err) {
    console.error('Error retrieving grounds:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Update an existing ground
const updateGround = async (req, res) => {
  const { name, location, amenities, pricePerHour, description } = req.body;

  try {
    const ground = await Ground.findById(req.params.id);
    if (!ground) {
      return res.status(404).json({ success: false, msg: 'Ground not found' });
    }

    // Update fields
    ground.name = name || ground.name;
    ground.location = location || ground.location;
    ground.amenities = amenities ? amenities.split(',').map(item => item.trim()) : ground.amenities;
    ground.pricePerHour = pricePerHour || ground.pricePerHour;
    ground.description = description || ground.description;

    // Update image if a new one is provided
    if (req.file) {
      ground.imageUrl = req.file.path;
    }

    await ground.save();
    res.status(200).json({ success: true, msg: 'Ground updated successfully', ground });
  } catch (err) {
    console.error('Error updating ground:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Delete a ground
const deleteGround = async (req, res) => {
  try {
    const ground = await Ground.findByIdAndDelete(req.params.id);
    if (!ground) {
      return res.status(404).json({ success: false, msg: 'Ground not found' });
    }

    res.status(200).json({ success: true, msg: 'Ground deleted successfully' });
  } catch (err) {
    console.error('Error deleting ground:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = { addGround, allGround, updateGround, deleteGround };
