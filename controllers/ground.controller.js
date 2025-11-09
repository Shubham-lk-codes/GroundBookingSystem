const Ground = require('../models/ground');
const GroundDetail = require('../models/groundDetail');
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


// GET /grounds
const allGround = async (req, res) => {
  try {
    const grounds = await Ground.find();

    if (!grounds || grounds.length === 0) {
      return res.status(404).json({ success: false, msg: 'No grounds found' });
    }

    // Merge with GroundDetail
    const groundsWithDetails = await Promise.all(
      grounds.map(async (ground) => {
        const details = await GroundDetail.findOne({ ground: ground._id });
        return { ...ground.toObject(), details };
      })
    );

    res.status(200).json({ success: true, grounds: groundsWithDetails });
  } catch (err) {
    console.error('Error retrieving grounds:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// GET /grounds/:id
const getGroundById = async (req, res) => {
  try {
    const { id } = req.params;

    const ground = await Ground.findById(id);
    if (!ground) {
      return res.status(404).json({ success: false, msg: 'Ground not found' });
    }

    const details = await GroundDetail.findOne({ ground: id });
    res.status(200).json({ success: true, ground: { ...ground.toObject(), details } });
  } catch (err) {
    console.error('Error retrieving ground:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


// Update an existing ground
// const updateGround = async (req, res) => {
//   const { name, location, amenities, pricePerHour, description,speciality } = req.body;

//   try {
//     const ground = await Ground.findById(req.params.id);
//     if (!ground) {
//       return res.status(404).json({ success: false, msg: 'Ground not found' });
//     }

//     // Update fields
//     ground.name = name || ground.name;
//     ground.location = location || ground.location;
//     ground.amenities = amenities ? amenities.split(',').map(item => item.trim()) : ground.amenities;
//     ground.pricePerHour = pricePerHour || ground.pricePerHour;
//     ground.description = description || ground.description;
//     ground.speciality = speciality || ground.speciality;

//     // Update image if a new one is provided
//     if (req.file) {
//       ground.imageUrl = req.file.path;
//     }

//     await ground.save();
//     res.status(200).json({ success: true, msg: 'Ground updated successfully', ground });
//   } catch (err) {
//     console.error('Error updating ground:', err);
//     res.status(500).json({ success: false, msg: 'Server error' });
//   }
// };



// 🧩 Update or create GroundDetail linked to a Ground
const updateGround = async (req, res) => {
  const { speciality, rating, availability, sliderImages } = req.body;
  const { groundId } = req.params; // Ground ID from URL

  try {
    // 🔍 Step 1: Ensure ground exists
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return res.status(404).json({ success: false, msg: 'Ground not found' });
    }

    // 🔍 Step 2: Check if GroundDetail already exists for this ground
    let groundDetail = await GroundDetail.findOne({ ground: groundId });

    if (!groundDetail) {
      // Create new GroundDetail if none exists
      groundDetail = new GroundDetail({
        ground: groundId,
        speciality,
        rating,
        availability,
        sliderImages,
      });
    } else {
      // Update existing fields
      if (speciality) groundDetail.speciality = speciality;
      if (rating !== undefined) groundDetail.rating = rating;
      if (availability) groundDetail.availability = availability;
      if (sliderImages) groundDetail.sliderImages = sliderImages;
    }

    await groundDetail.save();

    // 🧩 Step 3: Populate ground info for response
    const populatedDetail = await groundDetail.populate('ground');

    res.status(200).json({
      success: true,
      msg: 'GroundDetail updated successfully',
      groundDetail: populatedDetail,
    });
  } catch (err) {
    console.error('Error updating GroundDetail:', err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = { updateGround };


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

const updateGroundSpeciality = async (req, res) => {
  const { speciality } = req.body; // sirf speciality change karni hai
  const { id } = req.params; // Ground ka ID aaega params se

  try {
    // Pehle check karo kya groundDetail exist karta hai
    let groundDetail = await GroundDetail.findOne({ ground: id });

    // Agar nahi mila toh naya create karo
    if (!groundDetail) {
      groundDetail = new GroundDetail({
        ground: id,
        speciality,
      });
      await groundDetail.save();
      return res.status(201).json({
        success: true,
        msg: 'Speciality added successfully for the ground',
        groundDetail,
      });
    }

    // Agar mil gaya toh sirf speciality update karo
    groundDetail.speciality = speciality || groundDetail.speciality;
    await groundDetail.save();

    res.status(200).json({
      success: true,
      msg: 'Speciality updated successfully',
      groundDetail,
    });
  } catch (error) {
    console.error('Error updating speciality:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error while updating speciality',
    });
  }
};

module.exports = { addGround, allGround, updateGround, deleteGround,getGroundById,updateGroundSpeciality };
