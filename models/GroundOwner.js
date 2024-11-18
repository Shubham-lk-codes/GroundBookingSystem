// models/GroundOwner.js
const mongoose = require('mongoose');

const groundOwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, unique: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },  // Use encryption for passwords
    status: {
        type: String,
        enum: ['pending', 'verified'], default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroundOwner', groundOwnerSchema);
