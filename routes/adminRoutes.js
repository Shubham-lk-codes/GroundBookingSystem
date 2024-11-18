
const express = require('express');
const router = express.Router();
const GroundOwner = require('../models/GroundOwner');


router.get('/ground-owners', async (req, res) => {
  try {
    const groundOwners = await GroundOwner.find({ isVerified: false });
    res.json(groundOwners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ground owners' });
  }
});


router.put('/ground-owners/approve/:id', async (req, res) => {
  try {
    await GroundOwner.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json({ message: 'Ground owner approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving ground owner' });
  }
});


router.delete('/ground-owners/:id', async (req, res) => {
  try {
    await GroundOwner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ground owner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ground owner' });
  }
});

module.exports = router;
