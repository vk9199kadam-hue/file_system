import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";

// Connect to local backend if running locally, or the active Cloudflare Tunnel if running on Vercel/cloud
const DEFAULT_TUNNEL_URL = "https://about-london-stake-medium.trycloudflare.com";
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:4000" : DEFAULT_TUNNEL_URL);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
