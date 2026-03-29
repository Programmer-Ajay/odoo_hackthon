export default function Topbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      
      <div className="flex gap-3">
        <button className="px-3 py-1 bg-gray-200 rounded-lg">Admin</button>
        <button className="px-3 py-1 text-gray-500">Manager</button>
        <button className="px-3 py-1 text-gray-500">Employee</button>
      </div>

      <div className="flex items-center gap-4">
        <span>🔔</span>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
            AU
          </div>
          <span>Admin User</span>
        </div>
      </div>
    </div>
  );
}