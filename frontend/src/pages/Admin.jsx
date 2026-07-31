import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [fileId, setFileId] = useState("");
  const [retentionDays, setRetentionDays] = useState(30);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.patch(`/api/v1/ui/files/${fileId}`, {
      retention_days: retentionDays,
    });
    setMessage(`Updated ${res.data.data.fileId} — retention set to ${retentionDays} days`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Admin</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 max-w-md space-y-4"
      >
        <div>
          <label className="text-sm text-slate-600">File ID</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            placeholder="e.g. f1"
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Retention (days)</label>
          <input
            type="number"
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
          />
        </div>
        <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
          Save
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
