"use client";

import Sidebar from "./Sidebar";  // ✅ import your Sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ✅ USE COMPONENT INSTEAD OF HARDCODE */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white p-4 flex justify-between items-center shadow">
          <h1 className="font-bold text-lg">Admin Dashboard</h1>

          <div className="flex items-center gap-4">
            <span>🔔</span>
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
              AU
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}