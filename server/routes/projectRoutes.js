const express = require("express");
const {
  createProject,
  getMyProjects,
  getProjectById,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes are protected
router.use(authMiddleware);

// POST /api/projects
router.post("/", createProject);

// GET /api/projects
router.get("/", getMyProjects);

// GET /api/projects/:projectId  -> get single project
router.get("/:projectId", getProjectById);

module.exports = router;
