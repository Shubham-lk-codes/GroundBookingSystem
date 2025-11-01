const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {
  addGround,
  allGround,
  updateGround,
  deleteGround,
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
router.get("/grounds/:id", async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);
    res.status(200).json({ ground });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching ground" });
  }
});

router.get('/', allGround);
router.put('/update/:id', upload.single('image'), updateGround);
router.delete('/delete/:id', deleteGround);

module.exports = router;
