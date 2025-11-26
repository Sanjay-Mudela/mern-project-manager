// src/pages/ProjectDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [creatingTask, setCreatingTask] = useState(false);

  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const projectRes = await api.get(`/projects/${projectId}`);
        setProject(projectRes.data.project);

        const taskRes = await api.get("/tasks", {
          params: { projectId },
        });
        setTasks(taskRes.data.tasks || []);
      } catch (err) {
        console.error("Error fetching project or tasks:", err);
        setError(
          err.response?.data?.message ||
            "Could not load the project. Try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  async function handleCreateTask(e) {
    e.preventDefault();
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
      setTasks((prev) => [newTask, ...prev]);

      // reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.response?.data?.message || "Could not create task");
    } finally {
      setCreatingTask(false);
    }
  }

  async function handleChangeStatus(taskId, newStatus) {
    setUpdatingTaskId(taskId);
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.response?.data?.message || "Could not update task");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeletingTaskId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.response?.data?.message || "Could not delete task");
    } finally {
      setDeletingTaskId(null);
    }
  }

  if (loading) return <p className="text-slate-300">Loading project...</p>;
  if (error)
    return (
      <div>
        <p className="text-red-400 mb-3">{error}</p>
        <Link to="/projects" className="text-indigo-400 hover:underline">
          ← Back to projects
        </Link>
      </div>
    );

  return (
    <div className="space-y-6 text-slate-200">
      {/* Back Button */}
      <p>
        <Link
          to="/projects"
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          ← Back
        </Link>
      </p>

      {/* Project info */}
      <div>
        <h1 className="text-2xl font-bold text-white">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-slate-400 mt-1">{project.description}</p>
        )}
      </div>

      {/* Create task form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-3">
          Add new task
        </h2>

        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-500/10 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreateTask}
          className="grid gap-3 sm:grid-cols-[2fr,3fr,auto]"
        >
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm min-h-10 focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-col">
            <label className="text-xs text-slate-300">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              className="mt-2 rounded-lg bg-indigo-500 py-2 font-semibold text-xs text-white hover:bg-indigo-400"
              disabled={creatingTask}
            >
              {creatingTask ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>

      {/* Board columns */}
      <div className="grid gap-4 sm:grid-cols-3">
        {["todo", "in-progress", "done"].map((status) => (
          <div
            key={status}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm"
          >
            <h3 className="text-sm font-semibold mb-2">
              {status === "todo"
                ? "To Do"
                : status === "in-progress"
                ? "In Progress"
                : "Done"}
            </h3>
            <div className="space-y-2">
              {tasksByStatus[status].length === 0 ? (
                <p className="text-xs text-slate-500">
                  No tasks in this column.
                </p>
              ) : (
                tasksByStatus[status].map((task) => (
                  <div
                    key={task._id}
                    className="bg-slate-800/50 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-white">
                        {task.title}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] ${
                          task.priority === "high"
                            ? "bg-red-500/20 text-red-300"
                            : task.priority === "low"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleChangeStatus(task._id, e.target.value)
                        }
                        disabled={updatingTaskId === task._id}
                        className="text-xs bg-slate-900/70 border border-slate-700 rounded px-2 py-1"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={deletingTaskId === task._id}
                        className="text-[11px] px-2 py-1 rounded bg-red-500/30 hover:bg-red-500/40"
                      >
                        {deletingTaskId === task._id ? "..." : "Delete"}
                      </button>
                    </div>

                    <p className="text-[10px] mt-2 text-slate-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
