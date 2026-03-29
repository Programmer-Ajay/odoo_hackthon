"use client";

import { useState } from "react";
import DashboardLayout from "@/components/ui/DashboardLayout";

const data = [
  {
    employee: "Sarah Chen",
    date: "2024-01-15",
    description: "Business trip to London",
    category: "Travel",
    amount: "$3,048.00",
    status: "Pending",
    step: "Manager",
  },
  {
    employee: "Mike Johnson",
    date: "2024-01-14",
    description: "New laptop for dev team",
    category: "Equipment",
    amount: "$1,899.00",
    status: "Pending",
    step: "Finance",
  },
  {
    employee: "Amy Lee",
    date: "2024-01-13",
    description: "Client dinner",
    category: "Meals",
    amount: "$201.50",
    status: "Pending",
    step: "Manager",
  },
  {
    employee: "Lisa Park",
    date: "2024-01-12",
    description: "Conference registration",
    category: "Travel",
    amount: "$799.00",
    status: "Approved",
    step: "Complete",
  },
];

export default function ExpensesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) => {
    return (
      (filter === "All" || item.status === filter) &&
      item.employee.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusStyle = (status: string) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
  };

  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Expenses</h1>
        <p className="text-gray-500">
          Company-wide expense overview
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by employee..."
          className="border px-3 py-2 rounded w-64"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr className="text-left">
              <th className="p-3">Employee</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Step</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.employee}</td>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>{item.amount}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{item.step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}