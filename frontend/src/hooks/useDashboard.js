import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/dashboard");
      setSummary(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard KPIs:", err);
      setError(err.response?.data?.error?.message || "Unable to reach Team D BFF server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { summary, loading, error, refresh: fetchDashboard };
}
