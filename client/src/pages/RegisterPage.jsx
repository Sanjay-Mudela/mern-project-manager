import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RegisterPage() {
  const { register, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // stop page refresh

    setError("");

    // Basic front-end validation
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      // Go to projects page after successful register
      navigate("/projects");
    } else {
      setError(result.message || "Registration failed");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h1 style={{ marginBottom: "1rem" }}>Create an Account</h1>

        {error && (
          <div style={{ marginBottom: "1rem", color: "red" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
              placeholder="Your name"
            />
          </div>

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
              placeholder="At least 6 characters"
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
            {authLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
