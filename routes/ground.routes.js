const express = require('express');
const multer = require('multer');
const Ground = require('../models/ground');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {
  addGround,
  allGround,
  updateGround,
  deleteGround,getGroundById,
  updateGroundSpeciality,
  rateGround, getGroundRating 
} = require('../controllers/ground.controller.js');

const router = express.Router();

// Configure Multer and Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grounds', // Folder name in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });



router.post('/add', upload.single('image'), addGround);
// GET /grounds/:id
router.get("/:id", getGroundById);

router.get('/', allGround);
router.put('/update/:id', upload.single('image'), updateGround);
router.put('/update/:id/speciality', updateGroundSpeciality);
router.delete('/delete/:id', deleteGround);
router.put('/:groundId/rate', rateGround);

// ✅ Get rating for a specific ground
router.get('/:groundId/rating', getGroundRating);

module.exports = router;
