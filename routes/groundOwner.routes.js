const express = require('express');
const {
  registerGroundOwner,
  getGroundOwners,
  approveGroundOwner,
  rejectGroundOwner,
  addOrUpdateGroundDetails,
  addOrUpdateSliderImages,
  getGroundDetails
} = require('../controllers/groundOwner.controller.js');

const router = express.Router();

// Ground Owner Routes
router.post('/register', registerGroundOwner);         // Register ground owner
router.get('/', getGroundOwners);                     // Get all ground owners
router.put('/:id/approve', approveGroundOwner);       // Approve a ground owner
router.delete('/:id/reject', rejectGroundOwner); 
// ✅ Update Speciality & Availability
router.post('/update-ground-details', addOrUpdateGroundDetails);

// ✅ Update Slider Images only
router.post('/update-slider-images', addOrUpdateSliderImages);

// ✅ Get Ground Details
router.get('/ground-details/:groundId', getGroundDetails);     // Reject a ground owner

module.exports = router;
