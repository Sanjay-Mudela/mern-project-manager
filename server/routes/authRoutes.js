const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);
// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me - get current logged in user
router.get("/me", authMiddleware, (req, res) => {
  // authMiddleware already put user in req.user
  res.json({
    user: req.user,
  });
});

module.exports = router;
