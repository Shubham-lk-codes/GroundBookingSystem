// routes/groundOwner.routes.js
const express = require('express');
const router = express.Router();
const { registerGroundOwner } = require('../controllers/groundOwner.controller');

// Register a new ground owner
router.post('/register', registerGroundOwner);

module.exports = router;
