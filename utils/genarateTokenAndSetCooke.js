const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()
const generateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: 3600000, // 1 hour in milliseconds
  });

  return token; // Return the token if you need to use it elsewhere
};

module.exports = generateTokenAndSetCookie;
