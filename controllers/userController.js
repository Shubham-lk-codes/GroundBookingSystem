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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hour
        });

        return res.status(200).json({
            success: true,
            msg: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error("Login error:", err.message, err.stack);
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
