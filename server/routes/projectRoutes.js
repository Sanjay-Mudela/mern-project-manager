const express = require("express");
const { createProject, getMyProjects } = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes are protected
router.use(authMiddleware);

// POST /api/projects
router.post("/", createProject);

// GET /api/projects
router.get("/", getMyProjects);

module.exports = router;
