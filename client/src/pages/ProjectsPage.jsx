import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        const msg =
          err.response?.data?.message ||
          "Could not load projects. Please try again.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      const msg = "Project name is required";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (trimmedName.length < 3) {
      const msg = "Project name should be at least 3 characters";
      setError(msg);
      toast.error(msg);
      return;
    }

    setCreating(true);
    try {
      const res = await api.post("/projects", {
        name: trimmedName,
        description: description.trim(),
      });

      const newProject = res.data.project;
      setProjects((prev) => [newProject, ...prev]);
      setName("");
      setDescription("");
      toast.success("Project created");
    } catch (err) {
      console.error("Error creating project:", err);
      const msg = err.response?.data?.message || "Could not create project.";
      setError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50 tracking-tight">
            Your projects
          </h1>
          <p className="text-sm text-slate-300">
            Create projects and track tasks inside each one.
          </p>
        </div>
      </div>

      {/* Create project card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-sm backdrop-blur">
        <h2 className="text-sm font-medium text-slate-100 mb-3">
          Create a new project
        </h2>

        {error && (
          <div className="mb-3 rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreateProject}
          className="flex flex-col gap-3 sm:grid sm:grid-cols-[2fr,3fr,auto] sm:items-start"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-300">Name</label>
            <input
              type="text"
              placeholder="e.g. MERN Portfolio, Client Project..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-300">Description</label>
            <textarea
              placeholder="Short summary (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-10"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? "Creating..." : "Add project"}
            </button>
          </div>
        </form>
      </div>

      {/* Projects list / loading / empty */}
      {loading ? (
        // ✅ spinner instead of plain text
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-6 text-sm text-slate-200">
          <p className="mb-1">You don&apos;t have any projects yet.</p>
          <p className="text-xs text-slate-400">
            Use the form above to create your first project.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 hover:border-indigo-500/70"
            >
              <div className="flex flex-col h-full justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-50 group-hover:text-white">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-1 text-xs text-slate-300 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-[0.7rem] text-slate-400">
                  Created:{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
