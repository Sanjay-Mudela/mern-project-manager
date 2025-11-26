const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc   Create a new task for a project
// @route  POST /api/tasks
// @access Private
async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    // 1) Basic validation
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    // 2) Check that project belongs to this user
    const project = await Project.findOne({ _id: projectId, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or not yours" });
    }

    // 3) Create task
    const task = await Task.create({
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      project: projectId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Something went wrong while creating task" });
  }
}

// @desc   Get tasks for a project
// @route  GET /api/tasks?projectId=xxx
// @access Private
async function getTasksForProject(req, res) {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId query param is required" });
    }

    // Check project ownership
    const project = await Project.findOne({ _id: projectId, owner: req.userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or not yours" });
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error in getTasksForProject:", error);
    res.status(500).json({ message: "Something went wrong while fetching tasks" });
  }
}

// @desc   Update task
// @route  PUT /api/tasks/:taskId
// @access Private
async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    // 1) Find the task
    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2) Check that task's project belongs to this user
    if (!task.project || task.project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    // 3) Apply updates (only if provided)
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ message: "Something went wrong while updating task" });
  }
}

// @desc   Delete task
// @route  DELETE /api/tasks/:taskId
// @access Private
async function deleteTask(req, res) {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check ownership
    if (!task.project || task.project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    res.status(500).json({ message: "Something went wrong while deleting task" });
  }
}

module.exports = {
  createTask,
  getTasksForProject,
  updateTask,
  deleteTask,
};
