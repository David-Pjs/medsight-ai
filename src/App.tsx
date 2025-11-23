// src/App.tsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import PharmacistView from "./components/PharmacistView";
import PharmacyDemoPage from "./components/PharmacyDemoPage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (_email: string, _password: string) => {
    // TODO: later call your Node backend + Dorra auth here.
    // For the demo we just flip the flag.
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* Public pharmacy routes - no login required */}
      <Route path="/pharmacy-demo" element={<PharmacyDemoPage />} />
      <Route path="/pharmacy" element={<PharmacistView />} />
      <Route path="/pharmacy/:token" element={<PharmacistView />} />

      {/* Protected doctor routes */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-slate-50 text-slate-900">
            {isAuthenticated ? (
              <Dashboard />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )}
          </div>
        }
      />
    </Routes>
  );
};

export default App;
