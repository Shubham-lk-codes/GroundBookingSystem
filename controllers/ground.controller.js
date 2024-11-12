const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ground = require("../models/ground.js");
const generateTokenAndSetCookie = require("../utils/generateTokenandSetCookeiForGround.js");
const dotenv = require("dotenv");

dotenv.config();

// Add a new ground
const addGround = async (req, res) => {
    const { name, location, amenities, pricePerHour, description } = req.body;

    try {
        // Validate input
        if (!name || !location || !amenities || !pricePerHour || !description) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }

        // Create new ground document
        const newGround = new Ground({ name, location, amenities, pricePerHour, description });
        await newGround.save();

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(res, newGround._id);

        // Send response
        res.status(201).json({
            success: true,
            msg: "Ground added successfully!",
            ground: { id: newGround._id, name: newGround.name, location: newGround.location },
            token,
        });
    } catch (err) {
        console.error("Error adding ground:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Retrieve all grounds
const allGround = async (req, res) => {
    try {
        // Fetch all grounds from the database
        const grounds = await Ground.find();

        // Check if no grounds exist
        if (!grounds || grounds.length === 0) {
            return res.status(404).json({ success: false, msg: 'No grounds found' });
        }

        // Send response with all grounds
        res.status(200).json({
            success: true,
            grounds,
        });
    } catch (err) {
        console.error("Error retrieving grounds:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Update an existing ground
const updateGround = async (req, res) => {
    const { name, location, amenities, pricePerHour, description } = req.body;

    try {
        // Find the ground by ID
        const ground = await Ground.findById(req.params.id);
        if (!ground) {
            return res.status(404).json({ success: false, msg: 'Ground not found' });
        }

        // Update fields if provided
        ground.name = name || ground.name;
        ground.location = location || ground.location;
        ground.amenities = amenities || ground.amenities;
        ground.pricePerHour = pricePerHour || ground.pricePerHour;
        ground.description = description || ground.description;

        // Save updated ground
        await ground.save();

        // Generate token for updated ground and set cookie
        const token = generateTokenAndSetCookie(res, ground._id);

        // Send response with updated ground details
        res.status(200).json({
            success: true,
            msg: 'Ground updated successfully',
            ground: { id: ground._id, name: ground.name, location: ground.location },
            token,
        });
    } catch (err) {
        console.error("Error updating ground:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Delete a ground
const deleteGround = async (req, res) => {
    try {
        // Find and delete the ground by ID
        const ground = await Ground.findByIdAndDelete(req.params.id);
        if (!ground) {
            return res.status(404).json({ success: false, msg: 'Ground not found' });
        }

        // Send success response
        res.status(200).json({ success: true, msg: 'Ground deleted successfully' });
    } catch (err) {
        console.error("Error deleting ground:", err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

module.exports = { addGround, allGround, updateGround, deleteGround };
