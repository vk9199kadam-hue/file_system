import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("apnileap_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [correlationId, setCorrelationId] = useState("corr-init-901");
  const [networkMode, setNetworkMode] = useState("ON_PREM_LAN"); // "ON_PREM_LAN" | "REMOTE_VPN"
  const [vpnConnected, setVpnConnected] = useState(true);
  const [vpnTunnelId, setVpnTunnelId] = useState("VPN-APNILEAP-SEC-9102");

  useEffect(() => {
    if (user) {
      localStorage.setItem("apnileap_user", JSON.stringify(user));
      axios.defaults.headers.common["X-User-Role"] = user.role;
      axios.defaults.headers.common["X-Username"] = user.username;
    } else {
      localStorage.removeItem("apnileap_user");
      delete axios.defaults.headers.common["X-User-Role"];
      delete axios.defaults.headers.common["X-Username"];
    }

    if (networkMode === "REMOTE_VPN" && vpnConnected) {
      axios.defaults.headers.common["X-VPN-Tunnel-ID"] = vpnTunnelId;
    } else {
      delete axios.defaults.headers.common["X-VPN-Tunnel-ID"];
    }
  }, [user, networkMode, vpnConnected, vpnTunnelId]);

  const login = async (username, password, role) => {
    try {
      const res = await axios.post("/api/v1/ui/session", { username, password, role });
      const userData = res.data.data.user;
      const corrId = res.data.meta?.correlation_id || "corr-" + Date.now();
      setUser(userData);
      setCorrelationId(corrId);
      return userData;
    } catch (err) {
      // Fallback local login
      const fallbackUser = {
        username: username || "emp_rahul",
        name: (username || "Rahul Sharma").replace("_", " ").toUpperCase(),
        role: role || "Employee",
        department: "Engineering",
        accessMode: "Remote & On-Prem",
        institution_id: "RIT-CSE-2026"
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = async () => {
    try {
      await axios.delete("/api/v1/ui/session");
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  const toggleVpn = () => {
    setVpnConnected(prev => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        correlationId,
        setCorrelationId,
        networkMode,
        setNetworkMode,
        vpnConnected,
        toggleVpn,
        vpnTunnelId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
