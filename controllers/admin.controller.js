const GroundOwner = require("../models/GroundOwner");

// Fetch all ground owners
exports.getAllGroundOwners = async (req, res) => {
  try {
    const groundOwners = await GroundOwner.find(); // Fetch all owners
    res.status(200).json({ success: true, groundOwners });
  } catch (error) {
    console.error("Error fetching ground owners:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve a ground owner
exports.approveGroundOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const groundOwner = await GroundOwner.findByIdAndUpdate(
      id,
      { status: "verified" },
      { new: true }
    );

    if (!groundOwner) {
      return res.status(404).json({ success: false, message: "Ground owner not found" });
    }

    res.status(200).json({ success: true, message: "Ground owner approved", groundOwner });
  } catch (error) {
    console.error("Error approving ground owner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject a ground owner
exports.rejectGroundOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const groundOwner = await GroundOwner.findByIdAndDelete(id);

    if (!groundOwner) {
      return res.status(404).json({ success: false, message: "Ground owner not found" });
    }

    res.status(200).json({ success: true, message: "Ground owner rejected and removed" });
  } catch (error) {
    console.error("Error rejecting ground owner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
