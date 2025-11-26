import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

function ProjectDetailsPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [creatingTask, setCreatingTask] = useState(false);

  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Load project + tasks on mount or when projectId changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        // 1) Fetch project details
        const projectRes = await api.get(`/projects/${projectId}`);
        setProject(projectRes.data.project);

        // 2) Fetch tasks for this project
        const tasksRes = await api.get(`/tasks`, {
          params: { projectId },
        });
        setTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error("Error loading project or tasks:", err);
        let msg = "Could not load project. Please try again.";
        if (err.response?.data?.message) {
          msg = err.response.data.message;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  // Helper: group tasks by status
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  async function handleCreateTask(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setCreatingTask(true);

    try {
      const res = await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "todo",
        projectId,
      });

      const newTask = res.data.task;
      // Add new task to list
      setTasks((prev) => [newTask, ...prev]);

      // Clear form
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      console.error("Error creating task:", err);
      let msg = "Could not create task.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setCreatingTask(false);
    }
  }

  async function handleChangeStatus(taskId, newStatus) {
    setUpdatingTaskId(taskId);
    setError("");

    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      const updatedTask = res.data.task;

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error updating task:", err);
      let msg = "Could not update task.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    setDeletingTaskId(taskId);
    setError("");

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      let msg = "Could not delete task.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setDeletingTaskId(null);
    }
  }

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        <Link to="/projects">Back to projects</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <p>Project not found.</p>
        <Link to="/projects">Back to projects</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        <Link to="/projects" style={{ textDecoration: "none" }}>
          ← Back to projects
        </Link>
      </p>

      {/* Project header */}
      <h1 style={{ marginBottom: "0.25rem" }}>{project.name}</h1>
      {project.description && (
        <p style={{ marginBottom: "1rem", opacity: 0.85 }}>
          {project.description}
        </p>
      )}

      {/* Task create card */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>
          Add a new task
        </h2>

        {error && (
          <div style={{ marginBottom: "0.75rem", color: "red", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateTask}>
          <div style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", minHeight: "60px" }}
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ marginRight: "0.5rem", fontSize: "0.9rem" }}>
              Priority:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ padding: "0.4rem" }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creatingTask}
            style={{
              padding: "0.5rem 1rem",
              cursor: creatingTask ? "not-allowed" : "pointer",
            }}
          >
            {creatingTask ? "Adding task..." : "Add Task"}
          </button>
        </form>
      </div>

      {/* Tasks board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1rem",
        }}
      >
        {["todo", "in-progress", "done"].map((status) => (
          <div
            key={status}
            style={{
              background: "#f9fafb",
              borderRadius: "8px",
              padding: "0.75rem",
              minHeight: "200px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {status === "todo"
                ? "To Do"
                : status === "in-progress"
                ? "In Progress"
                : "Done"}
            </h3>

            {tasksByStatus[status].length === 0 ? (
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>No tasks here yet.</p>
            ) : (
              tasksByStatus[status].map((task) => (
                <div
                  key={task._id}
                  style={{
                    background: "white",
                    borderRadius: "6px",
                    padding: "0.5rem 0.6rem",
                    marginBottom: "0.5rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    fontSize: "0.9rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{task.title}</strong>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "999px",
                        background:
                          task.priority === "high"
                            ? "#fee2e2"
                            : task.priority === "low"
                            ? "#d1fae5"
                            : "#e5e7eb",
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p style={{ marginTop: "0.25rem", opacity: 0.8 }}>
                      {task.description}
                    </p>
                  )}
                  <p
                    style={{
                      marginTop: "0.35rem",
                      fontSize: "0.75rem",
                      opacity: 0.7,
                    }}
                  >
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: "0.4rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleChangeStatus(task._id, e.target.value)
                      }
                      disabled={updatingTaskId === task._id}
                      style={{ fontSize: "0.8rem", padding: "0.2rem" }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={deletingTaskId === task._id}
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor:
                          deletingTaskId === task._id ? "not-allowed" : "pointer",
                      }}
                    >
                      {deletingTaskId === task._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
