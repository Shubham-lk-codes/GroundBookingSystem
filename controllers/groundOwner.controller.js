// controllers/groundOwner.controller.js
const bcrypt = require('bcryptjs');
const GroundOwner = require('../models/GroundOwner');

// Register a new ground owner
exports.registerGroundOwner = async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;

    // Check if the email already exists
    const existingOwner = await GroundOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new ground owner
    const newGroundOwner = new GroundOwner({
      name,
      email,
      contact,
      password: hashedPassword
    });

    await newGroundOwner.save();
    res.status(201).json({ message: 'Registration successful, awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
