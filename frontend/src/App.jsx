import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Files from "./pages/Files.jsx";
import Reports from "./pages/Reports.jsx";
import Admin from "./pages/Admin.jsx";
import Integrity from "./pages/Integrity.jsx";

function Protected({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Layout>
              <Dashboard />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/files"
        element={
          <Protected>
            <Layout>
              <Files />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/integrity"
        element={
          <Protected>
            <Layout>
              <Integrity />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/reports"
        element={
          <Protected allowedRoles={["IT Admin", "Auditor"]}>
            <Layout>
              <Reports />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected allowedRoles={["IT Admin"]}>
            <Layout>
              <Admin />
            </Layout>
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
