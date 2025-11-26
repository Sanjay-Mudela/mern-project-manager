import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        {/* Default: go to /projects (ProtectedRoute will redirect to /login if needed) */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem" }}>
              <h1>404 - Page not found</h1>
            </div>
          }
        />
      </Routes>

      {/* 🔥 Toast notifications */}
      {/* ✅ Toast container – stays at root, works everywhere */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #1f2937",
            fontSize: "0.85rem",
          },
        }}
      />
    </>
  );
}

export default App;
