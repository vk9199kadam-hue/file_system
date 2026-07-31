import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-200"
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <p className="font-semibold text-slate-800">{user.username}</p>
        <p className="text-xs text-slate-500">{user.role}</p>
      </div>

      <nav className="space-y-1 flex-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/files" className={linkClass}>Files</NavLink>
        {(user.role === "IT Admin" || user.role === "Auditor") && (
          <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        )}
        {user.role === "IT Admin" && (
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        )}
      </nav>

      <button
        onClick={logout}
        className="mt-4 text-sm text-slate-500 hover:text-red-600 text-left"
      >
        Log out
      </button>
    </aside>
  );
}
