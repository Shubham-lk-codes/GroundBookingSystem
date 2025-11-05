const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const groundOwnerRoutes = require("./routes/groundOwner.routes"); // Import ground owner routes
const eventRoutes = require("./routes/eventRoutes"); 

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies or credentials in requests
  })
);

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/grounds", require("./routes/ground.routes"));
app.use('/ground-owners', groundOwnerRoutes); // Use imported routes here
//app.use('/admin', adminRoutes);
app.use('/api/payment', require('./routes/payment'));
//app.use('/api/bookings', require('./routes/booking.routes'));
app.use("/events", eventRoutes);


// Razorpay API key route
app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
