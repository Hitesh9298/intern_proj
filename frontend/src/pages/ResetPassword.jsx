import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMsg("Password has been reset. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Error resetting password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6v2m-6 4v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">Reset Password</h1>
          <p className="text-gray-500 text-sm">Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold text-lg shadow-md hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-transform duration-150" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Resetting...
              </span>
            ) : "Reset Password"}
          </button>
          {msg && <div className="text-green-600 text-center font-semibold animate-fade-in">{msg}</div>}
          {error && <div className="text-red-600 text-center font-semibold animate-fade-in">{error}</div>}
        </form>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 