import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserGroupIcon, CalendarIcon, ClipboardDocumentListIcon, PlusCircleIcon, TrashIcon, Bars3Icon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../components/AuthContext';

const API_URL = "http://localhost:5000/api/faculty";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [attendanceMsg, setAttendanceMsg] = useState('');
  const [resultMsg, setResultMsg] = useState('');
  const [newResult, setNewResult] = useState({ semester: '', cgpa: '', subjects: [{ name: '', grade: '', marks: '' }] });
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [notices, setNotices] = useState([]);
  const [newTimetable, setNewTimetable] = useState({ day: '', time: '', subject: '', class: '' });
  const [headDept, setHeadDept] = useState(null);
  const token = localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch students, timetable, and notices on mount
  useEffect(() => {
    axios.get(`${API_URL}/students`, { headers: { authorization: token } })
      .then(res => setStudents(res.data));
    axios.get(`${API_URL}/timetable`, { headers: { authorization: token } })
      .then(res => setTimetable(res.data));
    axios.get(`${API_URL}/notices`, { headers: { authorization: token } })
      .then(res => setNotices(res.data));
    axios.get(`${API_URL}/head-department`, { headers: { authorization: token } })
      .then(res => setHeadDept(res.data));
  }, [token]);

  // Fetch results for selected student
  useEffect(() => {
    if (selectedStudent) {
      axios.get(`${API_URL}/results/${selectedStudent._id}`, { headers: { authorization: token } })
        .then(res => setResults(res.data));
    }
  }, [selectedStudent, token]);

  // Mark attendance
  const markAttendance = (studentId, attended) => {
    axios.post(`${API_URL}/attendance`, { studentId, attended }, { headers: { authorization: token } })
      .then(res => setAttendanceMsg('Attendance marked!'));
  };

  // Add or update result
  const handleResultSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/results`, {
      studentId: selectedStudent._id,
      semester: newResult.semester,
      cgpa: newResult.cgpa,
      subjects: newResult.subjects
    }, { headers: { authorization: token } })
      .then(res => {
        setResultMsg('Result saved!');
        setResults(prev => {
          const idx = prev.findIndex(r => r.semester === res.data.semester);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = res.data;
            return updated;
          }
          return [...prev, res.data];
        });
      });
  };

  // Delete result
  const handleDeleteResult = (resultId) => {
    axios.delete(`${API_URL}/results/${resultId}`, { headers: { authorization: token } })
      .then(() => setResults(results.filter(r => r._id !== resultId)));
  };

  // Add subject to new result (now on next line)
  const addSubject = () => {
    setNewResult({ ...newResult, subjects: [...newResult.subjects, { name: '', grade: '', marks: '' }] });
  };

  // Update subject in new result
  const updateSubject = (idx, field, value) => {
    const updatedSubjects = newResult.subjects.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setNewResult({ ...newResult, subjects: updatedSubjects });
  };

  // Add timetable entry
  const handleAddTimetable = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/timetable`, newTimetable, { headers: { authorization: token } })
      .then(res => {
        setTimetable([...timetable, res.data]);
        setNewTimetable({ day: '', time: '', subject: '', class: '' });
      });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100">
      {/* Hamburger or Arrow for mobile */}
      {!sidebarOpen ? (
        <button
          className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-full shadow-lg border border-blue-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-7 w-7 text-blue-700" />
        </button>
      ) : (
        <button
          className="md:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded-full shadow-lg border border-blue-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <ChevronRightIcon className="h-7 w-7 text-blue-700" />
        </button>
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen md:h-auto min-h-screen w-64 bg-white shadow-lg p-6 flex flex-col items-center rounded-r-3xl transition-transform duration-300 flex-shrink-0
          md:relative md:translate-x-0 md:flex md:w-64 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '90vw' }}
        aria-label="Sidebar"
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 bg-blue-100 p-1 rounded-full"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6 text-blue-700" />
        </button>
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-2 mt-8 md:mt-0" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Faculty</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">{user?.name || 'Faculty User'}</div>
          <div className="text-xs text-gray-500">{user?.email || 'faculty@college.edu'}</div>
        </div>
        <ul className="space-y-3 w-full">
          <li>
            <a href="#attendance" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 text-base font-medium transition">
              <CalendarIcon className="h-5 w-5 text-blue-500" /> Mark Attendance
            </a>
          </li>
          <li>
            <a href="#grades" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 text-gray-700 text-base font-medium transition">
              <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" /> Update Grades
            </a>
          </li>
          <li>
            <a href="#timetable" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700 text-base font-medium transition">
              <UserGroupIcon className="h-5 w-5 text-purple-500" /> Timetable
            </a>
          </li>
          <li>
            <a href="#notices" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-100 text-gray-700 text-base font-medium transition">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" /> Notices
            </a>
          </li>
        </ul>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-4">
          Welcome, {user?.name || 'Faculty User'}!
          {headDept && (
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full border border-yellow-300 shadow-sm">
              Head of Department: {headDept.name}
            </span>
          )}
        </h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-blue-200">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">5</div>
              <div className="text-gray-500 text-sm">Classes Today</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-green-200">
            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">2</div>
              <div className="text-gray-500 text-sm">Pending Grades</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-purple-200">
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{students.length}</div>
              <div className="text-gray-500 text-sm">Students</div>
            </div>
          </div>
        </div>
        {/* Mark Attendance Section */}
        <section id="attendance" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-l-4 border-blue-400 pl-2">Mark Attendance</h2>
          <div className="bg-white p-6 rounded-xl shadow">
            <input
              type="text"
              placeholder="Search student by name or roll no..."
              className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={attendanceFilter}
              onChange={e => setAttendanceFilter(e.target.value)}
            />
            <ul className="divide-y divide-gray-100">
              {students.filter(s =>
                s.name.toLowerCase().includes(attendanceFilter.toLowerCase()) ||
                (s.rollno && s.rollno.toLowerCase().includes(attendanceFilter.toLowerCase()))
              ).map(s => (
                <li key={s._id} className="py-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{s.name} <span className="text-xs text-gray-400">({s.rollno})</span></span>
                  <div className="flex gap-2">
                    <button className="px-4 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 shadow-sm font-semibold transition" onClick={() => markAttendance(s._id, true)}>Present</button>
                    <button className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 shadow-sm font-semibold transition" onClick={() => markAttendance(s._id, false)}>Absent</button>
                  </div>
                </li>
              ))}
            </ul>
            {attendanceMsg && <div className="text-green-600 mt-3">{attendanceMsg}</div>}
          </div>
        </section>
        {/* Update Grades Section */}
        <section id="grades" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700 border-l-4 border-green-400 pl-2">Update Grades</h2>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="mb-4">
              <label className="font-medium">Select Student: </label>
              <select className="ml-2 border rounded px-2 py-1" onChange={e => setSelectedStudent(students.find(s => s._id === e.target.value))} value={selectedStudent?._id || ''}>
                <option value="">--Select--</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.rollno})</option>
                ))}
              </select>
            </div>
            {selectedStudent && (
              <div className="overflow-x-auto w-full">
                <h3 className="mt-4 font-semibold">Existing Results</h3>
                <ul className="mb-4 min-w-[340px] md:min-w-0">
                  {results.map(r => (
                    <li key={r._id} className="mb-2 border-b pb-2">
                      <b>{r.semester}</b> | CGPA: {r.cgpa}
                      <ul className="ml-4 text-sm">
                        {r.subjects.map((sub, i) => (
                          <li key={i}>{sub.name}: {sub.grade} ({sub.marks} marks)</li>
                        ))}
                      </ul>
                      <button className="text-red-600 text-xs mt-1 flex items-center gap-1" onClick={() => handleDeleteResult(r._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleResultSubmit} className="space-y-2 min-w-[340px] md:min-w-0">
                  <div className="flex gap-2 flex-wrap">
                    <input type="text" placeholder="Semester" className="border rounded px-2 py-1 flex-1 min-w-[100px]" value={newResult.semester} onChange={e => setNewResult({ ...newResult, semester: e.target.value })} required />
                    <input type="number" step="0.01" placeholder="CGPA" className="border rounded px-2 py-1 flex-1 min-w-[100px]" value={newResult.cgpa} onChange={e => setNewResult({ ...newResult, cgpa: e.target.value })} required />
                  </div>
                  <div>
                    <b>Subjects:</b>
                    <div className="flex flex-col gap-3 mt-2">
                      {newResult.subjects.map((sub, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm flex flex-col gap-2 relative mt-2">
                          <div className="flex gap-2 flex-wrap">
                            <input type="text" placeholder="Name" className="border rounded px-2 py-1 flex-1 min-w-[80px]" value={sub.name} onChange={e => updateSubject(idx, 'name', e.target.value)} required />
                            <input type="text" placeholder="Grade" className="border rounded px-2 py-1 flex-1 min-w-[60px]" value={sub.grade} onChange={e => updateSubject(idx, 'grade', e.target.value)} required />
                            <input type="number" placeholder="Marks" className="border rounded px-2 py-1 flex-1 min-w-[60px]" value={sub.marks} onChange={e => updateSubject(idx, 'marks', e.target.value)} required />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold shadow transition" onClick={addSubject}>
                      <PlusCircleIcon className="h-5 w-5" /> Add Subject
                    </button>
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 font-semibold">Save Result</button>
                </form>
                {resultMsg && <div className="text-green-600 mt-2">{resultMsg}</div>}
              </div>
            )}
          </div>
        </section>
        {/* Timetable Section */}
        <section id="timetable" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 border-l-4 border-purple-400 pl-2">Timetable</h2>
          <div className="bg-white p-6 rounded-xl shadow mb-4">
            <form onSubmit={handleAddTimetable} className="flex flex-wrap gap-2 mb-4">
              <input type="text" placeholder="Day" className="border rounded px-2 py-1" value={newTimetable.day} onChange={e => setNewTimetable({ ...newTimetable, day: e.target.value })} required />
              <input type="text" placeholder="Time" className="border rounded px-2 py-1" value={newTimetable.time} onChange={e => setNewTimetable({ ...newTimetable, time: e.target.value })} required />
              <input type="text" placeholder="Subject" className="border rounded px-2 py-1" value={newTimetable.subject} onChange={e => setNewTimetable({ ...newTimetable, subject: e.target.value })} required />
              <input type="text" placeholder="Class" className="border rounded px-2 py-1" value={newTimetable.class} onChange={e => setNewTimetable({ ...newTimetable, class: e.target.value })} required />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-1">
                <PlusCircleIcon className="h-5 w-5" /> Add
              </button>
            </form>
            <ul>
              {timetable.map((t, i) => (
                <li key={i} className="mb-2">
                  <b>{t.day}:</b> {t.slots ? t.slots.map(slot => `${slot.time} - ${slot.subject} (${slot.class})`).join(', ') : `${t.time} - ${t.subject} (${t.class})`}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Notices Section */}
        <section id="notices" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 border-l-4 border-indigo-400 pl-2">Notices</h2>
          <div className="bg-white p-6 rounded-xl shadow">
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
      </main>
    </div>
  );
}