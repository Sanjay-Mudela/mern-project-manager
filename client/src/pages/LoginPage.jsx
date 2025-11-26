import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const { login, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate("/projects");
    } else {
      setError(result.message || "Login failed");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h1 style={{ marginBottom: "1rem" }}>Login</h1>

        {error && (
          <div style={{ marginBottom: "1rem", color: "red" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              cursor: authLoading ? "not-allowed" : "pointer",
            }}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
