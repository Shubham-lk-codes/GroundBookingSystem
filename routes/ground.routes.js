const express = require("express");
const router = express.Router();
const { addGround,allGround,updateGround ,deleteGround} = require("../controllers/ground.controller.js");
const { authMiddleware, adminMiddleware } = require('../midelwere/authMiddleware.js');  // Import middleware
 


router.post("/add",authMiddleware, adminMiddleware, addGround);
router.get("/", allGround);
router.put("/update/:id",authMiddleware, adminMiddleware, updateGround);
router.delete("/delete/:id",authMiddleware, adminMiddleware, deleteGround);




module.exports = router;
