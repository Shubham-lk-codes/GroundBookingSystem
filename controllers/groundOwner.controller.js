const bcrypt = require('bcryptjs');
const GroundOwner = require('../models/GroundOwner');
const GroundDetail = require('../models/groundDetail');

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



// ✅ Add or Update Speciality, Images, and Availability
exports.addOrUpdateGroundDetails = async (req, res) => {
  try {
    const { groundId, speciality, availability, sliderImages } = req.body;

    if (!groundId || !speciality) {
      return res.status(400).json({ success: false, msg: "Ground ID and speciality are required" });
    }

    // Find existing ground detail or create new
    let groundDetail = await GroundDetail.findOne({ ground: groundId });

    if (!groundDetail) {
      groundDetail = new GroundDetail({
        ground: groundId,
        speciality,
        availability,
        sliderImages,
      });
    } else {
      groundDetail.speciality = speciality || groundDetail.speciality;
      groundDetail.availability = availability || groundDetail.availability;
      groundDetail.sliderImages = sliderImages || groundDetail.sliderImages;
    }

    await groundDetail.save();

    res.status(200).json({
      success: true,
      msg: "Ground details updated successfully",
      data: groundDetail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Get Ground Details (for owner/admin)
exports.getGroundDetails = async (req, res) => {
  try {
    const { groundId } = req.params;

    const groundDetail = await GroundDetail.findOne({ ground: groundId }).populate('ground');

    if (!groundDetail) {
      return res.status(404).json({ success: false, msg: "Ground details not found" });
    }

    res.status(200).json({
      success: true,
      data: groundDetail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

