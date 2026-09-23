import { useState } from "react";
import axios from "axios";

export function useBackups() {
  const [backupStatus, setBackupStatus] = useState({});
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [error, setError] = useState(null);

  const startBackup = async (fileId, backupType = "FULL", priority = 3) => {
    setLoadingFileId(fileId);
    setError(null);
    const idempotencyKey = "idemp-bkp-" + Date.now();

    try {
      const res = await axios.post(
        "/api/v1/ui/backups",
        { file_id: fileId, backup_type: backupType, priority },
        { headers: { "Idempotency-Key": idempotencyKey } }
      );

      const data = res.data.data;
      setBackupStatus((prev) => ({
        ...prev,
        [fileId]: {
          backup_id: data.backup_id,
          state: data.state,
          queue_position: data.queue_position,
          correlation_id: res.data.meta?.correlation_id
        }
      }));

      return data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to trigger backup request.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoadingFileId(null);
    }
  };

  const getBackupDetail = async (backupId) => {
    try {
      const res = await axios.get(`/api/v1/ui/backups/${backupId}`);
      return res.data.data;
    } catch (err) {
      throw new Error("Failed to load backup details.");
    }
  };

  return { backupStatus, loadingFileId, error, startBackup, getBackupDetail };
}
