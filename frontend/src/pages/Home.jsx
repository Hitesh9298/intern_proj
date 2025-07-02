import { AcademicCapIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: "Student Records",
    icon: UserGroupIcon,
    desc: "Manage student profiles, academic history, and more."
  },
  {
    name: "Attendance",
    icon: CalendarIcon,
    desc: "Track and manage attendance for students and faculty."
  },
  {
    name: "Fees Management",
    icon: CurrencyDollarIcon,
    desc: "Monitor fee payments, dues, and receipts."
  },
  {
    name: "Timetable Scheduling",
    icon: ClipboardDocumentListIcon,
    desc: "Create and view class schedules and exam timetables."
  },
  {
    name: "Notices & Events",
    icon: AcademicCapIcon,
    desc: "Stay updated with college events and important notices."
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <AcademicCapIcon className="h-16 w-16 text-blue-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Welcome to ERP Lite</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
          A lightweight, modern ERP system for colleges. Manage students, faculty, attendance, fees, and more—all in one place.
        </p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</a>
          <a href="/register" className="px-6 py-2 bg-gray-200 text-blue-700 rounded hover:bg-gray-300 transition">Register</a>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 bg-white">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-10">Key Features</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
              <feature.icon className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-blue-800 mb-1">{feature.name}</h3>
              <p className="text-gray-600 text-center text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 