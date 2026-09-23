import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";

// Connect to local backend if running locally, or the active Cloudflare Tunnel if running on Vercel/cloud
const CURRENT_ACTIVE_TUNNEL = "https://purposes-perfect-symphony-volvo.trycloudflare.com";

let targetApiUrl = import.meta.env.VITE_API_URL;
if (!targetApiUrl || targetApiUrl.includes("about-london-stake-medium") || targetApiUrl.includes("smart-lights-tap")) {
  targetApiUrl = CURRENT_ACTIVE_TUNNEL;
}

const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
axios.defaults.baseURL = isLocal ? "http://localhost:4000" : targetApiUrl;
console.log("[ApniLeap] Connected to BFF at:", axios.defaults.baseURL);




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
