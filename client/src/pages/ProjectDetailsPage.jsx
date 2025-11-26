import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ NEW
import api from "../api/client";

function ProjectDetailsPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(""); // ❗ for initial loading errors
  const [taskError, setTaskError] = useState(""); // ❗ for "Add task" form errors

  // Task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [creatingTask, setCreatingTask] = useState(false);

  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Load project + tasks
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setPageError("");
      try {
        const projectRes = await api.get(`/projects/${projectId}`);
        setProject(projectRes.data.project);

        const taskRes = await api.get("/tasks", {
          params: { projectId },
        });
        setTasks(taskRes.data.tasks || []);
      } catch (err) {
        console.error("Error fetching project or tasks:", err);
        const msg =
          err.response?.data?.message ||
          "Could not load the project. Please try again.";
        setPageError(msg);
        toast.error(msg); // ✅ toast for big error
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId]);

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  async function handleCreateTask(e) {
    e.preventDefault();
    setTaskError("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      const msg = "Task title is required";
      setTaskError(msg);
      toast.error(msg);
      return;
    }

    if (trimmedTitle.length < 3) {
      const msg = "Task title should be at least 3 characters";
      setTaskError(msg);
      toast.error(msg);
      return;
    }

    setCreatingTask(true);

    try {
      const res = await api.post("/tasks", {
        title: trimmedTitle,
        description: description.trim(),
        priority,
        status: "todo",
        projectId,
      });

      const newTask = res.data.task;
      setTasks((prev) => [newTask, ...prev]);

      setTitle("");
      setDescription("");
      setPriority("medium");

      toast.success("Task created");
    } catch (err) {
      console.error("Error creating task:", err);
      const msg = err.response?.data?.message || "Could not create task";
      setTaskError(msg);
      toast.error(msg);
    } finally {
      setCreatingTask(false);
    }
  }

  async function handleChangeStatus(taskId, newStatus) {
    setUpdatingTaskId(taskId);
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      const updatedTask = res.data.task;

      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));

      toast.success("Task updated");
    } catch (err) {
      console.error("Error updating task:", err);
      const msg = err.response?.data?.message || "Could not update task";
      toast.error(msg);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    setDeletingTaskId(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      console.error("Error deleting task:", err);
      const msg = err.response?.data?.message || "Could not delete task";
      toast.error(msg);
    } finally {
      setDeletingTaskId(null);
    }
  }

  // 🔄 Loading state with spinner
  if (loading) {
    return (
      <div className="flex justify-center py-10 text-slate-200">
        <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ❌ If page failed to load
  if (pageError || !project) {
    return (
      <div className="space-y-3 text-slate-200">
        <p className="text-red-400 text-sm">
          {pageError || "Project not found."}
        </p>
        <Link
          to="/projects"
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Back link */}
      <p>
        <Link
          to="/projects"
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          ← Back
        </Link>
      </p>

      {/* Project header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-slate-400 mt-1">{project.description}</p>
        )}
      </div>

      {/* Add task card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-3">
          Add new task
        </h2>

        {taskError && (
          <div className="mb-3 text-xs text-red-300 bg-red-500/10 px-3 py-2 rounded">
            {taskError}
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
            <label className="text-xs text-slate-300 mb-1">Priority</label>
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
              disabled={creatingTask}
              className="mt-2 rounded-lg bg-indigo-500 py-2 font-semibold text-xs text-white hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creatingTask ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>

      {/* Task board */}
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
                    <div className="flex justify-between items-start gap-2">
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

                    {task.description && (
                      <p className="text-xs text-slate-300 mt-1">
                        {task.description}
                      </p>
                    )}

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
                        className="text-[11px] px-2 py-1 rounded bg-red-500/30 hover:bg-red-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
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
