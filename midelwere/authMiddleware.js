// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

// Auth middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "----------------");
    req.user = decoded;  
    next();  
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Admin middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, msg: 'Access denied. Admins only.' });
  }
  next(); 
};

module.exports = { authMiddleware, adminMiddleware };
