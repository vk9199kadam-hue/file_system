import React from "react";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, correlationId, networkMode, setNetworkMode, vpnConnected, toggleVpn, vpnTunnelId } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 text-white">
      {/* Brand & System Tag */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
          A
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-sm leading-none flex items-center gap-2">
            ApniLeap
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              S2 Gate-2
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Distributed Smart Backup System</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Network & VPN Gateway Controller */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 text-[11px] font-medium hidden lg:inline">Network:</span>
          
          <button
            type="button"
            onClick={() => setNetworkMode(prev => prev === "ON_PREM_LAN" ? "REMOTE_VPN" : "ON_PREM_LAN")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              networkMode === "ON_PREM_LAN"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏢 On-Prem LAN
          </button>

          <button
            type="button"
            onClick={() => setNetworkMode(prev => prev === "REMOTE_VPN" ? "ON_PREM_LAN" : "REMOTE_VPN")}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              networkMode === "REMOTE_VPN"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🌐 Remote (Outside)
          </button>

          {networkMode === "REMOTE_VPN" && (
            <button
              type="button"
              onClick={toggleVpn}
              className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                vpnConnected
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
              }`}
            >
              <span>{vpnConnected ? "🔒 VPN ON" : "⚠️ VPN OFF"}</span>
            </button>
          )}
        </div>

        {/* X-Correlation-ID Tracer Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1.5 rounded-xl text-[11px] font-mono">
          <span className="text-slate-500">Trace:</span>
          <span className="font-semibold text-indigo-400">{correlationId}</span>
        </div>

        {/* User Profile Badge */}
        {user && (
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-3 md:pl-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name || user.username}</p>
              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                user.role === "IT Admin"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : user.role === "Auditor"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              }`}>
                {user.role} • {user.department || "RIT-CSE"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
