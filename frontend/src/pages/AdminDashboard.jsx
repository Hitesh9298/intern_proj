import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserGroupIcon, AcademicCapIcon, ClipboardDocumentListIcon, BuildingOffice2Icon, PlusCircleIcon, TrashIcon, PencilIcon, ArrowDownTrayIcon, KeyIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState({});
  const [newDept, setNewDept] = useState({ name: '' });
  const [editDept, setEditDept] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', empid: '', department: '' });
  const [editTeacher, setEditTeacher] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '', rollno: '', department: '' });
  const [editStudent, setEditStudent] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);
  const [resetRole, setResetRole] = useState('');
  const [resetPassword, setResetPassword] = useState('');

  const token = localStorage.getItem('token');
  const headers = { headers: { authorization: token } };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    axios.get(`${API_URL}/departments`, headers).then(res => setDepartments(res.data));
    axios.get(`${API_URL}/teachers`, headers).then(res => setTeachers(res.data));
    axios.get(`${API_URL}/students`, headers).then(res => setStudents(res.data));
    axios.get(`${API_URL}/reports`, headers).then(res => setReports(res.data));
  };

  // Department CRUD
  const handleAddDept = e => {
    e.preventDefault();
    axios.post(`${API_URL}/departments`, newDept, headers).then(() => {
      setNewDept({ name: '' });
      fetchAll();
    });
  };
  const handleEditDept = e => {
    e.preventDefault();
    axios.put(`${API_URL}/departments/${editDept._id}`, editDept, headers).then(() => {
      setEditDept(null);
      fetchAll();
    });
  };
  const handleDeleteDept = id => {
    axios.delete(`${API_URL}/departments/${id}`, headers).then(fetchAll);
  };

  // Teacher CRUD
  const handleAddTeacher = e => {
    e.preventDefault();
    axios.post(`${API_URL}/teachers`, newTeacher, headers).then(() => {
      setNewTeacher({ name: '', email: '', password: '', empid: '', department: '' });
      fetchAll();
    });
  };
  const handleEditTeacher = e => {
    e.preventDefault();
    axios.put(`${API_URL}/teachers/${editTeacher._id}`, editTeacher, headers).then(() => {
      setEditTeacher(null);
      fetchAll();
    });
  };
  const handleDeleteTeacher = id => {
    axios.delete(`${API_URL}/teachers/${id}`, headers).then(fetchAll);
  };

  // Student CRUD
  const handleAddStudent = e => {
    e.preventDefault();
    axios.post(`${API_URL}/students`, newStudent, headers).then(() => {
      setNewStudent({ name: '', email: '', password: '', rollno: '', department: '' });
      fetchAll();
    });
  };
  const handleEditStudent = e => {
    e.preventDefault();
    axios.put(`${API_URL}/students/${editStudent._id}`, editStudent, headers).then(() => {
      setEditStudent(null);
      fetchAll();
    });
  };
  const handleDeleteStudent = id => {
    axios.delete(`${API_URL}/students/${id}`, headers).then(fetchAll);
  };

  const handleResetPassword = (userId, role) => {
    setResetUserId(userId);
    setResetRole(role);
    setShowResetModal(true);
    setResetPassword('');
  };
  const submitResetPassword = () => {
    if (!resetPassword) return;
    axios.put(`${API_URL}/reset-password/${resetUserId}`, { password: resetPassword }, headers)
      .then(() => {
        alert("Password reset!");
        setShowResetModal(false);
        setResetUserId(null);
        setResetRole('');
        setResetPassword('');
      });
  };

  const exportCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logAction = (action) => {
    const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
    logs.unshift({ action, time: new Date().toLocaleString() });
    localStorage.setItem('adminLogs', JSON.stringify(logs));
  };

  useEffect(() => {
    // Example: log when a department is added
    // logAction('Added department: ' + newDept.name);
  }, []);

  const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');

  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center">
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Admin</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">Admin User</div>
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
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Welcome, Admin User!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <BuildingOffice2Icon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{reports.totalDepartments || 0}</div>
              <div className="text-gray-500 text-sm">Departments</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <AcademicCapIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">{reports.totalTeachers || 0}</div>
              <div className="text-gray-500 text-sm">Teachers</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{reports.totalStudents || 0}</div>
              <div className="text-gray-500 text-sm">Students</div>
            </div>
          </div>
        </div>
        {/* Departments Section */}
        <section id="departments" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-l-4 border-blue-400 pl-2 flex items-center justify-between">
            Departments
            <button onClick={() => exportCSV(departments, 'departments.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold shadow transition text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-6 rounded shadow mb-4">
            <form onSubmit={editDept ? handleEditDept : handleAddDept} className="flex gap-2 mb-4">
              <input type="text" placeholder="Department Name" className="border rounded px-2 py-1 flex-1" value={editDept ? editDept.name : newDept.name} onChange={e => editDept ? setEditDept({ ...editDept, name: e.target.value }) : setNewDept({ ...newDept, name: e.target.value })} required />
              <select
                className="border rounded px-2 py-1"
                value={editDept ? (editDept.head || '') : (newDept.head || '')}
                onChange={e => editDept ? setEditDept({ ...editDept, head: e.target.value }) : setNewDept({ ...newDept, head: e.target.value })}
              >
                <option value="">--Select Head--</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
                <PlusCircleIcon className="h-5 w-5" /> {editDept ? 'Update' : 'Add'}
              </button>
              {editDept && <button type="button" className="ml-2 text-gray-500" onClick={() => setEditDept(null)}>Cancel</button>}
            </form>
            <ul>
              {departments.map(d => (
                <li key={d._id} className="flex items-center justify-between border-b py-2">
                  <span>{d.name}</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditDept(d)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteDept(d._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Teachers Section */}
        <section id="teachers" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700 border-l-4 border-green-400 pl-2 flex items-center justify-between">
            Teachers
            <button onClick={() => exportCSV(teachers, 'teachers.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-semibold shadow transition text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-6 rounded shadow mb-4">
            <form onSubmit={editTeacher ? handleEditTeacher : handleAddTeacher} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <input type="text" placeholder="Name" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.name : newTeacher.name} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, name: e.target.value }) : setNewTeacher({ ...newTeacher, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.email : newTeacher.email} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, email: e.target.value }) : setNewTeacher({ ...newTeacher, email: e.target.value })} required />
              <input type="text" placeholder="EmpID" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.empid : newTeacher.empid} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, empid: e.target.value }) : setNewTeacher({ ...newTeacher, empid: e.target.value })} required />
              <input type="text" placeholder="Department" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.department : newTeacher.department} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, department: e.target.value }) : setNewTeacher({ ...newTeacher, department: e.target.value })} required />
              {!editTeacher && <input type="password" placeholder="Password" className="border rounded px-2 py-1" value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })} required />}
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1 col-span-1">
                <PlusCircleIcon className="h-5 w-5" /> {editTeacher ? 'Update' : 'Add'}
              </button>
              {editTeacher && <button type="button" className="ml-2 text-gray-500 col-span-1" onClick={() => setEditTeacher(null)}>Cancel</button>}
            </form>
            <ul>
              {teachers.map(t => (
                <li key={t._id} className="flex items-center justify-between border-b py-2">
                  <span>{t.name} ({t.email})</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditTeacher(t)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteTeacher(t._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                    <button className="text-orange-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50" onClick={() => handleResetPassword(t._id, 'teacher')}><KeyIcon className="h-4 w-4" />Reset Password</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Students Section */}
        <section id="students" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 border-l-4 border-purple-400 pl-2 flex items-center justify-between">
            Students
            <button onClick={() => exportCSV(students, 'students.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-semibold shadow transition text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-6 rounded shadow mb-4">
            <form onSubmit={editStudent ? handleEditStudent : handleAddStudent} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <input type="text" placeholder="Name" className="border rounded px-2 py-1" value={editStudent ? editStudent.name : newStudent.name} onChange={e => editStudent ? setEditStudent({ ...editStudent, name: e.target.value }) : setNewStudent({ ...newStudent, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="border rounded px-2 py-1" value={editStudent ? editStudent.email : newStudent.email} onChange={e => editStudent ? setEditStudent({ ...editStudent, email: e.target.value }) : setNewStudent({ ...newStudent, email: e.target.value })} required />
              <input type="text" placeholder="Roll No" className="border rounded px-2 py-1" value={editStudent ? editStudent.rollno : newStudent.rollno} onChange={e => editStudent ? setEditStudent({ ...editStudent, rollno: e.target.value }) : setNewStudent({ ...newStudent, rollno: e.target.value })} required />
              <input type="text" placeholder="Department" className="border rounded px-2 py-1" value={editStudent ? editStudent.department : newStudent.department} onChange={e => editStudent ? setEditStudent({ ...editStudent, department: e.target.value }) : setNewStudent({ ...newStudent, department: e.target.value })} required />
              {!editStudent && <input type="password" placeholder="Password" className="border rounded px-2 py-1" value={newStudent.password} onChange={e => setNewStudent({ ...newStudent, password: e.target.value })} required />}
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-1 col-span-1">
                <PlusCircleIcon className="h-5 w-5" /> {editStudent ? 'Update' : 'Add'}
              </button>
              {editStudent && <button type="button" className="ml-2 text-gray-500 col-span-1" onClick={() => setEditStudent(null)}>Cancel</button>}
            </form>
            <ul>
              {students.map(s => (
                <li key={s._id} className="flex items-center justify-between border-b py-2">
                  <span>{s.name} ({s.email})</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditStudent(s)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteStudent(s._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                    <button className="text-orange-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50" onClick={() => handleResetPassword(s._id, 'student')}><KeyIcon className="h-4 w-4" />Reset Password</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Reports Section */}
        <section id="reports">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700 border-l-4 border-yellow-400 pl-2">Reports</h2>
          <div className="bg-white p-6 rounded shadow">
            <ul>
              <li>Total Departments: <b>{reports.totalDepartments || 0}</b></li>
              <li>Total Teachers: <b>{reports.totalTeachers || 0}</b></li>
              <li>Total Students: <b>{reports.totalStudents || 0}</b></li>
            </ul>
          </div>
        </section>
        {/* Activity Logs Section */}
        <section id="logs">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-l-4 border-gray-400 pl-2">Activity Logs</h2>
          <div className="bg-white p-6 rounded shadow">
            <ul>
              {logs.map((log, i) => (
                <li key={i}>{log.time}: {log.action}</li>
              ))}
            </ul>
          </div>
        </section>
        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><KeyIcon className="h-5 w-5 text-orange-500" />Reset Password</h3>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Enter new password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowResetModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={submitResetPassword}>Reset</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}