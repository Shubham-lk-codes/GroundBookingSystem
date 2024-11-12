const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (to, subject, text) => {
 
  try {
    // Create a transporter with SMTP server details
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER, // Use environment variable
        pass: process.env.ETHEREAL_PASS  // Use environment variable
      }
    });

    // Set email options (who it’s from, to, subject, and message content)
    const mailOptions = {
      from: `"shubham lonkar" <${process.env.ETHEREAL_USER}>`, // Corrected `from` field
      to:to, // Recipient address from the function argument
      subject: subject, // Subject from the function argument
      text: text, // Text content from the function argument
      // html: "<p>Your HTML message</p>" // Uncomment if sending HTML content
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId); // Display message ID for tracking
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
