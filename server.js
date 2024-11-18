const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parses JSON bodies
app.use(cors()); // Enable CORS for requests from frontend
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/grounds", require("./routes/ground.routes"));
app.use("/api/groundOwners", require("./routes/groundOwner.routes"))
app.use('/api/payment', require('./routes/payment'));

// In your `server.js` or main backend file
app.get("/api/getkey", (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  });
  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//key id :rzp_live_W52is7CYnDpVKo
//secrete key:i56WNN6yg94qRhgpxqBHTUcK