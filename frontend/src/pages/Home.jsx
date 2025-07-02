import { AcademicCapIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: "Student Records",
    icon: UserGroupIcon,
    desc: "Comprehensive student profiles with academic history, documents, and progress tracking.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Attendance",
    icon: CalendarIcon,
    desc: "Real-time attendance tracking with automated reports and notifications.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "Fees Management",
    icon: CurrencyDollarIcon,
    desc: "Secure payment processing with receipts, due reminders, and financial reports.",
    color: "bg-green-100 text-green-600"
  },
  {
    name: "Timetable Scheduling",
    icon: ClipboardDocumentListIcon,
    desc: "Smart scheduling with conflict detection and mobile-friendly views.",
    color: "bg-orange-100 text-orange-600"
  },
  {
    name: "Notices & Events",
    icon: AcademicCapIcon,
    desc: "Instant notifications for important announcements and campus events.",
    color: "bg-indigo-100 text-indigo-600"
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-white rounded-full p-4 shadow-lg mb-6">
              <AcademicCapIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              <span className="block text-blue-600">ERP Lite</span>
              <span className="block">College Management Simplified</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600">
              A modern, intuitive platform to manage all academic operations with ease and efficiency.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                Get Started
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-200"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one platform
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Designed to streamline college administration and enhance productivity
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="pt-8 pb-6 px-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center rounded-lg p-3 mb-4 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your institution?</span>
            <span className="block text-blue-200">Start using ERP Lite today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all"
              >
                Get started
                <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}