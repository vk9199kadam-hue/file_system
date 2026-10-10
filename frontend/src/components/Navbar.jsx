import React from "react";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";
import ApniLeapLogo from "./ApniLeapLogo.jsx";

export default function Navbar() {
  const { user, correlationId, networkMode, setNetworkMode, vpnConnected, toggleVpn } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <header
      className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? "bg-[#070b14] border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-xs"
      }`}
    >
      {/* Brand & System Tag */}
      <div className="flex items-center space-x-3">
        <ApniLeapLogo size="sm" />
        <div className={`hidden md:block pl-2 border-l ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isDark
                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            S2 Gate-2 Production
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3 md:space-x-4">
        {/* Network & VPN Gateway Controller */}
        <div
          className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 rounded-xl text-xs transition-colors border ${
            isDark
              ? "bg-slate-950 border-slate-800"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <span className={`text-[11px] font-medium hidden lg:inline ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Network:
          </span>

          <button
            type="button"
            onClick={() => setNetworkMode((prev) => (prev === "ON_PREM_LAN" ? "REMOTE_VPN" : "ON_PREM_LAN"))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              networkMode === "ON_PREM_LAN"
                ? "bg-blue-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏢 On-Prem LAN
          </button>

          <button
            type="button"
            onClick={() => setNetworkMode((prev) => (prev === "REMOTE_VPN" ? "ON_PREM_LAN" : "REMOTE_VPN"))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              networkMode === "REMOTE_VPN"
                ? "bg-purple-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🌐 Remote
          </button>

          {networkMode === "REMOTE_VPN" && (
            <button
              type="button"
              onClick={toggleVpn}
              className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                vpnConnected
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse"
              }`}
            >
              <span>{vpnConnected ? "🔒 VPN ON" : "⚠️ VPN OFF"}</span>
            </button>
          )}
        </div>

        {/* X-Correlation-ID Tracer Badge */}
        <div
          className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono border ${
            isDark
              ? "bg-slate-950 border-slate-800 text-slate-400"
              : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          <span className={isDark ? "text-slate-500" : "text-slate-400"}>Trace:</span>
          <span className="font-semibold text-blue-600 dark:text-indigo-400">{correlationId}</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
          className={`p-2 rounded-xl border text-sm transition-all flex items-center justify-center cursor-pointer ${
            isDark
              ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300"
              : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* User Profile Badge */}
        {user && (
          <div className={`flex items-center space-x-2 border-l pl-3 md:pl-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <div className="text-right">
              <p className={`text-xs font-bold leading-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                {user.name || user.username}
              </p>
              <span
                className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                  user.role === "IT Admin"
                    ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30"
                    : user.role === "Auditor"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                    : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30"
                }`}
              >
                {user.role} • {user.department || "RIT-CSE"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
