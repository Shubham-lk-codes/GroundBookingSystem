const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://shubhamlonkar137:sGFdSVMSKiVEOFMA@cluster0.qcbgr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
