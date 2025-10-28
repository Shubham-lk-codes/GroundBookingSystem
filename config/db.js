const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://shubhamlonkar137_db_user:d1aGz9dcNyFqrFA5@cluster0.7t7udpz.mongodb.net/?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
