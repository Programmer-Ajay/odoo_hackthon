"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("Employee");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">
            Manage employees, managers, and roles
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* Dummy Users List */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="font-semibold">Admin User</p>
            <p className="text-sm text-gray-500">admin@acme.com</p>
          </div>
          <span className="bg-gray-200 px-2 py-1 rounded text-sm">
            Admin
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex justify-between">
          <div>
            <p className="font-semibold">Jane Smith</p>
            <p className="text-sm text-gray-500">jane@acme.com</p>
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
            Manager
          </span>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          
          <div className="bg-white rounded-xl w-[400px] p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Add New User</h2>
            <p className="text-sm text-gray-500 mb-4">
              Create a new employee or manager account
            </p>

            {/* Full Name */}
            <div className="mb-3">
              <label className="text-sm">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="john@acme.com"
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="text-sm">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              >
                <option>Employee</option>
                <option>Manager</option>
              </select>
            </div>

            {/* ✅ CONDITIONAL MANAGER FIELD */}
            {role === "Employee" && (
              <div className="mb-3">
                <label className="text-sm">Manager</label>
                <select className="w-full border p-2 rounded mt-1">
                  <option>Select manager</option>
                  <option>Jane Smith</option>
                  <option>Tom Brown</option>
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
                Add User
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}

    </DashboardLayout>
  );
}