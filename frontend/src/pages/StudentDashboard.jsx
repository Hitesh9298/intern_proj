import { useAuth } from "../components/AuthContext";
import { AcademicCapIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

const API_URL = "http://localhost:5000/api/student";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const gradeCardRef = useRef();

  // Debug: log roll number
  console.log("Student rollno:", user?.rollno, "rollNo:", user?.rollNo);

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

  // Scroll to section if hash is present in URL
  useEffect(() => {
    function scrollToHash() {
      if (window.location.hash) {
        const el = document.getElementById(window.location.hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    if (!loading) {
      scrollToHash();
    }
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [loading]);

  // Helper: get latest semester result
  const latestResult = results.length ? results[results.length - 1] : null;
  const overallCGPA = results.length
    ? (results.reduce((sum, r) => sum + (parseFloat(r.cgpa) || 0), 0) / results.length).toFixed(2)
    : "--";

  // Download as image (JPG) from hidden grade card
  const handleDownloadImage = async () => {
    if (!gradeCardRef.current) return;
    const canvas = await html2canvas(gradeCardRef.current, { scale: 2, backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.download = 'grade_card.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.98);
    link.click();
  };

  // Download as PDF from hidden grade card using html2canvas + jsPDF
  const handleDownloadPDF = async () => {
    if (!gradeCardRef.current) return;
    const canvas = await html2canvas(gradeCardRef.current, { scale: 2, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20; // 10mm margin each side
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const y = 10; // top margin
    pdf.addImage(imgData, "JPEG", 10, y, pdfWidth, pdfHeight);
    pdf.save("grade_card.pdf");
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-[80vh] bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center rounded-r-3xl">
        <AcademicCapIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Student</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">{user?.name || "Student"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <ul className="space-y-3 w-full">
          <li>
            <a href="#attendance" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 text-base font-medium transition">
              <CalendarIcon className="h-5 w-5 text-blue-500" /> Attendance
            </a>
          </li>
          <li>
            <a href="#results" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 text-gray-700 text-base font-medium transition">
              <ClipboardDocumentListIcon className="h-5 w-5 text-green-500" /> Results
            </a>
          </li>
          <li>
            <a href="#notices" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700 text-base font-medium transition">
              <AcademicCapIcon className="h-5 w-5 text-purple-500" /> Notices
            </a>
          </li>
          <li>
            <a href="#fees" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-yellow-100 text-gray-700 text-base font-medium transition">
              <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" /> Fees
            </a>
          </li>
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8">Welcome, {user?.name || "Student"}!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-blue-200">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{attendance?.percentage ?? "--"}%</div>
              <div className="text-gray-500 text-sm">Attendance</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-green-200">
            <ClipboardDocumentListIcon className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">
                {results.length
                  ? (results.reduce((sum, r) => sum + (parseFloat(r.cgpa) || 0), 0) / results.length).toFixed(2)
                  : "--"}
              </div>
              <div className="text-gray-500 text-sm">CGPA</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-yellow-200">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-700">{fee?.status ?? "--"}</div>
              <div className="text-gray-500 text-sm">Fees</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-b-4 border-purple-200">
            <AcademicCapIcon className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-700">{notices.length}</div>
              <div className="text-gray-500 text-sm">Notices</div>
            </div>
          </div>
        </div>
        {/* Sections */}
        <section id="attendance" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-l-4 border-blue-400 pl-2">Attendance</h2>
          <div className="bg-white p-6 rounded-xl shadow">
            {attendance ? (
              <div>
                <p><b>Attended:</b> {attendance.attended} / {attendance.total}</p>
                <p><b>Percentage:</b> {attendance.percentage}%</p>
              </div>
            ) : <p>No attendance data.</p>}
          </div>
        </section>
        <section id="results" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700 border-l-4 border-green-400 pl-2 flex items-center justify-between">
            Results
            <div className="flex gap-2">
              <button
                onClick={handleDownloadImage}
                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-semibold shadow transition text-sm"
              >
                Download as Image
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold shadow transition text-sm"
              >
                Download as PDF
              </button>
            </div>
          </h2>
          <div className="bg-white p-6 rounded-xl shadow">
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
          <div
            ref={gradeCardRef}
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 0,
              width: 794, // A4 width in px at 96dpi
              background: '#fff',
              padding: 32,
              fontFamily: 'serif'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <img src={logo} alt="Institute Logo" style={{ width: 90, margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 'bold', fontSize: 22, color: '#1e3a8a' }}>NATIONAL INSTITUTE OF TECHNOLOGY PATNA</div>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>Ashok Rajpath, Patna - 800005, Bihar</div>
              <div style={{ fontWeight: 'bold', fontSize: 20, color: '#b91c1c', margin: '8px 0' }}>Grade Card</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Print Date: {new Date().toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              <div>
                <b>Name:</b> {user?.name}<br />
                <b>Enrolment No.:</b> {user?.rollno || user?.rollNo || "N/A"}
              </div>
              <div>
                <b>Roll No.:</b> {user?.rollno || user?.rollNo || "N/A"}<br />
                <b>Semester:</b> {latestResult?.semester || "--"}
              </div>
            </div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              <b>Programme:</b> B.Tech-M.Tech-DD-CSE-CS
              <span style={{ marginLeft: 24 }}><b>Session:</b> {latestResult?.session || "2024-25"}</span>
            </div>
            <table style={{ width: '100%', border: '1px solid #000', fontSize: 13, marginBottom: 8, borderCollapse: 'collapse' }} cellPadding={4}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ border: '1px solid #000' }}>Course</th>
                  <th style={{ border: '1px solid #000' }}>Course Title</th>
                  <th style={{ border: '1px solid #000' }}>LTP</th>
                  <th style={{ border: '1px solid #000' }}>Credit</th>
                  <th style={{ border: '1px solid #000' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {latestResult?.subjects?.map((s, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #000' }}>{s.code || s.name}</td>
                    <td style={{ border: '1px solid #000' }}>{s.name}</td>
                    <td style={{ border: '1px solid #000' }}>{s.ltp || "--"}</td>
                    <td style={{ border: '1px solid #000' }}>{s.credits || "--"}</td>
                    <td style={{ border: '1px solid #000' }}>{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
              <div>SGPA: {latestResult?.cgpa || "--"}</div>
              <div>CGPA: {overallCGPA}</div>
              <div>Status: Pass</div>
            </div>
            <div style={{ fontSize: 12, color: '#374151', marginTop: 8 }}>
              <b>Note:</b>
              <ol style={{ marginLeft: 20 }}>
                <li>It is an electronic generated print, signature in original not required</li>
                <li>Conversion of CGPA/SGPA % of marks = CGPA/SGPA × 10</li>
              </ol>
            </div>
          </div>
        </section>
        <section id="notices" className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 border-l-4 border-purple-400 pl-2">Notices</h2>
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
        <section id="fees">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700 border-l-4 border-yellow-400 pl-2">Fees</h2>
          <div className="bg-white p-6 rounded-xl shadow">
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