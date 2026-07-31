import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Employee");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Calls the BFF, which will eventually call Team C's real auth
    const res = await axios.post("/api/v1/ui/session", { username, role });
    login(res.data.data.user.username, res.data.data.user.role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 w-80 space-y-4"
      >
        <h1 className="text-lg font-semibold text-slate-800">
          Backup System — Sign in
        </h1>

        <div>
          <label className="text-sm text-slate-600">Username</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. tejashree"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Role</label>
          <select
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Employee</option>
            <option>IT Admin</option>
            <option>Auditor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
