import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
    isActive
      ? "bg-indigo-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/files" className={navLinkClass}>
            <span>📁</span>
            <span>File Browser</span>
          </NavLink>

          <NavLink to="/integrity" className={navLinkClass}>
            <span>🛡️</span>
            <span>Merkle Integrity</span>
          </NavLink>

          {(user.role === "IT Admin" || user.role === "Auditor") && (
            <NavLink to="/reports" className={navLinkClass}>
              <span>📈</span>
              <span>Reports &amp; Audit</span>
            </NavLink>
          )}

          {user.role === "IT Admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              <span>⚙️</span>
              <span>Admin Policy</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="px-2">
          <p className="text-[11px] font-medium text-slate-400">Signed in as</p>
          <p className="text-xs font-semibold text-slate-700 truncate">{user.username}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
