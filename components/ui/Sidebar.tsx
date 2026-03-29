import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col justify-between p-4">
      
      <div>
        {/* Logo */}
        <h1 className="text-xl font-bold mb-6">ExpenseFlow</h1>

        {/* Company Info */}
        <div className="bg-blue-800 p-3 rounded-xl mb-6">
          <p className="font-semibold">Acme Corp</p>
          <p className="text-sm text-gray-300">Admin</p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          
          <Link
            href="/admin"
            className="block p-2 rounded-lg hover:bg-blue-700"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/expenses"
            className="block p-2 rounded-lg hover:bg-blue-700"
          >
            All Expenses
          </Link>

          <Link
            href="/admin/users"
            className="block p-2 rounded-lg hover:bg-blue-700"
          >
            Users
          </Link>

          <Link
            href="/admin/rules"
            className="block p-2 rounded-lg hover:bg-blue-700"
          >
            Approval Rules
          </Link>

        </div>
      </div>

      {/* Bottom */}
      <button className="text-left text-gray-300 hover:text-white">
        Sign Out
      </button>
    </div>
  );
}