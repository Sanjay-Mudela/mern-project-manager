import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for creating a new project
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Load projects on first render
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        let msg = "Could not load projects. Please try again.";
        if (err.response?.data?.message) {
          msg = err.response.data.message;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post("/projects", {
        name: name.trim(),
        description: description.trim(),
      });

      const newProject = res.data.project;

      // Add new project at the top of the list
      setProjects((prev) => [newProject, ...prev]);

      // Clear form
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating project:", err);
      let msg = "Could not create project.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Your Projects</h1>

      {/* Create project card */}
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
          Create a new project
        </h2>

        {error && (
          <div style={{ marginBottom: "0.75rem", color: "red", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProject}>
          <div style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <textarea
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", minHeight: "60px" }}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "0.5rem 1rem",
              cursor: creating ? "not-allowed" : "pointer",
            }}
          >
            {creating ? "Creating..." : "Add Project"}
          </button>
        </form>
      </div>

      {/* Projects list */}
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            background: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ marginBottom: "0.25rem" }}>You don&apos;t have any projects yet.</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Use the form above to create your first project.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "0.5rem" }}>{project.name}</h3>
                  {project.description && (
                    <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                      {project.description}
                    </p>
                  )}
                </div>
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Created at: {new Date(project.createdAt).toLocaleString()}
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
