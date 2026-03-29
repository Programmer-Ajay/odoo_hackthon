import DashboardLayout from "@/components/ui/DashboardLayout";

export default function AdminPage() {
  return (
    <DashboardLayout>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Company-wide expense overview</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Expenses</p>
          <h2 className="text-xl font-bold">$124,580</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active Users</p>
          <h2 className="text-xl font-bold">24</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending Approvals</p>
          <h2 className="text-xl font-bold">12</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Approval Rules</p>
          <h2 className="text-xl font-bold">6</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Manage Users
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">
            Approval Rules
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">
            View Expenses
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">

        {/* Activity */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Recent Activity</h2>
          <ul className="space-y-2 text-sm">
            <li>New user created</li>
            <li>Approval rule updated</li>
            <li>Expense overridden</li>
            <li>New manager assigned</li>
          </ul>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">All Company Expenses</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th>Employee</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td>Sarah Chen</td>
                <td>$3048</td>
                <td className="text-yellow-500">Pending</td>
              </tr>
              <tr className="border-t">
                <td>Mike Johnson</td>
                <td>$1899</td>
                <td className="text-green-500">Approved</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}