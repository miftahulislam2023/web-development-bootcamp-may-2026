"use client";

import { useState } from "react";
import TopNavbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 min-h-[calc(100vh-60px)]">{children}</main>
      </div>
    </div>
  );
}
