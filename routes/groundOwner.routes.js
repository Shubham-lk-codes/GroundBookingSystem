const express = require('express');
const {
  registerGroundOwner,
  getGroundOwners,
  approveGroundOwner,
  rejectGroundOwner,
} = require('../controllers/groundOwner.controller.js');

const router = express.Router();

// Ground Owner Routes
router.post('/register', registerGroundOwner);         // Register ground owner
router.get('/', getGroundOwners);                     // Get all ground owners
router.put('/:id/approve', approveGroundOwner);       // Approve a ground owner
router.delete('/:id/reject', rejectGroundOwner);      // Reject a ground owner

module.exports = router;
