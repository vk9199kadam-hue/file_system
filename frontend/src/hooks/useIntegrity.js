import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useIntegrity() {
  const [integrity, setIntegrity] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchIntegrity = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/ui/integrity");
      setIntegrity(res.data.data);
    } catch (err) {
      setError("Failed to fetch Merkle tree integrity.");
    }
  }, []);

  useEffect(() => {
    fetchIntegrity();
  }, [fetchIntegrity]);

  const runVerificationPreview = async () => {
    setVerifying(true);
    try {
      const res = await axios.post("/api/v1/ui/integrity/verify/preview");
      setPreviewResult(res.data.data);
      return res.data.data;
    } catch (err) {
      setError("Verification preview failed.");
    } finally {
      setVerifying(false);
    }
  };

  return { integrity, verifying, previewResult, error, runVerificationPreview };
}
