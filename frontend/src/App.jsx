import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider, useAuth } from "./components/AuthContext";
import NotificationBell from './components/NotificationBell';
import { NotificationProvider } from './components/NotificationContext';
import defaultAvatar from "./assets/default-avatar.png";
import { useState } from "react";
import { UserGroupIcon } from '@heroicons/react/24/outline';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}-dashboard`} />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/student-dashboard" element={
        <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/faculty-dashboard" element={
        <ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to={user ? `/${user.role}-dashboard` : "/"} />} />
    </Routes>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarUrl = user?.profileImage || defaultAvatar;
  return (
    <>
      {/* Branding bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-400 w-full" />
      <nav className="bg-white shadow-lg rounded-b-2xl mb-0 px-4 py-3 transition-all duration-300" style={{ boxShadow: '0 4px 24px 0 rgba(80, 112, 255, 0.07)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">ERP Lite</Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex justify-center items-center w-10 h-10 focus:outline-none"
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <UserGroupIcon className="h-7 w-7 text-blue-700" />
          </button>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600 font-medium transition">Home</Link>
            {!user && <Link to="/login" className="hover:text-blue-600 font-medium transition">Login</Link>}
            {!user && <Link to="/register" className="hover:text-blue-600 font-medium transition">Register</Link>}
            {user && <Link to={`/${user.role}-dashboard`} className="hover:text-blue-600 font-medium transition">Dashboard</Link>}
            <div className="flex items-center gap-4 ml-2">
              {user && (
                <Link to="/profile" className="hover:text-blue-600 font-medium transition flex items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-blue-200 shadow-sm object-cover"
                  />
                  Profile
                </Link>
              )}
              {user && <NotificationBell />}
            </div>
            {user && (
              <button
                onClick={logout}
                className="ml-2 px-4 py-1 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100 transition border border-red-100 shadow-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4 bg-white rounded-xl shadow-lg p-4 border border-blue-100 animate-fade-in-up">
            <Link to="/" className="hover:text-blue-600 font-medium transition" onClick={() => setMenuOpen(false)}>Home</Link>
            {!user && <Link to="/login" className="hover:text-blue-600 font-medium transition" onClick={() => setMenuOpen(false)}>Login</Link>}
            {!user && <Link to="/register" className="hover:text-blue-600 font-medium transition" onClick={() => setMenuOpen(false)}>Register</Link>}
            {user && <Link to={`/${user.role}-dashboard`} className="hover:text-blue-600 font-medium transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {user && (
              <Link to="/profile" className="hover:text-blue-600 font-medium transition flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-blue-200 shadow-sm object-cover"
                />
                Profile
              </Link>
            )}
            {user && <div className="mt-2"><NotificationBell /></div>}
            {user && (
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="mt-2 px-4 py-1 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100 transition border border-red-100 shadow-sm w-full text-left"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Smooth, thin separator line below navbar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-80 blur-[1.5px]" style={{ boxShadow: '0 2px 8px 0 rgba(80,112,255,0.08)' }} />
            <div className="w-full">
              <AppRoutes />
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
