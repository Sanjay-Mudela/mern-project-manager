import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function MainLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
      }}
    >
      {/* Top navbar */}
      <header
        style={{
          padding: "0.75rem 1.5rem",
          background: "#111827",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: logo/title */}
        <Link to="/projects" style={{ textDecoration: "none", color: "white" }}>
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            MERN Project Manager
          </span>
        </Link>

        {/* Right side: navigation / user */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            to="/projects"
            style={{ color: "white", textDecoration: "none", fontSize: "0.95rem" }}
          >
            Projects
          </Link>

          {user ? (
            <>
              <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.4rem 0.8rem",
                  background: "#f97316",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ color: "white", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Page content */}
      <main
        style={{
          flex: 1,
          maxWidth: "960px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
