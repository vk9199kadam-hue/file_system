import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  if (!user) return null;

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
        : isDark
        ? "text-slate-400 hover:bg-slate-800/70 hover:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside
      className={`w-60 shrink-0 border-r min-h-screen p-4 flex flex-col justify-between transition-colors duration-200 ${
        isDark
          ? "bg-[#070b14] border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="space-y-6">
        <div className="px-2">
          <p
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Platform Modules
          </p>
        </div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <span>📊</span>
            <span>Operations Dashboard</span>
          </NavLink>

          <NavLink to="/files" className={navLinkClass}>
            <span>📁</span>
            <span>File Browser &amp; Storage</span>
          </NavLink>

          <NavLink to="/integrity" className={navLinkClass}>
            <span>🛡️</span>
            <span>Merkle Tree Integrity</span>
          </NavLink>

          {(user.role === "IT Admin" || user.role === "Auditor") && (
            <NavLink to="/reports" className={navLinkClass}>
              <span>📈</span>
              <span>Audit Trail &amp; Reports</span>
            </NavLink>
          )}

          {user.role === "IT Admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              <span>⚙️</span>
              <span>Cluster Policies &amp; SLA</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className={`border-t pt-4 space-y-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <div className="px-2">
          <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Authenticated Session
          </p>
          <p className={`text-xs font-bold truncate mt-0.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
            {user.username}
          </p>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            isDark
              ? "bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border-slate-700/60"
              : "bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200/60"
          }`}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
