const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1) Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2) Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) decoded has { userId: ... }, we attach to req object
    req.userId = decoded.userId;

    // 5) Optionally, we can fetch user details (without password)
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach full user object (no password)

    // 6) Call next() to continue to actual route handler
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
