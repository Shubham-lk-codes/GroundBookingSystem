const sendEmail = require("../nodmailer/configAndSendemail.js");
const User = require('../models/user.js');

// Controller function to send verification email
const sendVerificationEmail = async (req, res) => {
  const { email, subject, text } = req.body;

  try {
    // Retrieve the user by email from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Send email to the user's email address
    await sendEmail(user.email, subject, text);

    res.status(200).json({ success: true, msg: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error in sending verification email:', error);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = sendVerificationEmail;
