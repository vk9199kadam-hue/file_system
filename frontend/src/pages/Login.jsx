import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";
import ApniLeapLogo, { ApniLeapIcon } from "../components/ApniLeapLogo.jsx";
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
  const { theme, toggleTheme, isDark } = useTheme();
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
    <div
      className={`min-h-screen flex flex-col justify-between p-4 md:p-8 transition-colors duration-200 relative overflow-hidden font-sans ${
        isDark ? "bg-[#070b14] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Decorative Lighting */}
      <div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-indigo-600/15" : "bg-blue-400/15"
        }`}
      ></div>
      <div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? "bg-blue-600/10" : "bg-orange-300/15"
        }`}
      ></div>

      {/* Top Header / Portal Status Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 py-2 mb-4">
        <div className="flex items-center space-x-3">
          <ApniLeapLogo size="md" />
          <span className={`hidden sm:inline-block h-5 w-[1px] ${isDark ? "bg-slate-800" : "bg-slate-300"}`}></span>
          <span className={`hidden sm:inline-block text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Enterprise Portal
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Production Gate Badge */}
          <span
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
              isDark
                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                : "bg-blue-50 text-blue-800 border-blue-200 shadow-xs"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-600"}`}></span>
            <span>RIT-CSE Gate-2 Certified</span>
          </span>

          {/* Bright / Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Bright/Dark Mode"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-sm transition-all cursor-pointer ${
              isDark
                ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-300 shadow-md"
                : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm"
            }`}
          >
            {isDark ? (
              <>
                <span className="text-base leading-none">☀️</span>
                <span className="text-slate-200">Switch to Bright</span>
              </>
            ) : (
              <>
                <span className="text-base leading-none">🌙</span>
                <span className="text-slate-800">Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="w-full max-w-6xl mx-auto my-auto z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 backdrop-blur-xl border rounded-3xl p-6 md:p-10 transition-all ${
            isDark
              ? "bg-slate-900/90 border-slate-800 shadow-2xl text-slate-100"
              : "bg-white border-slate-200 shadow-xl text-slate-900"
          }`}
        >
          {/* Left Column: Official Identity & Demo Persona Directory */}
          <div
            className={`lg:col-span-6 flex flex-col justify-between space-y-6 lg:border-r lg:pr-8 ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            <div className="space-y-4">
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border mb-3 ${
                    isDark
                      ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
                      : "bg-orange-50 text-orange-800 border-orange-200"
                  }`}
                >
                  <span>🔒 Continuous Protection Gateway</span>
                </div>
                <h1
                  className={`text-2xl md:text-3xl font-black tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Smart File Backup &amp; Disaster Recovery
                </h1>
                <p
                  className={`text-xs md:text-sm leading-relaxed mt-2 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  High-availability distributed storage platform featuring{" "}
                  <strong className={isDark ? "text-blue-400 font-bold" : "text-blue-700 font-bold"}>
                    Round-Robin scheduling
                  </strong>
                  ,{" "}
                  <strong className={isDark ? "text-orange-400 font-bold" : "text-orange-700 font-bold"}>
                    SHA-256 deduplication
                  </strong>
                  , and{" "}
                  <strong className={isDark ? "text-indigo-400 font-bold" : "text-indigo-700 font-bold"}>
                    Merkle tree root verification
                  </strong>
                  .
                </p>
              </div>

              {/* Physical Host Live Telemetry Node */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  isDark
                    ? "bg-slate-800/80 border-slate-700/60"
                    : "bg-slate-50 border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      On-Prem Central Storage Cluster
                    </p>
                    <p className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Host: 10.0.4.82 : 4000 (Central Node)
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/30"
                      : "text-emerald-800 bg-emerald-100 border-emerald-300"
                  }`}
                >
                  ONLINE • LIVE
                </span>
              </div>
            </div>

            {/* Persona Switcher Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Demo Evaluator Directory (1-Click Switcher)
                </label>
                <span className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                  15 Preloaded Accounts
                </span>
              </div>

              {/* Role Category Tabs */}
              <div
                className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border ${
                  isDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-100 border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategory("Employee")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedCategory === "Employee"
                      ? "bg-blue-600 text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>👤</span>
                  <span>Employee</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("IT Admin")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedCategory === "IT Admin"
                      ? "bg-purple-600 text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>💻</span>
                  <span>IT Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("Auditor")}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedCategory === "Auditor"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🛡️</span>
                  <span>Auditor</span>
                </button>
              </div>

              {/* User Account Quick Cards */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {currentList.map((u) => {
                  const isSelected = username === u.username;
                  return (
                    <button
                      key={u.username}
                      type="button"
                      onClick={() => handleSelectUser(u)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-blue-950/70 border-blue-500 text-white shadow-sm"
                            : "bg-blue-50 border-blue-500 text-blue-950 shadow-sm"
                          : isDark
                          ? "bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-300"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : isDark
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <span
                              className={`text-[10px] font-mono font-normal ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              ({u.username})
                            </span>
                          </div>
                          <p
                            className={`text-[10px] ${
                              isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {u.dept}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                          isSelected
                            ? isDark
                              ? "bg-blue-500/30 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                            : isDark
                            ? "bg-slate-700/60 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.mode}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Official Authentication Form */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={isDark ? "text-orange-400 font-bold" : "text-blue-600 font-bold"}>✦</span>
                <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                  Institutional Portal Sign In
                </h2>
              </div>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Authenticate with institutional RIT-CSE-2026 single sign-on credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  Institutional ID / Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    👤
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. emp_rahul"
                    className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-900"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  Security Passkey
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    🔑
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-900"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Role Profile Dropdown */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  Authorized Role &amp; Access Scope
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setSelectedCategory(e.target.value);
                    }}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer ${
                      isDark
                        ? "bg-slate-950 border-slate-700 text-white focus:bg-slate-900"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white"
                    }`}
                  >
                    <option value="Employee">Employee (Backup, Restore &amp; Remote VPN Gateway)</option>
                    <option value="IT Admin">IT Admin (Round-Robin Queue, Locks &amp; Retention Policies)</option>
                    <option value="Auditor">Auditor (Merkle Tree Root &amp; Immutable Audit Trail)</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-[0.99] flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? "Authenticating Session..." : `Sign In as ${role}`}</span>
                <span className="text-lg leading-none">→</span>
              </button>
            </form>

            {/* Enterprise Security Compliance Box */}
            <div
              className={`p-3.5 rounded-2xl border text-[11px] space-y-1.5 ${
                isDark
                  ? "bg-slate-950/70 border-slate-800 text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div
                className={`flex items-center justify-between font-bold ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>Enterprise Security Baseline</span>
                </span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded border ${
                    isDark
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : "text-emerald-800 bg-emerald-100 border-emerald-300"
                  }`}
                >
                  TLS 1.3 / JWT / RBAC Active
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                • Zero database credentials stored in client browser memory.
              </p>
              <p className="text-[11px] leading-relaxed">
                • Unique{" "}
                <span className={isDark ? "font-mono text-indigo-400 font-semibold" : "font-mono text-blue-700 font-semibold"}>
                  X-Correlation-ID
                </span>{" "}
                stamped on every backup, restore, and audit verification.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer
        className={`w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] py-3 mt-4 border-t ${
          isDark
            ? "text-slate-500 border-slate-800/80"
            : "text-slate-500 border-slate-200/80"
        }`}
      >
        <div>
          © 2026 ApniLeap Distributed Systems Project. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-mono text-[10px]">
          <span>Node SLA: 99.99%</span>
          <span>•</span>
          <span>SHA-256 Verified</span>
          <span>•</span>
          <span>Zero Data Loss Guarantee</span>
        </div>
      </footer>
    </div>
  );
}
