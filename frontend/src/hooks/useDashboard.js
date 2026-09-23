import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getLocalDashboard } from "../mockData";

export function useDashboard() {
  const [summary, setSummary] = useState(() => getLocalDashboard());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/dashboard");
      if (res.data?.data) {
        setSummary(res.data.data);
      } else {
        setSummary(getLocalDashboard());
      }
    } catch (err) {
      console.warn("BFF dashboard API offline, using local metrics:", err.message);
      setSummary(getLocalDashboard());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { summary, loading, error, refresh: fetchDashboard };
}

