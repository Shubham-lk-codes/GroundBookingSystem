const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const generateTokenAndSetCookie = require("../utils/genarateTokenAndSetCooke.js");
const sendVerificationEmail = require("../nodmailer/sendEamil.js")
const dotenv = require("dotenv");

dotenv.config();

// User SignUp
const userSignUp = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userRole = role || "user"; // Default role if none provided
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            verificationToken: Math.floor(100000 + Math.random() * 900000).toString(),
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await newUser.save();
        const token = generateTokenAndSetCookie(res, newUser._id);

        return res.status(201).json({
            success: true,
            msg: "User registered successfully!",
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            token,
        });

    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).json({ success: false, msg: "Server error, please try again later" });
    }
};

// User Login
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body, "user login");

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set token in a secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hour
        });

        // Optionally send verification email if needed
        if (user.verificationToken) { // Assuming token is created during signup
            await sendVerificationEmail(
                user.email,
                "Your verification code",
                `Hello ${user.name},\n\nPlease use the following code to verify your account: ${user.verificationToken}`
            );
        }

        // Send login success response
        return res.status(200).json({
            success: true,
            msg: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ success: false, msg: "Server error, please try again later" });
    }
};

// User Logout
const userLogout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ success: true, msg: "Logged out successfully" });
};

module.exports = { userSignUp, userLogin, userLogout };
