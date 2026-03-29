"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";
import { Settings, Users, Zap } from "lucide-react";

export default function RulesPage() {
  const [showModal, setShowModal] = useState(false);
  const [isManagerApprover, setIsManagerApprover] = useState(true);

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Approval Rules</h1>
          <p className="text-gray-500 text-sm">
            Configure multi-level approval workflows and conditional rules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          + New Rule
        </button>
      </div>

      {/* ================= RULE 1 ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              Standard Approval
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Default flow for expenses under $5,000
            </p>
          </div>

          <Settings size={18} className="text-gray-500 cursor-pointer" />
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">APPROVAL STEPS</p>

          <div className="flex items-center gap-2 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Manager
            </span>

            <span>→</span>

            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Direct Manager
            </span>

            <span>→</span>

            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Finance Team
            </span>
          </div>
        </div>
      </div>

      {/* ================= RULE 2 ================= */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              High Value Approval
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              For expenses over $5,000 with conditional rules
            </p>
          </div>

          <Settings size={18} className="text-gray-500 cursor-pointer" />
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">APPROVAL STEPS</p>

          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Manager
            </span>

            <span>→</span>

            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Direct Manager
            </span>

            <span>→</span>

            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> Finance Head
            </span>

            <span>→</span>

            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={14} /> CFO
            </span>
          </div>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-600 flex items-center gap-1 mb-2">
            <Zap size={14} /> CONDITIONAL RULES
          </p>

          <div className="text-sm flex items-center gap-2 flex-wrap">
            <span className="text-green-700">60% approval threshold</span>

            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
              OR
            </span>

            <span className="text-green-700">
              CFO auto-approves
            </span>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          <div className="bg-white w-[420px] rounded-xl p-6 relative shadow-lg">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Create Approval Rule</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define approval steps and conditional rules
            </p>

            {/* Rule Name */}
            <div className="mb-4">
              <label className="text-sm font-medium">Rule Name</label>
              <input
                type="text"
                placeholder="e.g., Standard Approval"
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                placeholder="When this rule applies..."
                className="w-full border p-2 rounded-lg mt-1"
              />
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Manager is Approver</p>
                <p className="text-xs text-gray-500">
                  Direct manager must approve first
                </p>
              </div>

              <button
                onClick={() => setIsManagerApprover(!isManagerApprover)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                  isManagerApprover ? "bg-blue-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    isManagerApprover ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Full configuration available once Lovable Cloud is connected
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
                Create Rule
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}

    </DashboardLayout>
  );
}