const Project = require("../models/Project");

// @desc   Create new project
// @route  POST /api/projects
// @access Private
async function createProject(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description: description || "",
      owner: req.userId, // coming from authMiddleware
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error in createProject:", error);
    res.status(500).json({ message: "Something went wrong while creating project" });
  }
}

// @desc   Get projects of logged in user
// @route  GET /api/projects
// @access Private
async function getMyProjects(req, res) {
  try {
    const projects = await Project.find({ owner: req.userId }).sort({ createdAt: -1 });

    res.json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error in getMyProjects:", error);
    res.status(500).json({ message: "Something went wrong while fetching projects" });
  }
}

module.exports = {
  createProject,
  getMyProjects,
};
