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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
