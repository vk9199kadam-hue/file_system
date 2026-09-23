import { useState } from "react";
import axios from "axios";

export function useRestore() {
  const [restoringFileId, setRestoringFileId] = useState(null);
  const [lastRestore, setLastRestore] = useState(null);
  const [error, setError] = useState(null);

  const startRestore = async (fileId, versionId, targetPath) => {
    setRestoringFileId(fileId);
    setError(null);
    const idempotencyKey = "idemp-rst-" + Date.now();

    try {
      const res = await axios.post(
        "/api/v1/ui/restores",
        { file_id: fileId, version_id: versionId, target_path: targetPath },
        { headers: { "Idempotency-Key": idempotencyKey } }
      );

      const data = res.data.data;
      setLastRestore(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to trigger restore operation.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setRestoringFileId(null);
    }
  };

  return { restoringFileId, lastRestore, error, startRestore };
}
