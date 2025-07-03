import { useAuth } from "../components/AuthContext";
import { AcademicCapIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/student";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { authorization: token };
    async function fetchData() {
      setLoading(true);
      try {
        const [att, res, not, fe] = await Promise.all([
          axios.get(`${API_URL}/attendance`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/results`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/notices`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/fees`, { headers }).then(r => r.data),
        ]);
        console.log('Attendance:', att);
        console.log('Results:', res);
        console.log('Notices:', not);
        console.log('Fee:', fe);
        setAttendance(att);
        setResults(res);
        setNotices(not);
        setFee(fe);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center">
        <AcademicCapIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Student</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">{user?.name || "Student"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <ul className="space-y-3 w-full">
          <li><a href="#attendance" className="block px-4 py-2 rounded hover:bg-blue-100">Attendance</a></li>
          <li><a href="#results" className="block px-4 py-2 rounded hover:bg-blue-100">Results</a></li>
          <li><a href="#notices" className="block px-4 py-2 rounded hover:bg-blue-100">Notices</a></li>
          <li><a href="#fees" className="block px-4 py-2 rounded hover:bg-blue-100">Fees</a></li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Welcome, {user?.name || "Student"}!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{attendance?.percentage ?? "--"}%</div>
              <div className="text-gray-500 text-sm">Attendance</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">{results[0]?.cgpa ?? "--"}</div>
              <div className="text-gray-500 text-sm">CGPA</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-700">{fee?.status ?? "--"}</div>
              <div className="text-gray-500 text-sm">Fees</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <AcademicCapIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{notices.length}</div>
              <div className="text-gray-500 text-sm">Notices</div>
            </div>
          </div>
        </div>
        {/* Sections */}
        <section id="attendance" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Attendance</h2>
          <div className="bg-white p-6 rounded shadow">
            {attendance ? (
              <div>
                <p><b>Attended:</b> {attendance.attended} / {attendance.total}</p>
                <p><b>Percentage:</b> {attendance.percentage}%</p>
              </div>
            ) : <p>No attendance data.</p>}
          </div>
        </section>
        <section id="results" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Results</h2>
          <div className="bg-white p-6 rounded shadow">
            {results.length ? results.map((r, i) => (
              <div key={i} className="mb-4">
                <div className="font-bold">Semester: {r.semester} | CGPA: {r.cgpa}</div>
                <ul className="list-disc ml-6">
                  {r.subjects.map((s, j) => (
                    <li key={j}>{s.name}: {s.grade} ({s.marks} marks)</li>
                  ))}
                </ul>
              </div>
            )) : <p>No results data.</p>}
          </div>
        </section>
        <section id="notices" className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-purple-700">Notices</h2>
          <div className="bg-white p-6 rounded shadow">
            {notices.length ? (
              <ul>
                {notices.map((n, i) => (
                  <li key={i} className="mb-2">
                    <b>{n.title}</b> <span className="text-xs text-gray-500">({new Date(n.date).toLocaleDateString()})</span>
                    <div>{n.content}</div>
                  </li>
                ))}
              </ul>
            ) : <p>No notices.</p>}
          </div>
        </section>
        <section id="fees">
          <h2 className="text-xl font-semibold mb-2 text-yellow-700">Fees</h2>
          <div className="bg-white p-6 rounded shadow">
            {fee ? (
              <div>
                <p><b>Status:</b> {fee.status}</p>
                <p><b>Amount:</b> ₹{fee.amount}</p>
                {fee.dueDate && <p><b>Due Date:</b> {new Date(fee.dueDate).toLocaleDateString()}</p>}
                {fee.lastPaid && <p><b>Last Paid:</b> {new Date(fee.lastPaid).toLocaleDateString()}</p>}
              </div>
            ) : <p>No fee data.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}