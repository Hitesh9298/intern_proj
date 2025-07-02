import { useAuth } from "../components/AuthContext";
import { UserGroupIcon, AcademicCapIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center">
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Admin</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">{user?.name || "Admin"}</div>
          <div className="text-xs text-gray-500">admin@college.edu</div>
        </div>
        <ul className="space-y-3 w-full">
          <li><a href="#departments" className="block px-4 py-2 rounded hover:bg-blue-100">Departments</a></li>
          <li><a href="#teachers" className="block px-4 py-2 rounded hover:bg-blue-100">Teachers</a></li>
          <li><a href="#students" className="block px-4 py-2 rounded hover:bg-blue-100">Students</a></li>
          <li><a href="#reports" className="block px-4 py-2 rounded hover:bg-blue-100">Reports</a></li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Welcome, {user?.name || "Admin"}!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">6</div>
              <div className="text-gray-500 text-sm">Departments</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <AcademicCapIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">45</div>
              <div className="text-gray-500 text-sm">Teachers</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">320</div>
              <div className="text-gray-500 text-sm">Students</div>
            </div>
          </div>
        </div>
        {/* Sections */}
        <section id="departments" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Departments</h2>
          <div className="bg-white p-6 rounded shadow">(Department management UI here)</div>
        </section>
        <section id="teachers" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Teachers</h2>
          <div className="bg-white p-6 rounded shadow">(Teacher management UI here)</div>
        </section>
        <section id="students" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Students</h2>
          <div className="bg-white p-6 rounded shadow">(Student management UI here)</div>
        </section>
        <section id="reports">
          <h2 className="text-xl font-semibold mb-2 text-yellow-700">Reports</h2>
          <div className="bg-white p-6 rounded shadow">(Reports here)</div>
        </section>
      </main>
    </div>
  );
} 