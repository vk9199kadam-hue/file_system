import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    axios.get("/api/v1/ui/dashboard").then((res) => setSummary(res.data.data));

    const socket = io("http://localhost:4000");
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("dashboard_update", (update) => {
      setLiveUpdates((prev) => [update, ...prev].slice(0, 5));
    });

    return () => socket.disconnect();
  }, []);

  if (!summary) return <p className="p-6 text-slate-500">Loading dashboard…</p>;

  const chartData = [
    { name: "Used", value: summary.storageUsedGB },
    { name: "Free", value: summary.storageTotalGB - summary.storageUsedGB },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {connected ? "Live" : "Disconnected — reconnecting…"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Storage used" value={`${summary.storageUsedGB} GB`} />
        <StatCard label="Active jobs" value={summary.activeJobs} />
        <StatCard label="Queue depth" value={summary.queueDepth} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h2 className="text-sm font-medium text-slate-600 mb-2">Storage overview</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h2 className="text-sm font-medium text-slate-600 mb-2">Live updates</h2>
        {liveUpdates.length === 0 && (
          <p className="text-sm text-slate-400">Waiting for updates…</p>
        )}
        <ul className="text-sm space-y-1">
          {liveUpdates.map((u, i) => (
            <li key={i} className="text-slate-600">
              {new Date(u.timestamp).toLocaleTimeString()} — queue: {u.queueDepth}, last backup: {u.lastBackupState}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
