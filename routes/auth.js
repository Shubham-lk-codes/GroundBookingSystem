const express = require("express");
const router = express.Router();
const { userSignUp,userLogin,userLogout,addOrUpdateRating } = require("../controllers/userController");



router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.post('/rate-ground', addOrUpdateRating);




module.exports = router;
