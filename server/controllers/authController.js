const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: create JWT token
function createToken(userId) {
  return jwt.sign(
    { userId },                          // payload
    process.env.JWT_SECRET,              // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // expiry
  );
}

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1) Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 3) Hash the password
    const salt = await bcrypt.genSalt(10);         // how strong the hash should be
    const passwordHash = await bcrypt.hash(password, salt);

    // 4) Create new user in DB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // 5) Create token
    const token = createToken(user._id);

    // 6) Send response (never send passwordHash)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Something went wrong during registration" });
  }
}

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1) Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2) Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3) Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4) Create token
    const token = createToken(user._id);

    // 5) Send response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Something went wrong during login" });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
