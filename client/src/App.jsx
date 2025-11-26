import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

function App() {
  return (
    <Routes>
      {/* Default route - for now redirect to /projects */}
      <Route path="/" element={<Navigate to="/projects" replace />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Projects */}
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<div style={{ padding: "2rem" }}><h1>404 - Page not found</h1></div>} />
    </Routes>
  );
}

export default App;
