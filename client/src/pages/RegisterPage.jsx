// src/pages/RegisterPage.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RegisterPage() {
  const { register, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      navigate("/projects");
    } else {
      setError(result.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#22c55e_0,transparent_55%),radial-gradient(circle_at_bottom,#06b6d4_0,transparent_55%)] opacity-35" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl backdrop-blur-sm px-6 py-7">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create an account
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Sign up to start managing your projects and tasks.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed px-3 py-2 text-sm font-semibold text-white transition-colors"
            >
              {authLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-300 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
