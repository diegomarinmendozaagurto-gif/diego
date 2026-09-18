import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Costs from "./pages/Costs";
import Infrastructure from "./pages/Infrastructure";
import Security from "./pages/Security";
import Network from "./pages/Network";
import Services from "./pages/Services";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* md:pl-64 deja el espacio del sidebar fijo (w-64) solo en desktop */}
        <div className="flex min-h-screen flex-col md:pl-64">
          <Header onOpenMenu={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/costs" element={<Costs />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/security" element={<Security />} />
              <Route path="/network" element={<Network />} />
              <Route path="/services" element={<Services />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}