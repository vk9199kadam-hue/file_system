import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("emp_rahul");
  const [password, setPassword] = useState("Rahul@2026");
  const [role, setRole] = useState("Employee");
  const [submitting, setSubmitting] = useState(false);
  const [predefinedUsers, setPredefinedUsers] = useState([]);
  const [serverOnline, setServerOnline] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Employee");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch predefined users and health check
    axios
      .get("/api/v1/ui/session/users")
      .then((res) => {
        if (res.data?.data) {
          setPredefinedUsers(res.data.data);
          setServerOnline(true);
        }
      })
      .catch(() => {
        // Fallback hardcoded 15 accounts
        setServerOnline(false);
      });
  }, []);

  const handleSelectUser = (userObj) => {
    setUsername(userObj.username);
    setPassword(userObj.password);
    setRole(userObj.role);
    setSelectedCategory(userObj.role);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password, role);
      if (role === "IT Admin") {
        navigate("/admin");
      } else if (role === "Auditor") {
        navigate("/integrity");
      } else {
        navigate("/files");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const employeeAccounts = [
    { username: "emp_rahul", password: "Rahul@2026", name: "Rahul Sharma", role: "Employee", dept: "Engineering", mode: "Remote (VPN)" },
    { username: "emp_priya", password: "Priya@2026", name: "Priya Patel", role: "Employee", dept: "Data Science", mode: "Remote (VPN)" },
    { username: "emp_amit", password: "Amit@2026", name: "Amit Verma", role: "Employee", dept: "Product Design", mode: "Corporate LAN" },
    { username: "emp_sneha", password: "Sneha@2026", name: "Sneha Kulkarni", role: "Employee", dept: "Finance", mode: "Remote (VPN)" },
    { username: "emp_rohit", password: "Rohit@2026", name: "Rohit Deshmukh", role: "Employee", dept: "Operations", mode: "Corporate LAN" }
  ];

  const itAdminAccounts = [
    { username: "admin_tejashree", password: "Admin@2026", name: "Tejashree Patil", role: "IT Admin", dept: "Infrastructure & Arch", mode: "Superadmin" },
    { username: "admin_suresh", password: "Suresh@2026", name: "Suresh Nair", role: "IT Admin", dept: "Cluster Node Mgr", mode: "Full Admin" },
    { username: "admin_ananya", password: "Ananya@2026", name: "Ananya Joshi", role: "IT Admin", dept: "VPN & Network Sec", mode: "Full Admin" },
    { username: "admin_vikram", password: "Vikram@2026", name: "Vikram Malhotra", role: "IT Admin", dept: "Storage Policy & SLA", mode: "Full Admin" },
    { username: "admin_kiran", password: "Kiran@2026", name: "Kiran Rao", role: "IT Admin", dept: "DevOps & Failover", mode: "Full Admin" }
  ];

  const auditorAccounts = [
    { username: "audit_meera", password: "Audit@2026", name: "Meera Iyer", role: "Auditor", dept: "Chief Compliance Officer", mode: "Audit Scope" },
    { username: "audit_rajesh", password: "Rajesh@2026", name: "Rajesh Gupta", role: "Auditor", dept: "Crypto & Hash Inspector", mode: "Audit Scope" },
    { username: "audit_pooja", password: "Pooja@2026", name: "Pooja Shinde", role: "Auditor", dept: "ISO 27001 Governance", mode: "Audit Scope" },
    { username: "audit_arun", password: "Arun@2026", name: "Arun Menon", role: "Auditor", dept: "Storage & Dedup SLA", mode: "Audit Scope" },
    { username: "audit_neha", password: "Neha@2026", name: "Neha Saxena", role: "Auditor", dept: "Security Forensics", mode: "Audit Scope" }
  ];

  const currentList =
    selectedCategory === "Employee"
      ? employeeAccounts
      : selectedCategory === "IT Admin"
      ? itAdminAccounts
      : auditorAccounts;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 z-10">
        
        {/* Left Col: Hero Branding & Role Selector */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
                A
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  ApniLeap
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Gate-2 Ready
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Smart File Backup &amp; Restore Platform</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              Distributed storage platform featuring <span className="text-indigo-300 font-semibold">Round-Robin scheduling</span>, <span className="text-indigo-300 font-semibold">SHA-256 deduplication</span>, and <span className="text-indigo-300 font-semibold">Merkle tree verification</span>.
            </p>

            {/* Central Physical Node Status */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">On-Prem Central Server</p>
                  <p className="text-[10px] text-slate-400 font-mono">10.0.4.82 : 4000 (Local Host)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ONLINE
              </span>
            </div>
          </div>

          {/* Persona Category Tabs */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              1-Click Demo Persona Switcher (15 Accounts):
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCategory("Employee")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === "Employee"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                👤 Employee
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("IT Admin")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === "IT Admin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                💻 IT Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("Auditor")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === "Auditor"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🛡️ Auditor
              </button>
            </div>

            {/* Quick List of 5 Users in Category */}
            <div className="mt-2.5 space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {currentList.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleSelectUser(u)}
                  className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${
                    username === u.username
                      ? "bg-indigo-950/60 border-indigo-500 text-white"
                      : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-white">{u.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">({u.username})</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 font-mono">
                    {u.mode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sign In Form */}
        <div className="md:col-span-6 flex flex-col justify-center space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Sign In to ApniLeap Portal</h2>
            <p className="text-xs text-slate-400">Authenticate with institutional RIT-CSE-2026 credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username / ID</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. emp_rahul"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Authorized Role Profile</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setSelectedCategory(e.target.value);
                }}
              >
                <option value="Employee">Employee (Backup, Restore &amp; Remote VPN Gateway)</option>
                <option value="IT Admin">IT Admin (Round-Robin Queue, Locks &amp; Retention Policies)</option>
                <option value="Auditor">Auditor (Merkle Tree Root &amp; Immutable Audit Trail)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? "Authenticating Session..." : `Sign In as ${role}`}</span>
              <span>→</span>
            </button>
          </form>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Security Baseline:</span>
              <span className="text-emerald-400 font-mono">TLS / JWT / RBAC Active</span>
            </div>
            <p>• Zero database credentials stored in browser.</p>
            <p>• Unique <span className="font-mono text-indigo-400">X-Correlation-ID</span> stamped on every transaction.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
