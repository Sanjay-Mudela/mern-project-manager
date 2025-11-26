const express = require("express");
const {
  createTask,
  getTasksForProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes are protected
router.use(authMiddleware);

// POST /api/tasks
router.post("/", createTask);

// GET /api/tasks?projectId=xxx
router.get("/", getTasksForProject);

// PUT /api/tasks/:taskId
router.put("/:taskId", updateTask);

// DELETE /api/tasks/:taskId
router.delete("/:taskId", deleteTask);

module.exports = router;
