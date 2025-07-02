import { useAuth } from "../components/AuthContext";
import { UserGroupIcon, CalendarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function FacultyDashboard() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center">
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Faculty</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">{user?.name || "Faculty"}</div>
          <div className="text-xs text-gray-500">faculty@college.edu</div>
        </div>
        <ul className="space-y-3 w-full">
          <li><a href="#mark-attendance" className="block px-4 py-2 rounded hover:bg-blue-100">Mark Attendance</a></li>
          <li><a href="#update-grades" className="block px-4 py-2 rounded hover:bg-blue-100">Update Grades</a></li>
          <li><a href="#timetable" className="block px-4 py-2 rounded hover:bg-blue-100">Timetable</a></li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Welcome, {user?.name || "Faculty"}!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">5</div>
              <div className="text-gray-500 text-sm">Classes Today</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">2</div>
              <div className="text-gray-500 text-sm">Pending Grades</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">120</div>
              <div className="text-gray-500 text-sm">Students</div>
            </div>
          </div>
        </div>
        {/* Sections */}
        <section id="mark-attendance" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Mark Attendance</h2>
          <div className="bg-white p-6 rounded shadow">(Attendance marking UI here)</div>
        </section>
        <section id="update-grades" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Update Grades</h2>
          <div className="bg-white p-6 rounded shadow">(Grades update UI here)</div>
        </section>
        <section id="timetable">
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Timetable</h2>
          <div className="bg-white p-6 rounded shadow">(Timetable here)</div>
        </section>
      </main>
    </div>
  );
} 