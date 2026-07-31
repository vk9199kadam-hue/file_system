import { useEffect, useState } from "react";
import axios from "axios";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [statusByFile, setStatusByFile] = useState({});

  useEffect(() => {
    axios.get("/api/v1/ui/files").then((res) => setFiles(res.data.data));
  }, []);

  const handleBackup = async (fileId) => {
    setStatusByFile((s) => ({ ...s, [fileId]: "Starting…" }));
    const res = await axios.post("/api/v1/ui/backups", { file_id: fileId });
    setStatusByFile((s) => ({
      ...s,
      [fileId]: `${res.data.data.state} (queue position ${res.data.data.queue_position})`,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-slate-800 mb-4">Files</h1>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Version</th>
              <th className="text-left px-4 py-2">Size</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.file_id} className="border-t border-slate-100">
                <td className="px-4 py-2">{f.name}</td>
                <td className="px-4 py-2">{f.lastVersion}</td>
                <td className="px-4 py-2">{f.size}</td>
                <td className="px-4 py-2 text-slate-500">
                  {statusByFile[f.file_id] || "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleBackup(f.file_id)}
                    className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                  >
                    Backup
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
