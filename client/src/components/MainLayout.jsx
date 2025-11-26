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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* left: logo / title */}
          <Link to="/projects" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/90 flex items-center justify-center text-xs font-bold">
              PM
            </div>
            <span className="text-sm font-semibold tracking-tight">
              MERN Project Manager
            </span>
          </Link>

          {/* right: nav / auth */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/projects"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Projects
            </Link>

            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-slate-300">
                  Hi, <span className="font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-50 hover:bg-slate-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* subtle background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#4f46e5_0,transparent_55%),radial-gradient(circle_at_bottom,#ec4899_0,transparent_55%)] opacity-20" />

      {/* main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
