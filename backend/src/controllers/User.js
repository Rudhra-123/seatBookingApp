const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema"); // Assuming you have Sequelize or Mongoose setup for the User schema

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get the token from the cookies
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY); // Verify the JWT token
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decoded.userId; // Attach userId to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error(error.stack); // Enhanced error logging
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

// Helper function to generate JWT token and set it as a cookie
const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { // Generate a JWT token
    expiresIn: "1d", // The token expires in 1 day
  });

  // Set the token as a cookie
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true, // Cookie can't be accessed by JavaScript
    //   sameSite: "strict", // Strict mode to prevent CSRF attacks
    //   secure: process.env.NODE_ENV === "production", // Set secure cookie only in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      user, // Include user details in the response
      token, // Optionally include the token in the response body for client-side use
    });
};

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token and set it in the cookie after user creation
    generateToken(res, newUser, "Account created successfully.");
  } catch (error) {
    console.error(error.stack); // Enhanced error logging
    return res.status(500).json({
      success: false,
      message: "Failed to register.",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // Generate token and set it in the cookie after successful login
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.error(error.stack); // Enhanced error logging
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
});

// Logout Route
router.post("/logout", async (_, res) => {
  try {
    // Remove the token from the cookie by setting its maxAge to 0
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error.stack); // Enhanced error logging
    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
});

// Export the router
module.exports = router;
