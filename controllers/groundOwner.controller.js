const bcrypt = require('bcryptjs');
const GroundOwner = require('../models/GroundOwner');

// ----------------------- Ground Owner Management -----------------------

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
      password: hashedPassword,
    });

    await newGroundOwner.save();
    res.status(201).json({ message: 'Registration successful, awaiting admin approval.' });
  } catch (error) {
    console.error('Error registering ground owner:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch all ground owners
exports.getGroundOwners = async (req, res) => {
  try {
    const owners = await GroundOwner.find();
    res.status(200).json({ success: true, owners });
  } catch (error) {
    console.error('Error fetching ground owners:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Approve a ground owner
exports.approveGroundOwner = async (req, res) => {
  try {
    const owner = await GroundOwner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Ground owner not found' });
    }

    owner.status = 'verified';
    await owner.save();
    res.status(200).json({ success: true, message: 'Ground owner approved' });
  } catch (error) {
    console.error('Error approving ground owner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reject a ground owner
exports.rejectGroundOwner = async (req, res) => {
  try {
    const owner = await GroundOwner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Ground owner not found' });
    }

    res.status(200).json({ success: true, message: 'Ground owner rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting ground owner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
